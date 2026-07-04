/*
 * Vercel serverless function — live team data.
 *
 *   GET /api/teams?tournament=world|premier
 *
 * Fetches live standings from football-data.org (v4) using the secret
 * FOOTBALL_DATA_TOKEN env var, then derives the rating block
 * (rating / attack / defense / form) the client-side predictor consumes.
 *
 * football-data.org's FREE tier covers both the World Cup (competition code
 * "WC") and the Premier League ("PL"), so no paid plan is required.
 *
 * The token is NEVER exposed to the browser — that is why this runs on a
 * server. If it's missing or the upstream call fails, we return
 * { source: "fallback" } so the client falls back to bundled sample ratings.
 */

const { metaFor } = require("./_meta");

const API_BASE = "https://api.football-data.org/v4";

// Map our tournament ids to football-data.org competition codes.
const TOURNAMENTS = {
  world:   { code: "WC", label: "World Cup" },
  premier: { code: "PL", label: "Premier League" },
};

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  // Edge-cache 30 min: the free tier is rate-limited (10 req/min) and standings
  // change at most once per match, so we must not refetch on every page load.
  res.setHeader("Cache-Control", "s-maxage=1800, stale-while-revalidate=3600");

  const tournamentId = String(req.query.tournament || "world").toLowerCase();
  const cfg = TOURNAMENTS[tournamentId];
  if (!cfg) return json(res, 400, { error: `unknown tournament '${tournamentId}'` });

  const token = process.env.FOOTBALL_DATA_TOKEN;
  if (!token) {
    return json(res, 200, { source: "fallback", reason: "no_token", tournament: tournamentId });
  }

  try {
    const url = `${API_BASE}/competitions/${cfg.code}/standings`;
    const upstream = await fetch(url, { headers: { "X-Auth-Token": token } });

    if (!upstream.ok) {
      // 403 usually means the competition/season isn't on your plan or window.
      return json(res, 200, { source: "fallback", reason: `upstream_${upstream.status}`, tournament: tournamentId });
    }

    const data = await upstream.json();

    // Flatten the TOTAL table across every group (WC has 12 groups; PL has one).
    const rows = (data.standings || [])
      .filter((s) => (s.type || "TOTAL") === "TOTAL")
      .flatMap((s) => (s.table || []).map((r) => ({ row: r, group: s.group || s.stage || null })));

    if (!rows.length) {
      return json(res, 200, { source: "fallback", reason: "no_standings", tournament: tournamentId });
    }

    const teams = rows
      .map(({ row, group }) => buildTeam(row, group))
      .filter(Boolean)
      .filter((t, i, arr) => arr.findIndex((x) => x.id === t.id) === i)
      .sort((a, b) => b.rating - a.rating);

    return json(res, 200, {
      source: "live",
      tournament: tournamentId,
      label: cfg.label,
      season: data?.season?.startDate ? data.season.startDate.slice(0, 4) : null,
      updated: new Date().toISOString(),
      teams,
    });
  } catch (err) {
    return json(res, 200, { source: "fallback", reason: "exception", detail: String(err), tournament: tournamentId });
  }
};

// Turn one football-data.org standings row into a predictor-ready team object.
function buildTeam(row, group) {
  const team = row.team || {};
  if (!team.id || !team.name) return null;

  const played = row.playedGames || 0;
  const gf = row.goalsFor || 0;
  const ga = row.goalsAgainst || 0;
  const pts = row.points || 0;
  const gd = row.goalDifference != null ? row.goalDifference : gf - ga;

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
    name: team.shortName || team.name,
    short: team.tla || meta.short, // football-data.org gives a real 3-letter code
    colors: meta.colors,
    logo: team.crest || null,
    rating, attack, defense, form,
    pedigree: meta.pedigree,
    titles: meta.titles,
    // Live context so the numbers trace back to real results.
    live: {
      played,
      record: `${row.won || 0}W-${row.draw || 0}D-${row.lost || 0}L`,
      goalsFor: gf,
      goalsAgainst: ga,
      form: normalizeForm(row.form),
      rank: row.position || null,
      group,
    },
  };
}

// football-data.org form looks like "W,W,D,L,W"; API-style is "WWDLW".
function parseForm(form) {
  if (!form) return null;
  const map = { W: 1, D: 0.5, L: 0 };
  const chars = [...String(form).toUpperCase()].filter((c) => map[c] !== undefined);
  if (!chars.length) return null;
  return chars.reduce((s, c) => s + map[c], 0) / chars.length;
}

// Return a clean "WWDLW" string (last 5) for display.
function normalizeForm(form) {
  if (!form) return "";
  return [...String(form).toUpperCase()].filter((c) => "WDL".includes(c)).slice(-5).join("");
}

function clampRound(x, lo, hi) {
  return Math.max(lo, Math.min(hi, Math.round(x)));
}

function json(res, status, body) {
  res.status(status).setHeader("Content-Type", "application/json");
  res.send(JSON.stringify(body));
}
