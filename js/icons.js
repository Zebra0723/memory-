/*
 * Inline SVG icon set — replaces all emoji.
 *
 * Line icons use `currentColor` so they inherit text colour and adapt to the
 * light/dark theme automatically. The two tournament illustrations are richer,
 * colour SVGs designed to read well on either theme.
 *
 * `icon(name)` returns an <svg> string; drop it straight into innerHTML.
 */

const ICONS = {
  // Brand mark — a football.
  ball: `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7.4l3.8 2.8-1.45 4.5H9.65L8.2 10.2z" fill="currentColor" stroke="none"/><path d="M12 3.1v4.3M4.5 9.5l3.7.7M6.6 18.2l2.2-3.5M17.4 18.2l-2.2-3.5M19.5 9.5l-3.7.7" stroke-width="1.2"/></svg>`,

  trophy: `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M7 4.5h10V8a5 5 0 0 1-10 0V4.5Z"/><path d="M7 6.2H4.6A2.4 2.4 0 0 0 7 10.4"/><path d="M17 6.2h2.4A2.4 2.4 0 0 1 17 10.4"/><path d="M12 13v3.2M9 20h6M10 20a2 2 0 0 1 4 0"/></svg>`,

  lightning: `<svg class="ic" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M13.2 2 4.5 13.2c-.3.4 0 1 .5 1H10l-1.4 7.2c-.1.7.8 1.1 1.2.5L19.5 10c.3-.4 0-1-.5-1H14l1.4-6.5c.1-.7-.8-1.1-1.2-.5Z"/></svg>`,

  refresh: `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M20 11a8 8 0 1 0-.9 4.5"/><path d="M20 5v4h-4"/></svg>`,

  swap: `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h13l-3.2-3.2M20 16H7l3.2 3.2"/></svg>`,

  search: `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="6.5"/><path d="m20 20-3.5-3.5"/></svg>`,

  warning: `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.5 21 19H3L12 3.5Z"/><path d="M12 10v4.2M12 17.2v.1"/></svg>`,

  sun: `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2.5M12 19.5V22M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2 12h2.5M19.5 12H22M4.2 19.8 6 18M18 6l1.8-1.8"/></svg>`,

  moon: `<svg class="ic" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M20 14.5A8.2 8.2 0 0 1 9.5 4 8.3 8.3 0 1 0 20 14.5Z"/></svg>`,

  dice: `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="4" y="4" width="16" height="16" rx="3.5"/><circle cx="9" cy="9" r="1.15" fill="currentColor" stroke="none"/><circle cx="15" cy="15" r="1.15" fill="currentColor" stroke="none"/><circle cx="15" cy="9" r="1.15" fill="currentColor" stroke="none"/><circle cx="9" cy="15" r="1.15" fill="currentColor" stroke="none"/></svg>`,

  radar: `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path d="M12 3l7.4 5.4-2.8 8.7H7.4L4.6 8.4z"/><path d="M12 7.6l3.8 2.8-1.45 4.5H9.65L8.2 10.4z" opacity=".55"/></svg>`,

  play: `<svg class="ic" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10-6.5a1 1 0 0 0 0-1.72l-10-6.5A1 1 0 0 0 8 5.5Z"/></svg>`,

  // Venue icons
  stadium: `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8c0-1.7 4-3 9-3s9 1.3 9 3-4 3-9 3-9-1.3-9-3Z"/><path d="M3 8v5c0 1.7 4 3 9 3s9-1.3 9-3V8"/><path d="M8.5 11.3V18M15.5 11.3V18M12 11.5v6.5"/></svg>`,

  scales: `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v16M7 20h10"/><path d="M5 7h14M5 7 2.5 12.5h5L5 7ZM19 7l-2.5 5.5h5L19 7Z"/><path d="M4 7c3 1 5 1 8 0s5-1 8 0" opacity=".01"/><path d="M2.5 12.5a2.5 2.5 0 0 0 5 0M16.5 12.5a2.5 2.5 0 0 0 5 0"/></svg>`,

  plane: `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.5 12 3 9.8l1.6-1.5 8.2 1.3 4-3.9c.8-.8 2.4-1 3 .4.6 1.3-.4 2.2-1 2.6l-4.3 3 .6 8-1.7 1.2-2.9-6.9-3.2 2.2v2.4l-1.4.8-1-3.4-3.4-1 .8-1.4h2.4z"/></svg>`,

  logout: `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M20 11a8 8 0 1 0-.9 4.5"/><path d="M20 5v4h-4"/></svg>`,
};

// Colour illustrations for the two tournament cards (viewBox 64×64).
const ILLUSTRATIONS = {
  world: `
    <svg viewBox="0 0 64 64" fill="none" width="56" height="56" aria-hidden="true">
      <defs>
        <linearGradient id="globeG" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#22d3ee"/><stop offset="1" stop-color="#2563eb"/>
        </linearGradient>
      </defs>
      <circle cx="32" cy="34" r="20" fill="url(#globeG)"/>
      <path d="M12 34h40M32 14v40M17 22c9 6 21 6 30 0M17 46c9-6 21-6 30 0" stroke="#ffffff" stroke-width="1.6" opacity=".85" fill="none"/>
      <ellipse cx="32" cy="34" rx="9" ry="20" stroke="#ffffff" stroke-width="1.6" opacity=".85" fill="none"/>
      <path d="M32 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z" fill="#fbbf24" stroke="#0a0e17" stroke-width="1"/>
    </svg>`,
  premier: `
    <svg viewBox="0 0 64 64" fill="none" width="56" height="56" aria-hidden="true">
      <defs>
        <linearGradient id="crestG" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#e90052"/><stop offset="1" stop-color="#37003c"/>
        </linearGradient>
      </defs>
      <path d="M32 4 54 11v20c0 14-11 23-22 29C21 54 10 45 10 31V11z" fill="url(#crestG)"/>
      <path d="M32 4 54 11v20c0 14-11 23-22 29C21 54 10 45 10 31V11z" stroke="#00ff85" stroke-width="1.6" fill="none" opacity=".9"/>
      <path d="M23 40c-1-4 .5-8 3-9-1 2-.6 4 .8 4.4 1.7.5 2.4-1.2 1.7-2.9 2.4 1 4 3.6 3.3 6.6 2-1 3.2-3 3-5.6 2 1.8 2.7 5 1.3 7.7 1.8-.6 3-2.2 3.2-4.2 1.3 3-.2 6.6-3.2 8.2-4.6 2.3-11 1-16.4-2.4 1.6.6 3.4.7 5 .3-3.2-1-5.2-3.6-4.9-6.6.6 1.6 2 2.7 3.9 2.7z" fill="#00ff85"/>
      <circle cx="32" cy="21" r="3.2" fill="#fbbf24"/>
    </svg>`,
};

function icon(name, cls = "") {
  const svg = ICONS[name] || "";
  return cls ? svg.replace('class="ic"', `class="ic ${cls}"`) : svg;
}
