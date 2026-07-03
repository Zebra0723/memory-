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
browser  →  /api/teams  (serverless, holds the secret key)  →  API-Football
                    ↓
        live standings → derived ratings → JSON → the predictor
```

- `attack` ← goals scored per game
- `defense` ← goals conceded per game (inverted)
- `form` ← the live `WWDLW` form string
- `rating` ← points per game + goal difference
- `pedigree` / colours / honours ← static metadata (not in a league table)

If the key is missing or the API is unreachable, the app **falls back to bundled
sample ratings** and clearly labels them, so it never breaks.

## Deploy to Vercel

1. **Get a free API key** from [API-Football](https://www.api-football.com/)
   (API‑SPORTS). The free tier is enough for a personal app.
2. **Import this repo** into [Vercel](https://vercel.com/new) (New Project → pick
   the repo → Deploy). No build settings needed — it's static files + one
   function.
3. **Add the key**: Project → *Settings → Environment Variables* →
   `APISPORTS_KEY = your_key` → redeploy.
4. Open the deployment URL. You should see a green **LIVE** badge on the team
   picker. If you see an amber *Sample ratings* badge, the key isn't set yet.

### Local development

```bash
npm i -g vercel      # once
cp .env.example .env # then paste your APISPORTS_KEY into .env
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

- **API key** → Vercel env var `APISPORTS_KEY` (or `.env` locally)
- **Which season the standings read** → `TOURNAMENTS` in `api/teams.js`
  (or pass `?season=YYYY`). World Cup defaults to league `1` / season `2026`;
  Premier League to league `39`.
- **Model weights** → the `W` object in `js/predictor.js`
- **Restyle** → CSS custom properties in `:root` (`css/styles.css`)

---

> **Note:** the live‑fetch path is wired for API‑Football but was built in a
> sandbox without outbound network access, so it hasn't been run against the
> real API. The data shape and derivation are unit‑tested against
> API‑Football's documented `/standings` response; verify against your key on
> first deploy and tweak the season/league in `api/teams.js` if the defaults
> have drifted.
