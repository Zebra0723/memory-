# ⚽ Match Oracle

A personal **Premier League & World Cup match predictor** with **live tournament
stats**. Pick a competition, choose two teams, set the venue, and the Oracle
predicts the result — win probabilities, an expected scoreline, xG, a
head‑to‑head breakdown, the most likely scorelines, and a plain‑English verdict.

Team ratings are derived from **live standings** (form, goals, points) pulled
from a real football API, so predictions reflect how sides are actually playing
in the current tournament.

## How live data works (and why it's on Vercel)

Real football APIs require an API **key**, and that key must never ship in
browser code — anyone could read it and burn your quota. Those APIs also don't
allow direct browser calls (no CORS). So the app uses a tiny **serverless
function** that runs on Vercel:

```
browser  →  /api/teams  (serverless, holds the secret key)  →  football-data.org
                    ↓
   full match list (group + knockout) → derived ratings + fixtures → predictor
```

Data comes from **[football-data.org](https://www.football-data.org/)**, whose
**free tier covers both the World Cup and the Premier League** — no paid plan
needed. The function reads the competition's **complete match list** (every
stage, group **and** knockout), so:

- **Ratings & form** are derived from *all* finished matches — a team's form
  reflects its Round of 16 / quarter-final results, not just the frozen group
  table.
- The app ships a **Fixtures** browser: real matches grouped by stage
  (Group → Round of 16 → Quarter-finals → Semi-finals → Final), with live/FT
  status and scores. Tap any fixture to predict it; for matches already played,
  the **actual result** is shown next to the prediction.

- `attack` ← goals scored per game
- `defense` ← goals conceded per game (inverted)
- `form` ← the live `WWDLW` form string
- `rating` ← points per game + goal difference
- `pedigree` / colours / honours ← static metadata (not in a league table)

If the key is missing or the API is unreachable, the app **falls back to bundled
sample ratings** and clearly labels them, so it never breaks.

## Deploy to Vercel

1. **Get a free token** at
   [football-data.org/client/register](https://www.football-data.org/client/register).
   The free tier covers the World Cup and Premier League.
2. **Import this repo** into [Vercel](https://vercel.com/new) (New Project → pick
   the repo → Deploy). No build settings needed — it's static files + one
   function.
3. **Add the token**: Project → *Settings → Environment Variables* →
   `FOOTBALL_DATA_TOKEN = your_token`, then **redeploy** (env vars only apply to
   deployments created *after* you add them).
4. Open the deployment URL. You should see a green **LIVE** badge on the team
   picker. If you see an amber *Sample ratings* badge, the token isn't set yet —
   check the name and that you redeployed.

### Local development

```bash
npm i -g vercel      # once
cp .env.example .env # then paste your FOOTBALL_DATA_TOKEN into .env
vercel dev           # serves the site + /api/teams at http://localhost:3000
```

Opening `index.html` directly (file://) also works, but with **sample** data
only — there's no server to run the function.

## The guided flow

1. **Tournament** — World Cup or Premier League
2. **Teams** — search & tap; chips show each side's live record
3. **Venue** — home / neutral / away (home advantage nudges the numbers)
4. **Prediction** — full result breakdown, tagged live or sample

From the results screen you can **swap sides & re‑run** or start a **new matchup**.

## How the prediction works

- **Elo layer** — each side's stats fold into an effective rating for the
  matchup (attack vs the opponent's defense, form, pedigree, venue bonus). A
  standard Elo expected‑score formula turns the gap into win / draw / loss
  probabilities; tighter games draw more.
- **Poisson layer** — expected goals per side drive an expected scoreline and a
  ranked grid of the most likely exact results.

Predictions are for fun, **not** betting advice.

## Project structure

```
index.html          # markup + wizard shell
css/styles.css      # dark, football-themed styling
js/data.js          # bundled fallback datasets & ratings
js/predictor.js     # Elo + Poisson prediction engine
js/app.js           # wizard controller + live-data fetching
api/teams.js        # Vercel serverless function — live standings → ratings
api/_meta.js        # static team metadata (colours, pedigree, honours)
vercel.json         # Vercel config
.env.example        # APISPORTS_KEY template
```

## Configuring

- **API token** → Vercel env var `FOOTBALL_DATA_TOKEN` (or `.env` locally)
- **Competitions** → `TOURNAMENTS` in `api/teams.js` (World Cup = `WC`,
  Premier League = `PL`); add more free-tier competitions here to extend the menu.
  The function reads `/competitions/{code}/matches`, so it always covers the
  current season's full schedule including knockouts.
- **Model weights** → the `W` object in `js/predictor.js`
- **Restyle** → CSS custom properties in `:root` (`css/styles.css`)

---

> **Note:** the live‑fetch path is wired for football-data.org but was built in
> a sandbox without outbound network access, so it hasn't been run against the
> real API. The data shape and derivation are unit‑tested against
> football-data.org's documented v4 `/standings` response; verify against your
> token on first deploy.
