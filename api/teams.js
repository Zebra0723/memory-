/*
 * Vercel serverless function — live team data + fixtures.
 *
 *   GET /api/teams?tournament=world|premier
 *
 * Fetches the FULL match list from football-data.org (v4) — every match across
 * every stage, group AND knockout — using the secret FOOTBALL_DATA_TOKEN.
 * From it we:
 *   1. derive each team's rating block from ALL finished matches (so knockout
 *      results count, not just the frozen group tables), and
 *   2. return a shaped `fixtures` list (group + Round of 16 → Final) so the UI
 *      can browse and predict real matches including the knockouts.
 *
 * football-data.org's FREE tier covers the World Cup ("WC") and Premier League
 * ("PL"). The token is never exposed to the browser. On any failure we return
 * { source: "fallback" } and the client uses bundled sample ratings.
 */

const { metaFor } = require("./_meta");

const API_BASE = "https://api.football-data.org/v4";

const TOURNAMENTS = {
  world:   { code: "WC", label: "World Cup" },
  premier: { code: "PL", label: "Premier League" },
};

// Env-var names accepted for the football-data.org token (first match wins).
const TOKEN_VARS = [
  "FOOTBALL_DATA_TOKEN", "FOOTBALL_DATA_KEY",
  "FOOTBALL_DATA_API_TOKEN", "FOOTBALL_DATA_API_KEY", "FOOTBALLDATA_TOKEN",
];

const STAGE_LABELS = {
  REGULAR_SEASON: "League", GROUP_STAGE: "Group stage",
  PRELIMINARY_ROUND: "Preliminary", QUALIFICATION: "Qualification",
  LAST_32: "Round of 32", LAST_16: "Round of 16",
  QUARTER_FINALS: "Quarter-finals", SEMI_FINALS: "Semi-finals",
  THIRD_PLACE: "Third-place play-off", FINAL: "Final", PLAYOFFS: "Play-offs",
};

// Ordered deepest-first so knockouts surface at the top of the fixtures view.
const STAGE_ORDER = [
  "FINAL", "THIRD_PLACE", "SEMI_FINALS", "QUARTER_FINALS", "LAST_16", "LAST_32",
  "PLAYOFFS", "GROUP_STAGE", "REGULAR_SEASON", "QUALIFICATION", "PRELIMINARY_ROUND",
];
const KNOCKOUT = new Set(["LAST_32", "LAST_16", "QUARTER_FINALS", "SEMI_FINALS", "THIRD_PLACE", "FINAL", "PLAYOFFS"]);

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "s-maxage=1800, stale-while-revalidate=3600");

  const tournamentId = String(req.query.tournament || "world").toLowerCase();
  const cfg = TOURNAMENTS[tournamentId];
  if (!cfg && !req.query.debug) return json(res, 400, { error: `unknown tournament '${tournamentId}'` });

  // Accept a few common env-var names so a slightly-off name still works.
  // NOTE: the value must be a football-data.org token (not an API-Football key).
  const tokenVar = TOKEN_VARS.find((v) => process.env[v]);
  const token = tokenVar ? process.env[tokenVar] : null;

  // `?debug=1` reports what the server sees WITHOUT leaking the token value.
  if (req.query.debug) {
    return json(res, 200, {
      debug: true,
      tokenPresent: !!token,
      tokenVarUsed: tokenVar || null,
      checkedEnvVars: Object.fromEntries(TOKEN_VARS.map((v) => [v, !!process.env[v]])),
      tournament: tournamentId,
    });
  }

  if (!token) {
    return json(res, 200, { source: "fallback", reason: "no_token", tournament: tournamentId });
  }

  try {
    const url = `${API_BASE}/competitions/${cfg.code}/matches`;
    const upstream = await fetch(url, { headers: { "X-Auth-Token": token } });

    if (!upstream.ok) {
      return json(res, 200, { source: "fallback", reason: `upstream_${upstream.status}`, tournament: tournamentId });
    }

    const data = await upstream.json();
    const matches = Array.isArray(data.matches) ? data.matches : [];
    if (!matches.length) {
      return json(res, 200, { source: "fallback", reason: "no_matches", tournament: tournamentId });
    }

    const teams = buildTeams(matches);
    if (!teams.length) {
      return json(res, 200, { source: "fallback", reason: "no_results_yet", tournament: tournamentId });
    }

    const fixtures = buildFixtures(matches);
    const hasKnockout = fixtures.some((f) => f.knockout);

    return json(res, 200, {
      source: "live",
      tournament: tournamentId,
      label: cfg.label,
      updated: new Date().toISOString(),
      hasKnockout,
      teams,
      fixtures,
    });
  } catch (err) {
    return json(res, 200, { source: "fallback", reason: "exception", detail: String(err), tournament: tournamentId });
  }
};

