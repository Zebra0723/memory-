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
  "leeds united":      { short: "LEE", colors: ["#FFFFFF", "#1D428A"], pedigree: 66, titles: "3 top-flight titles", aliases: ["leeds"] },
  "burnley":           { short: "BUR", colors: ["#6C1D45", "#99D6EA"], pedigree: 58, titles: "2 top-flight titles", aliases: ["burnley fc"] },
  "sunderland":        { short: "SUN", colors: ["#EB172B", "#FFFFFF"], pedigree: 56, titles: "6 top-flight titles", aliases: ["sunderland afc"] },

  // ---- European club competitions (La Liga / Bundesliga / Serie A / Ligue 1 / etc.) ----
  "real madrid":        { short: "RMA", colors: ["#FEBE10", "#00529F"], pedigree: 99, titles: "15× UCL", aliases: ["real madrid cf"] },
  "barcelona":          { short: "BAR", colors: ["#A50044", "#004D98"], pedigree: 92, titles: "5× UCL", aliases: ["fc barcelona", "barca"] },
  "atletico madrid":    { short: "ATM", colors: ["#CB3524", "#262E62"], pedigree: 74, titles: "3× UCL finalist", aliases: ["club atletico de madrid", "atletico de madrid"] },
  "athletic bilbao":    { short: "ATH", colors: ["#EE2523", "#FFFFFF"], pedigree: 68, titles: "8× La Liga", aliases: ["athletic club"] },
  "real sociedad":      { short: "RSO", colors: ["#0067B1", "#FFFFFF"], pedigree: 62, titles: "2× La Liga" },
  "real betis":         { short: "BET", colors: ["#00954C", "#FFFFFF"], pedigree: 56, titles: "1× La Liga", aliases: ["real betis balompie"] },
  "villarreal":         { short: "VIL", colors: ["#FFE667", "#005187"], pedigree: 58, titles: "Europa 2021", aliases: ["villarreal cf"] },
  "sevilla":            { short: "SEV", colors: ["#D9111B", "#FFFFFF"], pedigree: 62, titles: "7× Europa", aliases: ["sevilla fc"] },
  "girona":             { short: "GIR", colors: ["#CD2534", "#FFFFFF"], pedigree: 44, titles: "UCL debut", aliases: ["girona fc"] },
  "valencia":           { short: "VAL", colors: ["#FF7F00", "#000000"], pedigree: 66, titles: "6× La Liga", aliases: ["valencia cf"] },

  "bayern munich":      { short: "BAY", colors: ["#DC052D", "#FFFFFF"], pedigree: 96, titles: "6× UCL", aliases: ["fc bayern munchen", "bayern munchen", "fc bayern munich"] },
  "bayer leverkusen":   { short: "B04", colors: ["#E32219", "#000000"], pedigree: 60, titles: "Champions 2024", aliases: ["bayer 04 leverkusen"] },
  "rb leipzig":         { short: "RBL", colors: ["#DD0741", "#001F47"], pedigree: 52, titles: "DFB-Pokal" },
  "borussia dortmund":  { short: "BVB", colors: ["#FDE100", "#000000"], pedigree: 80, titles: "UCL 1997", aliases: ["dortmund"] },
  "stuttgart":          { short: "VFB", colors: ["#FFFFFF", "#E32219"], pedigree: 60, titles: "5× champions", aliases: ["vfb stuttgart"] },
  "eintracht frankfurt":{ short: "SGE", colors: ["#E1000F", "#000000"], pedigree: 58, titles: "Europa 2022" },
  "rb salzburg":        { short: "RBS", colors: ["#EF1C24", "#FFFFFF"], pedigree: 56, titles: "Austrian giants", aliases: ["fc salzburg", "red bull salzburg"] },
  "borussia monchengladbach": { short: "BMG", colors: ["#000000", "#00A650"], pedigree: 62, titles: "5× champions", aliases: ["monchengladbach", "gladbach"] },
  "werder bremen":      { short: "SVW", colors: ["#1D9053", "#FFFFFF"], pedigree: 66, titles: "4× champions" },

  "inter":              { short: "INT", colors: ["#0068A8", "#000000"], pedigree: 84, titles: "3× UCL", aliases: ["fc internazionale milano", "internazionale", "inter milan"] },
  "juventus":           { short: "JUV", colors: ["#000000", "#FFFFFF"], pedigree: 92, titles: "2× UCL", aliases: ["juventus fc"] },
  "ac milan":           { short: "MIL", colors: ["#FB090B", "#000000"], pedigree: 92, titles: "7× UCL", aliases: ["milan"] },
  "napoli":             { short: "NAP", colors: ["#12A0D7", "#FFFFFF"], pedigree: 62, titles: "3× Scudetti", aliases: ["ssc napoli"] },
  "atalanta":           { short: "ATA", colors: ["#1E71B8", "#000000"], pedigree: 52, titles: "Europa 2024", aliases: ["atalanta bc"] },
  "roma":               { short: "ROM", colors: ["#8E1F2F", "#F0BC42"], pedigree: 66, titles: "3× Scudetti", aliases: ["as roma"] },
  "lazio":              { short: "LAZ", colors: ["#87D8F7", "#FFFFFF"], pedigree: 62, titles: "2× Scudetti", aliases: ["ss lazio"] },
  "fiorentina":         { short: "FIO", colors: ["#59168B", "#FFFFFF"], pedigree: 58, titles: "2× Scudetti", aliases: ["acf fiorentina"] },

  "paris saint germain":{ short: "PSG", colors: ["#004170", "#DA291C"], pedigree: 78, titles: "12× Ligue 1", aliases: ["paris saint-germain fc", "psg", "paris sg"] },
  "monaco":             { short: "ASM", colors: ["#E51B22", "#FFFFFF"], pedigree: 66, titles: "8× Ligue 1", aliases: ["as monaco fc", "as monaco"] },
  "marseille":          { short: "OM",  colors: ["#2FAEE0", "#FFFFFF"], pedigree: 70, titles: "UCL 1993", aliases: ["olympique de marseille", "olympique marseille"] },
  "lyon":               { short: "OL",  colors: ["#FFFFFF", "#DA001A"], pedigree: 72, titles: "7× Ligue 1", aliases: ["olympique lyonnais"] },
  "lille":              { short: "LIL", colors: ["#E01E13", "#FFFFFF"], pedigree: 58, titles: "4× Ligue 1", aliases: ["losc lille", "losc"] },

  "ajax":               { short: "AJA", colors: ["#D2122E", "#FFFFFF"], pedigree: 92, titles: "4× UCL", aliases: ["afc ajax"] },
  "psv":                { short: "PSV", colors: ["#ED1C24", "#FFFFFF"], pedigree: 82, titles: "UCL 1988", aliases: ["psv eindhoven"] },
  "feyenoord":          { short: "FEY", colors: ["#E30613", "#000000"], pedigree: 78, titles: "UCL 1970", aliases: ["feyenoord rotterdam"] },
  "sporting cp":        { short: "SCP", colors: ["#008057", "#FFFFFF"], pedigree: 78, titles: "20× Primeira", aliases: ["sporting clube de portugal", "sporting lisbon"] },
  "benfica":            { short: "BEN", colors: ["#E00913", "#FFFFFF"], pedigree: 84, titles: "2× UCL", aliases: ["sl benfica"] },
  "porto":              { short: "POR", colors: ["#003DA5", "#FFFFFF"], pedigree: 84, titles: "2× UCL", aliases: ["fc porto"] },
  "braga":              { short: "SCB", colors: ["#E30613", "#FFFFFF"], pedigree: 56, titles: "Europa finalist", aliases: ["sc braga"] },
  "celtic":             { short: "CEL", colors: ["#018749", "#FFFFFF"], pedigree: 66, titles: "UCL 1967", aliases: ["celtic fc"] },
  "rangers":            { short: "RAN", colors: ["#1B458F", "#FFFFFF"], pedigree: 62, titles: "55× Scotland", aliases: ["rangers fc"] },

  // ---- South American clubs (Libertadores / Brasileirão) ----
  "flamengo":           { short: "FLA", colors: ["#E30613", "#000000"], pedigree: 82, titles: "3× Libertadores", aliases: ["cr flamengo", "clube de regatas do flamengo"] },
  "palmeiras":          { short: "PAL", colors: ["#006437", "#FFFFFF"], pedigree: 86, titles: "3× Libertadores", aliases: ["se palmeiras", "sociedade esportiva palmeiras"] },
  "river plate":        { short: "RIV", colors: ["#FFFFFF", "#E30613"], pedigree: 88, titles: "4× Libertadores", aliases: ["ca river plate", "club atletico river plate"] },
  "boca juniors":       { short: "BOC", colors: ["#0A3B7C", "#F2C200"], pedigree: 92, titles: "6× Libertadores", aliases: ["ca boca juniors", "club atletico boca juniors"] },
  "fluminense":         { short: "FLU", colors: ["#7A1F3D", "#00613C"], pedigree: 66, titles: "Libertadores 2023", aliases: ["fluminense fc"] },
  "atletico mineiro":   { short: "CAM", colors: ["#000000", "#FFFFFF"], pedigree: 68, titles: "Libertadores 2013", aliases: ["clube atletico mineiro"] },
  "botafogo":           { short: "BOT", colors: ["#000000", "#FFFFFF"], pedigree: 62, titles: "Libertadores 2024", aliases: ["botafogo fr", "botafogo de futebol e regatas"] },
  "gremio":             { short: "GRE", colors: ["#0D80BF", "#000000"], pedigree: 78, titles: "3× Libertadores", aliases: ["gremio fbpa", "gremio foot-ball porto alegrense"] },
  "internacional":      { short: "INT", colors: ["#E30613", "#FFFFFF"], pedigree: 74, titles: "2× Libertadores", aliases: ["sc internacional"] },
  "sao paulo":          { short: "SAO", colors: ["#E30613", "#000000"], pedigree: 80, titles: "3× Libertadores", aliases: ["sao paulo fc"] },
  "corinthians":        { short: "COR", colors: ["#000000", "#FFFFFF"], pedigree: 76, titles: "Libertadores 2012", aliases: ["sc corinthians paulista"] },
  "penarol":            { short: "PEN", colors: ["#FCD116", "#000000"], pedigree: 86, titles: "5× Libertadores", aliases: ["ca penarol", "club atletico penarol"] },
  "nacional":           { short: "NAC", colors: ["#FFFFFF", "#003DA5"], pedigree: 78, titles: "3× Libertadores", aliases: ["club nacional de football"] },
  "colo colo":          { short: "COL", colors: ["#FFFFFF", "#000000"], pedigree: 74, titles: "Libertadores 1991", aliases: ["club social y deportivo colo-colo", "colo-colo"] },
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
