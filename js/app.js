/*
 * App controller — the guided wizard.
 * Steps: 1) tournament → 2) teams → 3) venue → 4) prediction.
 */

(() => {
  const state = {
    step: 1,
    dataset: null,   // active dataset (live teams or bundled fallback)
    teamA: null,
    teamB: null,
    venue: "neutral",
    source: "fallback", // "live" | "fallback"
    updated: null,
    reason: null,
  };

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  // ---- helpers ---------------------------------------------------------
  function crest(team, cls = "") {
    const [c1, c2] = team.colors;
    return `<div class="team-crest ${cls}" style="background:linear-gradient(135deg,${c1},${c2})">${team.short}</div>`;
  }

  // Relative luminance (0..1) of a colour; hex only, else assume mid-tone.
  function lum(color) {
    if (typeof color === "string" && color[0] === "#") {
      let h = color.slice(1);
      if (h.length === 3) h = h.split("").map((c) => c + c).join("");
      const r = parseInt(h.slice(0, 2), 16) / 255;
      const g = parseInt(h.slice(2, 4), 16) / 255;
      const b = parseInt(h.slice(4, 6), 16) / 255;
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }
    return 0.5;
  }

  // Pick the team brand colour that best contrasts with the current theme's
  // card background — so white-kit sides (England) and dark-kit sides (USA)
  // stay visible in both light and dark mode.
  function displayColor(team) {
    const light = document.documentElement.getAttribute("data-theme") === "light";
    const bg = light ? 0.96 : 0.09;
    const [c1, c2] = team.colors;
    const contrast = (c) => Math.abs(lum(c) - bg);
    let pick = contrast(c1) >= 0.22 ? c1 : (contrast(c2) > contrast(c1) ? c2 : c1);
    if (contrast(pick) < 0.15) pick = light ? "#0ea472" : "#34d399";
    return pick;
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
        <div class="t-illus">${ILLUSTRATIONS[d.id] || ""}</div>
        <h3>${d.label}</h3>
        <p>${d.tagline}</p>
        <div class="t-count">${d.teams.length} teams available →</div>
      </div>`
      )
      .join("");
    $$("#tournamentGrid .tournament-card").forEach((card) =>
      card.addEventListener("click", () => selectTournament(card.dataset.ds))
    );
  }

  async function selectTournament(dsId) {
    const base = DATASETS[dsId];
    state.teamA = state.teamB = null;
    $("#teamSearch").value = "";
    $("#toVenue").disabled = true;

    // Show the picker immediately with a loading state, then swap in the data.
    state.dataset = { ...base };
    goto(2);
    renderSlots();
    showLoadingBadge(base.label);
    $("#teamList").innerHTML = loadingCards();

    const result = await loadTeams(dsId, base);
    state.dataset = { ...base, teams: result.teams };
    state.source = result.source;
    state.updated = result.updated || null;
    state.reason = result.reason || null;

    renderDataBadge();
    renderTeamList();
  }

  /*
   * Fetch live teams from the serverless function. Falls back to the bundled
   * sample dataset if the endpoint is unreachable (e.g. opened as a file://,
   * offline, or no API key configured on the server).
   */
  async function loadTeams(dsId, base) {
    try {
      const res = await fetch(`/api/teams?tournament=${encodeURIComponent(dsId)}`, {
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error("http_" + res.status);
      const data = await res.json();
      if (data.source === "live" && Array.isArray(data.teams) && data.teams.length) {
        return { teams: data.teams, source: "live", updated: data.updated };
      }
      return { teams: base.teams, source: "fallback", reason: data.reason || "no_live_data" };
    } catch (err) {
      return { teams: base.teams, source: "fallback", reason: "unreachable" };
    }
  }

  function loadingCards() {
    return Array.from({ length: 8 })
      .map(() => `<div class="team-chip skeleton"><div class="mini-crest sk"></div><div><div class="sk-line"></div><div class="sk-line short"></div></div></div>`)
      .join("");
  }

  function showLoadingBadge(label) {
    const badge = $("#dataBadge");
    badge.hidden = false;
    badge.className = "data-badge loading";
    badge.innerHTML = `<span class="pulse"></span> Fetching live ${label} stats…`;
  }

  function renderDataBadge() {
    const badge = $("#dataBadge");
    badge.hidden = false;
    if (state.source === "live") {
      badge.className = "data-badge live";
      badge.innerHTML = `<span class="dot-live"></span> LIVE · standings updated ${timeAgo(state.updated)}`;
    } else {
      badge.className = "data-badge sample";
      badge.innerHTML = `${icon("warning")} Sample ratings (${friendlyReason(state.reason)}) — deploy with a token for live data`;
    }
  }

  function friendlyReason(reason) {
    switch (reason) {
      case "unreachable": return "no live endpoint";
      case "no_token":
      case "no_api_key": return "no API token set";
      case "no_live_data":
      case "no_standings": return "no live standings yet";
      default: return "live data unavailable";
    }
  }

  function timeAgo(iso) {
    if (!iso) return "just now";
    const mins = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins} min ago`;
    const hrs = Math.round(mins / 60);
    return `${hrs} hr${hrs > 1 ? "s" : ""} ago`;
  }

  // ---- STEP 2: team picker --------------------------------------------
  function renderSlots() {
    ["A", "B"].forEach((k) => {
      const team = state["team" + k];
      const slot = $("#slot" + k);
      if (team) {
        slot.classList.add("filled");
        const meta = team.live
          ? `${team.live.record} · form ${team.live.form || "—"}`
          : team.titles;
        slot.innerHTML = `
          <span class="slot-tag">Team ${k}</span>
          <div class="slot-team">
            ${crest(team)}
            <span class="team-name">${team.name}</span>
            <span class="team-rating">Rating ${team.rating} · ${meta}</span>
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
        const sub = t.live
          ? `Rating ${t.rating} · ${t.live.record}`
          : `Rating ${t.rating}`;
        return `
        <div class="team-chip ${isSel ? "selected" : ""}" data-id="${t.id}">
          <div class="mini-crest" style="background:linear-gradient(135deg,${c1},${c2})">${t.short}</div>
          <div>
            <div class="chip-name">${t.name}</div>
            <div class="chip-rating">${sub}</div>
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
      { id: "home", icon: "stadium", title: `${A.name} home`, sub: `Advantage ${A.short}` },
      { id: "neutral", icon: "scales", title: "Neutral ground", sub: "No home edge" },
      { id: "away", icon: "plane", title: `${B.name} home`, sub: `Advantage ${B.short}` },
    ];
    $("#venueGrid").innerHTML = opts
      .map(
        (o) => `
      <div class="venue-card ${state.venue === o.id ? "selected" : ""}" data-venue="${o.id}">
        <div class="v-icon">${icon(o.icon)}</div>
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
    state.lastPrediction = r;
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
      ? `<span class="winner-tag">${icon("trophy")} ${favourite.name} favoured</span>`
      : `<span class="winner-tag">${icon("scales")} Too close to call</span>`;

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
            ${liveTag(teamA)}
          </div>
          <div class="result-score">
            ${predictedScore.a} – ${predictedScore.b}
            <small>${venueNote}</small>
          </div>
          <div class="result-team">
            ${crest(teamB, "big")}
            <span class="rt-name">${teamB.name}</span>
            ${liveTag(teamB)}
          </div>
        </div>
        ${resultSourceNote()}
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
            <span><i style="background:${displayColor(teamA)}"></i>${teamA.name}</span>
            <span><i class="draw-swatch"></i>Draw</span>
            <span><i style="background:${displayColor(teamB)}"></i>${teamB.name}</span>
          </div>
        </div>
      </div>

      <div class="result-cards">
        <div class="info-card">
          <h4>Head-to-head factors</h4>
          ${factors.map(factorRow).join("")}
        </div>
        <div class="info-card">
          <h4>${icon("radar")} Stat radar</h4>
          ${radarChart(teamA, teamB)}
        </div>
        <div class="info-card">
          <h4>Most likely scorelines</h4>
          <div class="score-list">
            ${topScores.map((s) => scoreItem(s, topScores[0].p)).join("")}
          </div>
        </div>
        ${formCard(teamA, teamB)}
        <div class="info-card sim-card" id="simCard">
          <h4>${icon("play")} Match simulator</h4>
          <p class="sim-intro">Run the model as a Monte-Carlo experiment — sampling goals from each side's xG — to see how often each result comes up.</p>
          <button class="primary-btn with-icon sim-run" id="simRun"><span>${icon("play")}</span> Simulate 1,000 matches</button>
          <div id="simResult"></div>
        </div>
        <div class="narrative">
          <h4>The Oracle says</h4>
          <p>${narrative(r, pA, pD, pB)}</p>
        </div>
      </div>`;

    const simBtn = $("#simRun");
    if (simBtn) simBtn.addEventListener("click", () => runSimulation(r));
  }

  function liveTag(team) {
    if (!team.live) return "";
    return `<span class="rt-live">${team.live.record}</span>`;
  }

  function resultSourceNote() {
    if (state.source === "live") {
      return `<div class="source-note live">${icon("lightning")} Based on live ${state.dataset.label} stats · updated ${timeAgo(state.updated)}</div>`;
    }
    return `<div class="source-note sample">Based on sample ratings — deploy with a token for live tournament data</div>`;
  }

  // ---- Radar chart (SVG) ----------------------------------------------
  function radarChart(teamA, teamB) {
    const axes = [
      { key: "rating", label: "Rating" },
      { key: "attack", label: "Attack" },
      { key: "defense", label: "Defense" },
      { key: "form", label: "Form" },
      { key: "pedigree", label: "Pedigree" },
    ];
    const W = 300, H = 250, cx = 150, cy = 125, R = 78;
    const n = axes.length;
    const angle = (i) => -Math.PI / 2 + (i * 2 * Math.PI) / n;
    const point = (i, r) => [cx + Math.cos(angle(i)) * r, cy + Math.sin(angle(i)) * r];

    // Grid rings + spokes.
    let grid = "";
    [0.25, 0.5, 0.75, 1].forEach((f) => {
      const pts = axes.map((_, i) => point(i, R * f).map((v) => v.toFixed(1)).join(",")).join(" ");
      grid += `<polygon points="${pts}" class="radar-ring" />`;
    });
    axes.forEach((_, i) => {
      const [x, y] = point(i, R);
      grid += `<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" class="radar-spoke" />`;
    });

    const poly = (team) => axes.map((a, i) => point(i, R * Math.max(0, Math.min(1, team[a.key] / 100))).map((v) => v.toFixed(1)).join(",")).join(" ");

    const labels = axes
      .map((a, i) => {
        const [x, y] = point(i, R + 15);
        const anchor = Math.abs(x - cx) < 6 ? "middle" : x > cx ? "start" : "end";
        return `<text x="${x.toFixed(1)}" y="${(y + 4).toFixed(1)}" text-anchor="${anchor}" class="radar-label">${a.label}</text>`;
      })
      .join("");

    const colA = displayColor(teamA), colB = displayColor(teamB);
    return `
      <svg viewBox="0 0 ${W} ${H}" class="radar-svg" role="img" aria-label="Stat comparison radar">
        ${grid}
        <polygon points="${poly(teamB)}" fill="${colB}" fill-opacity="0.20" stroke="${colB}" stroke-width="2" />
        <polygon points="${poly(teamA)}" fill="${colA}" fill-opacity="0.28" stroke="${colA}" stroke-width="2" />
        ${labels}
      </svg>
      <div class="radar-legend">
        <span><i style="background:${colA}"></i>${teamA.short}</span>
        <span><i style="background:${colB}"></i>${teamB.short}</span>
      </div>`;
  }

  // ---- Live form strip -------------------------------------------------
  function formCard(teamA, teamB) {
    if (!teamA.live && !teamB.live) return "";
    const row = (team) => {
      const f = team.live && team.live.form ? team.live.form : "";
      const pills = f
        ? [...f].map((r) => `<span class="form-pill f-${r}">${r}</span>`).join("")
        : `<span class="form-none">no recent matches</span>`;
      return `
        <div class="form-row">
          <div class="form-team">${crest(team)}<span>${team.short}</span></div>
          <div class="form-pills">${pills}</div>
        </div>`;
    };
    return `
      <div class="info-card">
        <h4>Live form (recent → latest)</h4>
        ${row(teamA)}${row(teamB)}
      </div>`;
  }

  // ---- Monte-Carlo simulation -----------------------------------------
  function runSimulation(r) {
    const N = 1000;
    const sim = Predictor.simulate(r.xg.a, r.xg.b, N);
    const { teamA, teamB } = r;
    const pct = (x) => Math.round((x / N) * 100);
    const wa = pct(sim.winA), dr = pct(sim.draw), wb = 100 - pct(sim.winA) - pct(sim.draw);
    const topScore = sim.topScore;

    const box = $("#simResult");
    box.innerHTML = `
      <div class="sim-out">
        <div class="sim-headline">
          <span>${teamA.short} <strong>${sim.winA}</strong></span>
          <span>Draw <strong>${sim.draw}</strong></span>
          <span>${teamB.short} <strong>${sim.winB}</strong></span>
        </div>
        <div class="prob-bar sim-bar">
          <div class="prob-seg" data-w="${wa}" style="width:0;background:linear-gradient(135deg,${teamA.colors[0]},${teamA.colors[1]})">${wa}%</div>
          <div class="prob-seg draw" data-w="${dr}" style="width:0">${dr}%</div>
          <div class="prob-seg" data-w="${wb}" style="width:0;background:linear-gradient(135deg,${teamB.colors[0]},${teamB.colors[1]})">${wb}%</div>
        </div>
        <div class="sim-stats">
          <div><span class="sim-k">Avg goals</span><span class="sim-v">${sim.avgA.toFixed(2)} – ${sim.avgB.toFixed(2)}</span></div>
          <div><span class="sim-k">Most common</span><span class="sim-v">${topScore.a}–${topScore.b} (${pct(topScore.count)}%)</span></div>
          <div><span class="sim-k">Both teams scored</span><span class="sim-v">${pct(sim.btts)}%</span></div>
        </div>
        <button class="ghost-btn with-icon sim-again" id="simAgain"><span>${icon("refresh")}</span> Run again</button>
      </div>`;
    $("#simRun").style.display = "none";
    $("#simAgain").addEventListener("click", () => runSimulation(r));
    requestAnimationFrame(() => requestAnimationFrame(() =>
      $$("#simResult .prob-seg").forEach((s) => (s.style.width = s.dataset.w + "%"))
    ));
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

  // ---- icons + theme ---------------------------------------------------
  function hydrateIcons() {
    $$("[data-icon]").forEach((el) => {
      if (!el.dataset.hydrated) {
        el.innerHTML = icon(el.dataset.icon);
        el.dataset.hydrated = "1";
      }
    });
  }

  const THEME_KEY = "oracle-theme";
  function preferredTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  }
  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    const btn = $("#themeToggle");
    // Show the icon of the mode you'd switch TO.
    btn.innerHTML = icon(theme === "dark" ? "sun" : "moon");
    btn.dataset.theme = theme;
  }
  function toggleTheme() {
    const next = (document.documentElement.getAttribute("data-theme") === "dark") ? "light" : "dark";
    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
  }

  // ---- Surprise me: random matchup ------------------------------------
  function surpriseMe() {
    const teams = state.dataset && state.dataset.teams;
    if (!teams || teams.length < 2) return;
    const i = Math.floor(Math.random() * teams.length);
    let j = Math.floor(Math.random() * (teams.length - 1));
    if (j >= i) j++;
    state.teamA = teams[i];
    state.teamB = teams[j];
    renderSlots();
    renderTeamList($("#teamSearch").value);
  }

  // ---- wiring ----------------------------------------------------------
  function init() {
    applyTheme(preferredTheme());
    hydrateIcons();
    renderTournaments();

    $("#themeToggle").addEventListener("click", toggleTheme);
    $("#surpriseBtn").addEventListener("click", surpriseMe);
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