// ---- derive team ratings from every finished match ---------------------
function buildTeams(matches) {
  const acc = new Map(); // teamId -> aggregate

  const side = (team, gf, ga, result, date) => {
    if (!team || !team.id) return;
    let a = acc.get(team.id);
    if (!a) { a = { team, played: 0, gf: 0, ga: 0, w: 0, d: 0, l: 0, results: [] }; acc.set(team.id, a); }
    a.played++; a.gf += gf; a.ga += ga;
    if (result === "W") a.w++; else if (result === "L") a.l++; else a.d++;
    a.results.push({ date, r: result });
  };

  for (const m of matches) {
    if (m.status !== "FINISHED") continue;
    const ft = (m.score && m.score.fullTime) || {};
    if (ft.home == null || ft.away == null) continue;
    const winner = m.score && m.score.winner; // HOME_TEAM | AWAY_TEAM | DRAW
    const homeRes = winner === "DRAW" ? "D" : winner === "HOME_TEAM" ? "W" : winner === "AWAY_TEAM" ? "L" : cmp(ft.home, ft.away);
    const awayRes = homeRes === "D" ? "D" : homeRes === "W" ? "L" : "W";
    side(m.homeTeam, ft.home, ft.away, homeRes, m.utcDate);
    side(m.awayTeam, ft.away, ft.home, awayRes, m.utcDate);
  }

  const teams = [];
  for (const a of acc.values()) {
    const played = a.played;
    const pts = a.w * 3 + a.d;
    const gd = a.gf - a.ga;
    const ppg = played ? pts / played : 0;
    const gfpg = played ? a.gf / played : 0;
    const gapg = played ? a.ga / played : 0;

    // Last five results, chronological (oldest -> latest).
    const last5 = a.results.slice().sort((x, y) => new Date(x.date) - new Date(y.date)).slice(-5);
    const formStr = last5.map((r) => r.r).join("");
    const formRatio = last5.length ? last5.reduce((s, r) => s + (r.r === "W" ? 1 : r.r === "D" ? 0.5 : 0), 0) / last5.length : null;

    const rating = clampRound(50 + ppg * 13 + gd * 1.4, 45, 96);
    const attack = clampRound(46 + gfpg * 18, 40, 98);
    const defense = clampRound(90 - gapg * 20, 40, 95);
    const form = clampRound(formRatio != null ? 50 + formRatio * 42 : 50 + (ppg / 3) * 42, 45, 95);

    const meta = metaFor(a.team.name);
    teams.push({
      id: "t" + a.team.id,
      name: a.team.shortName || a.team.name,
      short: a.team.tla || meta.short,
      colors: meta.colors,
      logo: a.team.crest || null,
      rating, attack, defense, form,
      pedigree: meta.pedigree,
      titles: meta.titles,
      live: {
        played,
        record: `${a.w}W-${a.d}D-${a.l}L`,
        goalsFor: a.gf,
        goalsAgainst: a.ga,
        form: formStr,
      },
    });
  }
  return teams.sort((a, b) => b.rating - a.rating);
}

// ---- shape the fixture list (all stages) -------------------------------
function buildFixtures(matches) {
  return matches
    .map((m) => {
      const ft = (m.score && m.score.fullTime) || {};
      const finished = m.status === "FINISHED" && ft.home != null && ft.away != null;
      return {
        id: m.id,
        stage: m.stage,
        stageLabel: STAGE_LABELS[m.stage] || titleize(m.stage),
        stageRank: STAGE_ORDER.indexOf(m.stage),
        group: m.group || null,
        utcDate: m.utcDate,
        status: m.status,
        knockout: KNOCKOUT.has(m.stage),
        home: teamRef(m.homeTeam),
        away: teamRef(m.awayTeam),
        score: finished
          ? { home: ft.home, away: ft.away, winner: m.score.winner, duration: m.score.duration || "REGULAR" }
          : null,
      };
    })
    .sort((a, b) => new Date(a.utcDate) - new Date(b.utcDate));
}

function teamRef(t) {
  if (!t || !t.id) return { id: null, name: "To be decided", tla: "TBD" };
  return { id: "t" + t.id, name: t.shortName || t.name, tla: t.tla || metaFor(t.name).short, crest: t.crest || null };
}

function cmp(a, b) { return a > b ? "W" : a < b ? "L" : "D"; }

function titleize(s) {
  return String(s || "").toLowerCase().replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function clampRound(x, lo, hi) { return Math.max(lo, Math.min(hi, Math.round(x))); }

function json(res, status, body) {
  res.status(status).setHeader("Content-Type", "application/json");
  res.send(JSON.stringify(body));
}
