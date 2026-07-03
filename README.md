# ⚽ Match Oracle

A personal **Premier League & World Cup match predictor**. Pick a competition,
choose two teams, set the venue, and the Oracle predicts the result — win
probabilities, an expected scoreline, xG, a head‑to‑head breakdown, the most
likely scorelines, and a plain‑English verdict.

No build step, no dependencies, no server. Just open `index.html`.

## Run it

```bash
# from the project root
open index.html          # macOS
xdg-open index.html      # Linux
# or just double‑click index.html
```

## The guided flow

1. **Tournament** — Premier League (20 clubs) or World Cup (20 nations)
2. **Teams** — search & tap to fill the two slots
3. **Venue** — home / neutral / away (home advantage nudges the numbers)
4. **Prediction** — the full result breakdown

From the results screen you can **swap sides & re‑run** or start a **new matchup**.

## How the prediction works

Each team carries a set of 0–100 ratings: overall `rating`, `attack`,
`defense`, `form` and `pedigree`. The engine (`js/predictor.js`) combines them
in two stages:

- **Elo layer** — each side's stats are folded into an effective rating for the
  specific matchup (attack vs the opponent's defense, recent form, pedigree,
  plus a venue bonus). A standard Elo expected‑score formula turns the rating
  gap into win / draw / loss probabilities, with tighter games drawing more.
- **Poisson layer** — expected goals for each side are derived from attacking
  strength and the rating gap, then a Poisson model produces the expected
  scoreline and a ranked grid of the most likely exact results.

The ratings are hand‑tuned approximations for the modern era — illustrative and
for fun, **not** betting advice.

## Project structure

```
index.html          # markup + wizard shell
css/styles.css      # dark, football‑themed styling
js/data.js          # team datasets & ratings
js/predictor.js     # Elo + Poisson prediction engine
js/app.js           # the guided wizard controller
```

## Tweaking it

- **Add or edit teams / ratings** → `js/data.js`
- **Change the model weights** → the `W` object at the top of `js/predictor.js`
- **Restyle** → CSS custom properties in `:root` (`css/styles.css`)
