/*
 * Vercel serverless function — live team data.
 *
 *   GET /api/teams?tournament=world|premier[&season=YYYY]
 *
 * Fetches the live standings for the requested competition from API-Football
 * (API-SPORTS) using the secret APISPORTS_KEY env var, then derives the rating
 * block (rating / attack / defense / form) that the client-side predictor
 * consumes. Pedigree, colours and honours come from static metadata.
 *
 * The API key is NEVER exposed to the browser — that is the whole reason this
 * runs on a server instead of in the page. If the key is missing or the upstream
 * call fails, we return { source: "fallback" } so the client can fall back to
 * its bundled sample ratings and clearly label them as such.
 */

const { metaFor } = require("./_meta");

const API_BASE = "https://v3.football.api-sports.io";

// API-Football league ids + the season to read for each competition.
// Season is the starting year; override with ?season= if the defaults drift.
const TOURNAMENTS = {
  world:   { league: 1,  season: 2026, label: "World Cup" },
  premier: { league: 39, season: 2025, label: "Premier League" },
};

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  // Edge-cache 30 min; the upstream feed only refreshes hourly and the free
  // tier is rate-limited, so we must not hammer it on every page load.
  res.setHeader("Cache-Control", "s-maxage=1800, stale-while-revalidate=3600");

  const tournamentId = String(req.query.tournament || "world").toLowerCase();
  const cfg = TOURNAMENTS[tournamentId];
  if (!cfg) return json(res, 400, { error: `unknown tournament '${tournamentId}'` });

  const season = Number(req.query.season) || cfg.season;
  const key = process.env.APISPORTS_KEY;

  if (!key) {
    return json(res, 200, { source: "fallback", reason: "no_api_key", tournament: tournamentId });
  }

  try {
    const url = `${API_BASE}/standings?league=${cfg.league}&season=${season}`;
    const upstream = await fetch(url, { headers: { "x-apisports-key": key } });

    if (!upstream.ok) {
      return json(res, 200, { source: "fallback", reason: `upstream_${upstream.status}`, tournament: tournamentId });
    }

    const data = await upstream.json();

    // API-Football surfaces quota / plan problems in an `errors` object.
    if (data.errors && (Array.isArray(data.errors) ? data.errors.length : Object.keys(data.errors).length)) {
      return json(res, 200, { source: "fallback", reason: "api_error", detail: data.errors, tournament: tournamentId });
    }

    const groups = data?.response?.[0]?.league?.standings || [];
    const rows = groups.flat();
    if (!rows.length) {
      return json(res, 200, { source: "fallback", reason: "no_standings", tournament: tournamentId, season });
    }

    const teams = rows
      .map((row) => buildTeam(row))
      .filter(Boolean)
      // De-dupe (some feeds repeat teams across sub-tables) and rank by strength.
      .filter((t, i, arr) => arr.findIndex((x) => x.id === t.id) === i)
      .sort((a, b) => b.rating - a.rating);

    return json(res, 200, {
      source: "live",
      tournament: tournamentId,
      label: cfg.label,
      season,
      updated: new Date().toISOString(),
      teams,
    });
  } catch (err) {
    return json(res, 200, { source: "fallback", reason: "exception", detail: String(err), tournament: tournamentId });
  }
};

// Turn one standings row into a predictor-ready team object.
function buildTeam(row) {
  const team = row.team || {};
  if (!team.id || !team.name) return null;

  const all = row.all || {};
  const goals = all.goals || {};
  const played = all.played || 0;
  const gf = goals.for || 0;
  const ga = goals.against || 0;
  const pts = row.points || 0;
  const gd = row.goalsDiff != null ? row.goalsDiff : gf - ga;

  const ppg = played ? pts / played : 0;
  const gfpg = played ? gf / played : 0;
  const gapg = played ? ga / played : 0;
  const formRatio = parseForm(row.form); // 0..1 or null

  const rating = clampRound(50 + ppg * 13 + gd * 1.4, 45, 96);
  const attack = clampRound(46 + gfpg * 18, 40, 98);
  const defense = clampRound(90 - gapg * 20, 40, 95);
  const form = clampRound(
    formRatio != null ? 50 + formRatio * 42 : 50 + (ppg / 3) * 42,
    45, 95
  );

  const meta = metaFor(team.name);

  return {
    id: "t" + team.id,
    name: team.name,
    short: meta.short,
    colors: meta.colors,
    logo: team.logo || null,
    rating, attack, defense, form,
    pedigree: meta.pedigree,
    titles: meta.titles,
    // Live context shown in the UI so the numbers are traceable to real results.
    live: {
      played,
      record: `${all.win || 0}W-${all.draw || 0}D-${all.lose || 0}L`,
      goalsFor: gf,
      goalsAgainst: ga,
      form: row.form || "",
      rank: row.rank || null,
      group: row.group || null,
    },
  };
}

// "WWDLW" -> average points ratio in [0,1].
function parseForm(form) {
  if (!form) return null;
  const map = { W: 1, D: 0.5, L: 0 };
  const chars = [...String(form)].filter((c) => map[c] !== undefined);
  if (!chars.length) return null;
  return chars.reduce((s, c) => s + map[c], 0) / chars.length;
}

function clampRound(x, lo, hi) {
  return Math.max(lo, Math.min(hi, Math.round(x)));
}

function json(res, status, body) {
  res.status(status).setHeader("Content-Type", "application/json");
  res.send(JSON.stringify(body));
}
