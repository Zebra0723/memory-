/*
 * Prediction engine.
 *
 * Blends an Elo-style rating difference (adjusted for venue and a weighted mix
 * of form / attack / defense / pedigree) into win/draw/loss probabilities, then
 * layers a Poisson goals model on top to produce an expected scoreline and a
 * grid of the most likely results.
 */

const Predictor = (() => {
  // Weighting used to nudge the base Elo rating with the finer-grained stats.
  const W = { rating: 1.0, attack: 0.18, defense: 0.18, form: 0.22, pedigree: 0.10 };

  // Turn a team's stat block into an effective rating for this matchup.
  function effectiveRating(team, opponent, venueBonus) {
    // Attack is measured against the opponent's defense and vice-versa.
    const attackEdge = (team.attack - opponent.defense) * W.attack;
    const defenseEdge = (team.defense - opponent.attack) * W.defense;
    const formEdge = (team.form - 70) * W.form;
    const pedigreeEdge = (team.pedigree - 70) * W.pedigree;
    return team.rating * W.rating + attackEdge + defenseEdge + formEdge + pedigreeEdge + venueBonus;
  }

  // Win / draw / loss probabilities from two independent Poisson goal
  // distributions, summed over the score grid and normalised.
  function outcomeProbs(xgA, xgB) {
    let winA = 0, draw = 0, winB = 0;
    for (let a = 0; a <= 10; a++) {
      for (let b = 0; b <= 10; b++) {
        const p = poisson(a, xgA) * poisson(b, xgB);
        if (a > b) winA += p; else if (a === b) draw += p; else winB += p;
      }
    }
    const t = winA + draw + winB || 1;
    return { winA: winA / t, draw: draw / t, winB: winB / t };
  }

  // Poisson probability mass P(k; lambda).
  function poisson(k, lambda) {
    return (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k);
  }

  function factorial(n) {
    let f = 1;
    for (let i = 2; i <= n; i++) f *= i;
    return f;
  }

  /*
   * Main entry point.
   *   teamA, teamB – team objects
   *   venue        – "home" (A at home), "away" (B at home) or "neutral"
   *   homeAdvantage – dataset-specific rating bump
   */
  function predict(teamA, teamB, venue, homeAdvantage) {
    const bonusA = venue === "home" ? homeAdvantage : 0;
    const bonusB = venue === "away" ? homeAdvantage : 0;

    const effA = effectiveRating(teamA, teamB, bonusA);
    const effB = effectiveRating(teamB, teamA, bonusB);

    // Expected goals: scale by attacking strength & the Elo rating gap.
    const baseGoals = 1.35; // league-ish average per side
    const attackFactorA = 0.6 + teamA.attack / 100;
    const attackFactorB = 0.6 + teamB.attack / 100;
    const eloTilt = (effA - effB) / 120;
    const xgA = clamp(baseGoals * attackFactorA + eloTilt, 0.2, 4.2);
    const xgB = clamp(baseGoals * attackFactorB - eloTilt, 0.2, 4.2);

    // Win / draw / loss probabilities come from the SAME Poisson goals model
    // as the match simulator, so the headline odds, the scorelines and the
    // Monte-Carlo simulation are all mutually consistent.
    const { winA, draw, winB } = outcomeProbs(xgA, xgB);

    const scoreGrid = buildScoreGrid(xgA, xgB);

    // Headline scoreline from rounded xG, but avoid showing a draw when one
    // side is a clear favourite — nudge the extra goal to whoever's ahead.
    let scoreA = Math.round(xgA), scoreB = Math.round(xgB);
    if (scoreA === scoreB && Math.abs(winA - winB) > 0.12) {
      if (winA > winB) scoreA += 1; else scoreB += 1;
    }

    return {
      teamA, teamB, venue,
      effA, effB,
      probs: { winA, draw, winB },
      xg: { a: xgA, b: xgB },
      predictedScore: { a: scoreA, b: scoreB },
      topScores: scoreGrid.slice(0, 5),
      confidence: confidenceLabel(Math.max(winA, winB, draw)),
      // Only crown a favourite when the edge is meaningful (>3 pts), else it's
      // a genuine toss-up.
      favourite: Math.abs(winA - winB) < 0.03 ? null : (winA > winB ? teamA : teamB),
      factors: buildFactors(teamA, teamB, venue, homeAdvantage),
    };
  }

  // Build a ranked list of the most probable exact scorelines (0..6 goals each).
  function buildScoreGrid(xgA, xgB) {
    const grid = [];
    for (let a = 0; a <= 6; a++) {
      for (let b = 0; b <= 6; b++) {
        grid.push({ a, b, p: poisson(a, xgA) * poisson(b, xgB) });
      }
    }
    return grid.sort((x, y) => y.p - x.p);
  }

  // Human-readable "why" breakdown comparing the two sides.
  function buildFactors(teamA, teamB, venue, homeAdvantage) {
    const keys = [
      { key: "rating", label: "Overall rating" },
      { key: "attack", label: "Attack" },
      { key: "defense", label: "Defense" },
      { key: "form", label: "Recent form" },
      { key: "pedigree", label: "Pedigree" },
    ];
    const factors = keys.map(({ key, label }) => {
      const a = teamA[key], b = teamB[key];
      const diff = a - b;
      return {
        label,
        a, b, diff,
        edge: diff > 2 ? "a" : (diff < -2 ? "b" : "even"),
      };
    });
    if (venue !== "neutral") {
      factors.push({
        label: "Home advantage",
        a: venue === "home" ? homeAdvantage : 0,
        b: venue === "away" ? homeAdvantage : 0,
        diff: venue === "home" ? homeAdvantage : -homeAdvantage,
        edge: venue === "home" ? "a" : "b",
        isVenue: true,
      });
    }
    return factors;
  }

  function confidenceLabel(topProb) {
    if (topProb >= 0.60) return { text: "High confidence", level: "high" };
    if (topProb >= 0.45) return { text: "Moderate confidence", level: "medium" };
    return { text: "Tight call — could go either way", level: "low" };
  }

  function clamp(x, lo, hi) { return Math.max(lo, Math.min(hi, x)); }

  // Sample from a Poisson distribution (Knuth's algorithm).
  function samplePoisson(lambda) {
    const L = Math.exp(-lambda);
    let k = 0, p = 1;
    do { k++; p *= Math.random(); } while (p > L);
    return k - 1;
  }

  /*
   * Monte-Carlo simulation: play the match `n` times by sampling each side's
   * goals from its expected-goals (Poisson) distribution, and tally outcomes.
   */
  function simulate(xgA, xgB, n) {
    let winA = 0, draw = 0, winB = 0, sumA = 0, sumB = 0, btts = 0;
    const scores = new Map();
    for (let i = 0; i < n; i++) {
      const a = samplePoisson(xgA);
      const b = samplePoisson(xgB);
      sumA += a; sumB += b;
      if (a > b) winA++; else if (b > a) winB++; else draw++;
      if (a > 0 && b > 0) btts++;
      const key = a + "-" + b;
      scores.set(key, (scores.get(key) || 0) + 1);
    }
    let topKey = "0-0", topCount = 0;
    for (const [k, c] of scores) if (c > topCount) { topCount = c; topKey = k; }
    const [ta, tb] = topKey.split("-").map(Number);
    return {
      winA, draw, winB,
      avgA: sumA / n, avgB: sumB / n,
      btts,
      topScore: { a: ta, b: tb, count: topCount },
    };
  }

  return { predict, simulate };
})();
