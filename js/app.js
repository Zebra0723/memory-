/*
 * App controller — the guided wizard.
 * Steps: 1) tournament → 2) teams → 3) venue → 4) prediction.
 */

(() => {
  const state = {
    step: 1,
    dataset: null,   // DATASETS entry
    teamA: null,
    teamB: null,
    venue: "neutral",
  };

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  // ---- helpers ---------------------------------------------------------
  function crest(team, cls = "") {
    const [c1, c2] = team.colors;
    return `<div class="team-crest ${cls}" style="background:linear-gradient(135deg,${c1},${c2})">${team.short}</div>`;
  }

  function goto(step) {
    state.step = step;
    $$(".screen").forEach((s) => s.classList.remove("active"));
    $(`#screen-${step}`).classList.add("active");
    updateStepper();
    $("#resetBtn").hidden = step === 1;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function updateStepper() {
    $$(".stepper .step").forEach((el) => {
      const n = Number(el.dataset.step);
      el.classList.toggle("active", n === state.step);
      el.classList.toggle("done", n < state.step);
    });
  }

  // ---- STEP 1: tournaments --------------------------------------------
  function renderTournaments() {
    const grid = $("#tournamentGrid");
    grid.innerHTML = Object.values(DATASETS)
      .map(
        (d) => `
      <div class="tournament-card" data-ds="${d.id}">
        <div class="t-icon">${d.icon}</div>
        <h3>${d.label}</h3>
        <p>${d.tagline}</p>
        <div class="t-count">${d.teams.length} teams available →</div>
      </div>`
      )
      .join("");
    $$("#tournamentGrid .tournament-card").forEach((card) =>
      card.addEventListener("click", () => {
        state.dataset = DATASETS[card.dataset.ds];
        state.teamA = state.teamB = null;
        renderSlots();
        renderTeamList();
        $("#teamSearch").value = "";
        $("#toVenue").disabled = true;
        goto(2);
      })
    );
  }

  // ---- STEP 2: team picker --------------------------------------------
  function renderSlots() {
    ["A", "B"].forEach((k) => {
      const team = state["team" + k];
      const slot = $("#slot" + k);
      if (team) {
        slot.classList.add("filled");
        slot.innerHTML = `
          <span class="slot-tag">Team ${k}</span>
          <div class="slot-team">
            ${crest(team)}
            <span class="team-name">${team.name}</span>
            <span class="team-rating">Rating ${team.rating} · ${team.titles}</span>
          </div>`;
      } else {
        slot.classList.remove("filled");
        slot.innerHTML = `<span class="slot-tag">Team ${k}</span><div class="slot-empty">Select a team</div>`;
      }
    });
    $("#toVenue").disabled = !(state.teamA && state.teamB);
  }

  function renderTeamList(filter = "") {
    const list = $("#teamList");
    const f = filter.trim().toLowerCase();
    const teams = state.dataset.teams
      .filter((t) => t.name.toLowerCase().includes(f) || t.short.toLowerCase().includes(f))
      .sort((a, b) => b.rating - a.rating);

    list.innerHTML = teams
      .map((t) => {
        const isSel = state.teamA?.id === t.id || state.teamB?.id === t.id;
        const [c1, c2] = t.colors;
        return `
        <div class="team-chip ${isSel ? "selected" : ""}" data-id="${t.id}">
          <div class="mini-crest" style="background:linear-gradient(135deg,${c1},${c2})">${t.short}</div>
          <div>
            <div class="chip-name">${t.name}</div>
            <div class="chip-rating">Rating ${t.rating}</div>
          </div>
        </div>`;
      })
      .join("");

    $$("#teamList .team-chip").forEach((chip) => {
      const t = state.dataset.teams.find((x) => x.id === chip.dataset.id);
      chip.addEventListener("click", () => onPickTeam(t));
    });
  }

  function onPickTeam(team) {
    // Toggle off if already selected.
    if (state.teamA?.id === team.id) state.teamA = null;
    else if (state.teamB?.id === team.id) state.teamB = null;
    else if (!state.teamA) state.teamA = team;
    else if (!state.teamB) state.teamB = team;
    else state.teamB = team; // both full → replace B
    renderSlots();
    renderTeamList($("#teamSearch").value);
  }

  // ---- STEP 3: venue ---------------------------------------------------
  function renderVenue() {
    const A = state.teamA, B = state.teamB;
    const opts = [
      { id: "home", icon: "🏟️", title: `${A.name} home`, sub: `Advantage ${A.short}` },
      { id: "neutral", icon: "⚖️", title: "Neutral ground", sub: "No home edge" },
      { id: "away", icon: "🏟️", title: `${B.name} home`, sub: `Advantage ${B.short}` },
    ];
    $("#venueGrid").innerHTML = opts
      .map(
        (o) => `
      <div class="venue-card ${state.venue === o.id ? "selected" : ""}" data-venue="${o.id}">
        <div class="v-icon">${o.icon}</div>
        <h4>${o.title}</h4>
        <p>${o.sub}</p>
      </div>`
      )
      .join("");
    $$("#venueGrid .venue-card").forEach((card) =>
      card.addEventListener("click", () => {
        state.venue = card.dataset.venue;
        renderVenue();
      })
    );
  }

  // ---- STEP 4: results -------------------------------------------------
  function runPrediction() {
    const r = Predictor.predict(state.teamA, state.teamB, state.venue, state.dataset.homeAdvantage);
    renderResult(r);
    goto(4);
    // Animate bars after paint.
    requestAnimationFrame(() => requestAnimationFrame(animateResultBars));
  }

  function renderResult(r) {
    const { teamA, teamB, probs, xg, predictedScore, topScores, confidence, favourite, factors } = r;
    const pA = Math.round(probs.winA * 100);
    const pD = Math.round(probs.draw * 100);
    const pB = 100 - pA - pD;

    const winnerLine = favourite
      ? `<span class="winner-tag">🏆 ${favourite.name} favoured</span>`
      : `<span class="winner-tag">⚖️ Too close to call</span>`;

    const venueNote =
      state.venue === "home" ? `${teamA.name} at home` :
      state.venue === "away" ? `${teamB.name} at home` : "Neutral venue";

    $("#resultContainer").innerHTML = `
      <div class="result-hero">
        ${winnerLine}
        <div class="result-teams">
          <div class="result-team">
            ${crest(teamA, "big")}
            <span class="rt-name">${teamA.name}</span>
          </div>
          <div class="result-score">
            ${predictedScore.a} – ${predictedScore.b}
            <small>${venueNote}</small>
          </div>
          <div class="result-team">
            ${crest(teamB, "big")}
            <span class="rt-name">${teamB.name}</span>
          </div>
        </div>
        <div class="confidence-pill ${confidence.level}">${confidence.text}</div>

        <div class="xg-row">
          <div class="xg-chip"><div class="xg-val">${xg.a.toFixed(2)}</div><div class="xg-lbl">${teamA.short} xG</div></div>
          <div class="xg-chip"><div class="xg-val">${xg.b.toFixed(2)}</div><div class="xg-lbl">${teamB.short} xG</div></div>
        </div>

        <div class="prob-section">
          <div class="prob-labels">
            <span>${teamA.short} win</span><span>Draw</span><span>${teamB.short} win</span>
          </div>
          <div class="prob-bar" id="probBar">
            <div class="prob-seg" data-w="${pA}" style="width:0;background:linear-gradient(135deg,${teamA.colors[0]},${teamA.colors[1]})">${pA}%</div>
            <div class="prob-seg draw" data-w="${pD}" style="width:0">${pD}%</div>
            <div class="prob-seg" data-w="${pB}" style="width:0;background:linear-gradient(135deg,${teamB.colors[0]},${teamB.colors[1]})">${pB}%</div>
          </div>
          <div class="prob-legend">
            <span><i style="background:${teamA.colors[0]}"></i>${teamA.name}</span>
            <span><i style="background:#475569"></i>Draw</span>
            <span><i style="background:${teamB.colors[0]}"></i>${teamB.name}</span>
          </div>
        </div>
      </div>

      <div class="result-cards">
        <div class="info-card">
          <h4>Head-to-head factors</h4>
          ${factors.map(factorRow).join("")}
        </div>
        <div class="info-card">
          <h4>Most likely scorelines</h4>
          <div class="score-list">
            ${topScores.map((s) => scoreItem(s, topScores[0].p)).join("")}
          </div>
        </div>
        <div class="narrative">
          <h4>The Oracle says</h4>
          <p>${narrative(r, pA, pD, pB)}</p>
        </div>
      </div>`;
  }

  function factorRow(f) {
    const max = Math.max(f.a, f.b, 1);
    const aw = (f.a / (f.a + f.b || 1)) * 100;
    const bw = 100 - aw;
    const badge =
      f.edge === "a" ? `<span class="edge-badge edge-a">A +${Math.abs(f.diff).toFixed(f.isVenue ? 1 : 0)}</span>` :
      f.edge === "b" ? `<span class="edge-badge edge-b">B +${Math.abs(f.diff).toFixed(f.isVenue ? 1 : 0)}</span>` : "";
    return `
      <div class="factor-row">
        <div class="factor-top">
          <span class="fval">${f.a.toFixed ? (f.isVenue ? f.a.toFixed(1) : f.a) : f.a}</span>
          <span class="flabel">${f.label} ${badge}</span>
          <span class="fval">${f.isVenue ? f.b.toFixed(1) : f.b}</span>
        </div>
        <div class="factor-track">
          <div class="factor-fill-a" style="width:0" data-w="${aw}"></div>
          <div class="factor-fill-b" style="width:0" data-w="${bw}"></div>
        </div>
      </div>`;
  }

  function scoreItem(s, topP) {
    const pct = (s.p * 100).toFixed(1);
    const rel = (s.p / topP) * 100;
    return `
      <div class="score-item">
        <span class="sc">${s.a}–${s.b}</span>
        <span class="sc-track"><span class="sc-fill" style="width:0" data-w="${rel}"></span></span>
        <span class="sc-pct">${pct}%</span>
      </div>`;
  }

  function narrative(r, pA, pD, pB) {
    const { teamA, teamB, favourite, factors, venue } = r;
    const strongest = factors
      .filter((f) => f.edge !== "even" && !f.isVenue)
      .sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff))[0];

    let lead;
    if (!favourite) {
      lead = `This one's a genuine coin-flip — the model separates <span class="accent">${teamA.name}</span> and <span class="accent-2">${teamB.name}</span> by a whisker.`;
    } else {
      const fav = favourite === teamA ? "accent" : "accent-2";
      const favPct = favourite === teamA ? pA : pB;
      lead = `<span class="${fav}">${favourite.name}</span> edge it with a <strong>${favPct}%</strong> win probability.`;
    }

    let reason = "";
    if (strongest) {
      const who = strongest.edge === "a" ? teamA : teamB;
      const cls = strongest.edge === "a" ? "accent" : "accent-2";
      reason = ` The biggest differentiator is <strong>${strongest.label.toLowerCase()}</strong>, where <span class="${cls}">${who.name}</span> hold a clear advantage.`;
    }

    const venueBit =
      venue === "home" ? ` Playing at home gives ${teamA.name} an extra nudge.` :
      venue === "away" ? ` Home advantage tilts things toward ${teamB.name}.` :
      ` On neutral turf, there's no home comfort for either side.`;

    const drawBit = pD >= 25 ? ` With a ${pD}% draw chance, don't rule out the sides sharing the spoils.` : "";

    return lead + reason + venueBit + drawBit;
  }

  function animateResultBars() {
    $$("#probBar .prob-seg").forEach((seg) => (seg.style.width = seg.dataset.w + "%"));
    $$(".factor-fill-a, .factor-fill-b, .sc-fill").forEach((el) => (el.style.width = el.dataset.w + "%"));
  }

  // ---- wiring ----------------------------------------------------------
  function init() {
    renderTournaments();

    $("#teamSearch").addEventListener("input", (e) => renderTeamList(e.target.value));

    $("#toVenue").addEventListener("click", () => {
      renderVenue();
      goto(3);
    });
    $("#runPrediction").addEventListener("click", runPrediction);

    $("#rematchBtn").addEventListener("click", () => {
      [state.teamA, state.teamB] = [state.teamB, state.teamA];
      if (state.venue === "home") state.venue = "away";
      else if (state.venue === "away") state.venue = "home";
      runPrediction();
    });

    $("#resetBtn").addEventListener("click", () => {
      state.dataset = state.teamA = state.teamB = null;
      state.venue = "neutral";
      goto(1);
    });

    $$("[data-goto]").forEach((btn) =>
      btn.addEventListener("click", () => {
        const target = Number(btn.dataset.goto);
        if (target === 2) { renderSlots(); renderTeamList($("#teamSearch").value); }
        goto(target);
      })
    );

    updateStepper();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
