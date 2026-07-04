/*
 * Vercel serverless function — real competition emblems.
 *
 *   GET /api/competitions
 *
 * football-data.org's /competitions discovery endpoint returns every
 * competition with its correct `emblem` URL. We fetch it once (cached a day)
 * and return a map of our tournament ids -> emblem URL, so the tournament
 * cards show the RIGHT logo instead of a guessed one. If the token/endpoint is
 * unavailable we return an empty map and the client keeps its SVG illustration.
 */

const API_BASE = "https://api.football-data.org/v4";

const TOKEN_VARS = [
  "FOOTBALL_DATA_TOKEN", "FOOTBALL_DATA_KEY",
  "FOOTBALL_DATA_API_TOKEN", "FOOTBALL_DATA_API_KEY", "FOOTBALLDATA_TOKEN",
];

// football-data.org competition code -> our tournament id.
const CODE_TO_ID = {
  WC: "world", EC: "euros", CL: "champions", PL: "premier", PD: "laliga",
  BL1: "bundesliga", SA: "seriea", FL1: "ligue1", PPL: "primeira",
  DED: "eredivisie", ELC: "championship", CLI: "libertadores", BSA: "brasileirao",
};

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const token = TOKEN_VARS.map((v) => process.env[v]).find(Boolean);
  if (!token) return json(res, 200, { source: "fallback", reason: "no_token", emblems: {} }, "no-store");

  try {
    const r = await fetch(`${API_BASE}/competitions`, { headers: { "X-Auth-Token": token } });
    if (!r.ok) return json(res, 200, { source: "fallback", reason: `upstream_${r.status}`, emblems: {} }, "no-store");

    const data = await r.json();
    const emblems = {};
    (data.competitions || []).forEach((c) => {
      const id = CODE_TO_ID[c.code];
      if (id && c.emblem) emblems[id] = c.emblem;
    });
    // Emblems change ~never; cache hard.
    return json(res, 200, { source: "live", emblems }, "s-maxage=86400, stale-while-revalidate=604800");
  } catch (err) {
    return json(res, 200, { source: "fallback", reason: "exception", emblems: {} }, "no-store");
  }
};

function json(res, status, body, cache) {
  res.setHeader("Cache-Control", cache || "no-store");
  res.status(status).setHeader("Content-Type", "application/json");
  res.send(JSON.stringify(body));
}
