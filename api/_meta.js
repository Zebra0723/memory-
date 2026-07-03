/*
 * Static team metadata that the live stats API does not provide:
 * brand colours, a historical "pedigree" score, honours text and a short code.
 *
 * The live feed (API-Football standings) gives us live form / goals / points,
 * from which attack, defense, form and overall rating are derived. Everything
 * in here is the timeless stuff that isn't in a league table.
 *
 * Matching is fuzzy: API team names vary ("USA" vs "United States",
 * "Tottenham" vs "Tottenham Hotspur"), so we normalise before lookup and fall
 * back to deterministic generated values for anyone not listed.
 */

const META = {
  // ---- World Cup nations ----
  argentina:     { short: "ARG", colors: ["#75AADB", "#FFFFFF"], pedigree: 92, titles: "3× World Cup" },
  france:        { short: "FRA", colors: ["#002654", "#ED2939"], pedigree: 90, titles: "2× World Cup" },
  brazil:        { short: "BRA", colors: ["#FEDF00", "#009C3B"], pedigree: 96, titles: "5× World Cup" },
  england:       { short: "ENG", colors: ["#FFFFFF", "#CE1124"], pedigree: 78, titles: "1× World Cup" },
  spain:         { short: "ESP", colors: ["#AA151B", "#F1BF00"], pedigree: 84, titles: "1× World Cup" },
  portugal:      { short: "POR", colors: ["#006600", "#FF0000"], pedigree: 74, titles: "Euro 2016" },
  netherlands:   { short: "NED", colors: ["#FF6600", "#FFFFFF"], pedigree: 80, titles: "3× WC finalist" },
  belgium:       { short: "BEL", colors: ["#E30613", "#FDDA24"], pedigree: 70, titles: "WC 3rd '18" },
  germany:       { short: "GER", colors: ["#000000", "#DD0000"], pedigree: 90, titles: "4× World Cup" },
  italy:         { short: "ITA", colors: ["#0066CC", "#FFFFFF"], pedigree: 88, titles: "4× World Cup" },
  croatia:       { short: "CRO", colors: ["#FF0000", "#FFFFFF"], pedigree: 76, titles: "WC finalist '18" },
  uruguay:       { short: "URU", colors: ["#5CBFEB", "#000000"], pedigree: 80, titles: "2× World Cup" },
  morocco:       { short: "MAR", colors: ["#C1272D", "#006233"], pedigree: 64, titles: "WC 4th '22" },
  usa:           { short: "USA", colors: ["#0A3161", "#B31942"], pedigree: 58, titles: "Host '26", aliases: ["united states", "united states of america"] },
  mexico:        { short: "MEX", colors: ["#006847", "#CE1126"], pedigree: 66, titles: "Co-host '26" },
  canada:        { short: "CAN", colors: ["#FF0000", "#FFFFFF"], pedigree: 52, titles: "Co-host '26" },
  senegal:       { short: "SEN", colors: ["#00853F", "#FDEF42"], pedigree: 62, titles: "AFCON 2021" },
  japan:         { short: "JPN", colors: ["#0A2865", "#FFFFFF"], pedigree: 60, titles: "4× WC R16" },
  colombia:      { short: "COL", colors: ["#FCD116", "#003893"], pedigree: 66, titles: "Copa finalist '24" },
  "south korea": { short: "KOR", colors: ["#CD2E3A", "#0047A0"], pedigree: 62, titles: "WC 4th '02", aliases: ["korea republic", "south-korea"] },
  switzerland:   { short: "SUI", colors: ["#FF0000", "#FFFFFF"], pedigree: 64, titles: "Consistent R16" },
  denmark:       { short: "DEN", colors: ["#C60C30", "#FFFFFF"], pedigree: 66, titles: "Euro 1992" },
  poland:        { short: "POL", colors: ["#DC143C", "#FFFFFF"], pedigree: 62, titles: "WC 3rd ×2" },
  serbia:        { short: "SRB", colors: ["#C6363C", "#0C4076"], pedigree: 58, titles: "Regular qualifier" },
  ecuador:       { short: "ECU", colors: ["#FFDD00", "#034EA2"], pedigree: 56, titles: "3× WC" },
  ghana:         { short: "GHA", colors: ["#006B3F", "#FCD116"], pedigree: 58, titles: "WC QF '10" },
  nigeria:       { short: "NGA", colors: ["#008751", "#FFFFFF"], pedigree: 58, titles: "3× AFCON" },
  cameroon:      { short: "CMR", colors: ["#007A5E", "#CE1126"], pedigree: 60, titles: "WC QF '90" },
  australia:     { short: "AUS", colors: ["#FFCD00", "#00843D"], pedigree: 54, titles: "Asian Cup '15" },
  "saudi arabia":{ short: "KSA", colors: ["#006C35", "#FFFFFF"], pedigree: 52, titles: "Beat ARG '22" },
  austria:       { short: "AUT", colors: ["#ED2939", "#FFFFFF"], pedigree: 58, titles: "WC 3rd '54" },
  turkey:        { short: "TUR", colors: ["#E30A17", "#FFFFFF"], pedigree: 58, titles: "WC 3rd '02", aliases: ["türkiye", "turkiye"] },

  // ---- Premier League clubs ----
  "manchester city":   { short: "MCI", colors: ["#6CABDD", "#1C2C5B"], pedigree: 88, titles: "9 PL titles" },
  arsenal:             { short: "ARS", colors: ["#EF0107", "#FFFFFF"], pedigree: 82, titles: "13 titles" },
  liverpool:           { short: "LIV", colors: ["#C8102E", "#00B2A9"], pedigree: 90, titles: "19 titles" },
  "manchester united": { short: "MUN", colors: ["#DA020E", "#FBE122"], pedigree: 92, titles: "20 titles" },
  tottenham:           { short: "TOT", colors: ["#132257", "#FFFFFF"], pedigree: 68, titles: "2 titles", aliases: ["tottenham hotspur", "spurs"] },
  chelsea:             { short: "CHE", colors: ["#034694", "#FFFFFF"], pedigree: 84, titles: "6 titles" },
  newcastle:           { short: "NEW", colors: ["#241F20", "#FFFFFF"], pedigree: 66, titles: "4 titles", aliases: ["newcastle united"] },
  "aston villa":       { short: "AVL", colors: ["#95BFE5", "#670E36"], pedigree: 70, titles: "7 titles" },
  "west ham":          { short: "WHU", colors: ["#7A263A", "#1BB1E7"], pedigree: 60, titles: "Conference '23", aliases: ["west ham united"] },
  brighton:            { short: "BHA", colors: ["#0057B8", "#FFCD00"], pedigree: 52, titles: "Est. 1901", aliases: ["brighton hove albion", "brighton & hove albion"] },
  "crystal palace":    { short: "CRY", colors: ["#1B458F", "#C4122E"], pedigree: 55, titles: "Est. 1905" },
  bournemouth:         { short: "BOU", colors: ["#DA291C", "#000000"], pedigree: 48, titles: "Est. 1899", aliases: ["afc bournemouth"] },
  fulham:              { short: "FUL", colors: ["#FFFFFF", "#000000"], pedigree: 54, titles: "Est. 1879" },
  wolves:              { short: "WOL", colors: ["#FDB913", "#231F20"], pedigree: 62, titles: "3 titles", aliases: ["wolverhampton wanderers", "wolverhampton"] },
  everton:             { short: "EVE", colors: ["#003399", "#FFFFFF"], pedigree: 74, titles: "9 titles" },
  brentford:           { short: "BRE", colors: ["#D20000", "#FBB800"], pedigree: 50, titles: "Est. 1889" },
  "nottingham forest": { short: "NFO", colors: ["#DD0000", "#FFFFFF"], pedigree: 72, titles: "2 European Cups" },
};

// Build an alias → key index for fuzzy matching.
const ALIAS_INDEX = {};
for (const [key, m] of Object.entries(META)) {
  ALIAS_INDEX[normalize(key)] = key;
  (m.aliases || []).forEach((a) => (ALIAS_INDEX[normalize(a)] = key));
}

function normalize(name) {
  return String(name || "")
    .toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "") // strip accents
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

// Deterministic colour from a name so unlisted teams still look intentional.
function hashColors(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffffff;
  const hue = h % 360;
  return [`hsl(${hue} 65% 42%)`, `hsl(${(hue + 40) % 360} 60% 30%)`];
}

function makeShort(name) {
  const words = normalize(name).toUpperCase().split(" ").filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 3);
  return (words[0][0] + words[1][0] + (words[2] ? words[2][0] : words[1][1] || "")).slice(0, 3);
}

// Return metadata for a team name, generating sensible defaults if unknown.
function metaFor(name) {
  const key = ALIAS_INDEX[normalize(name)];
  if (key) return { ...META[key] };
  return { short: makeShort(name), colors: hashColors(String(name)), pedigree: 60, titles: "" };
}

module.exports = { metaFor, normalize };
