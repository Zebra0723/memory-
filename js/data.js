/*
 * Team datasets for the Premier League / World Cup Predictor.
 *
 * Ratings are on a 0–100 scale and are hand-tuned approximations meant to
 * reflect each side's relative strength across the 2023–24 club season and the
 * modern international era. They power a lightweight Elo + Poisson model — they
 * are illustrative, not betting-grade.
 *
 * Fields:
 *   attack   – quality & volume of chance creation / finishing
 *   defense  – solidity, clean-sheet ability
 *   form     – recent results momentum
 *   pedigree – historical tournament pedigree / big-game experience
 *   rating   – overall Elo-style base rating (drives the core prediction)
 *   titles   – headline honours (league titles for clubs, WC/continental for nations)
 */

const PREMIER_LEAGUE = [
  { id: "mci", name: "Manchester City",     short: "MCI", colors: ["#6CABDD", "#1C2C5B"], rating: 92, attack: 94, defense: 88, form: 90, pedigree: 88, titles: "9 PL titles" },
  { id: "ars", name: "Arsenal",             short: "ARS", colors: ["#EF0107", "#FFFFFF"], rating: 88, attack: 88, defense: 86, form: 89, pedigree: 82, titles: "13 top-flight titles" },
  { id: "liv", name: "Liverpool",           short: "LIV", colors: ["#C8102E", "#00B2A9"], rating: 87, attack: 89, defense: 82, form: 85, pedigree: 90, titles: "19 top-flight titles" },
  { id: "mun", name: "Manchester United",   short: "MUN", colors: ["#DA020E", "#FBE122"], rating: 80, attack: 80, defense: 74, form: 72, pedigree: 92, titles: "20 top-flight titles" },
  { id: "tot", name: "Tottenham Hotspur",   short: "TOT", colors: ["#132257", "#FFFFFF"], rating: 79, attack: 84, defense: 72, form: 78, pedigree: 68, titles: "2 top-flight titles" },
  { id: "che", name: "Chelsea",             short: "CHE", colors: ["#034694", "#FFFFFF"], rating: 78, attack: 79, defense: 76, form: 74, pedigree: 84, titles: "6 top-flight titles" },
  { id: "new", name: "Newcastle United",    short: "NEW", colors: ["#241F20", "#FFFFFF"], rating: 78, attack: 81, defense: 75, form: 76, pedigree: 66, titles: "4 top-flight titles" },
  { id: "avl", name: "Aston Villa",         short: "AVL", colors: ["#95BFE5", "#670E36"], rating: 79, attack: 82, defense: 74, form: 83, pedigree: 70, titles: "7 top-flight titles" },
  { id: "whu", name: "West Ham United",     short: "WHU", colors: ["#7A263A", "#1BB1E7"], rating: 73, attack: 74, defense: 71, form: 70, pedigree: 60, titles: "Europa Conference '23" },
  { id: "bha", name: "Brighton",            short: "BHA", colors: ["#0057B8", "#FFCD00"], rating: 74, attack: 76, defense: 72, form: 73, pedigree: 52, titles: "Est. 1901" },
  { id: "cry", name: "Crystal Palace",      short: "CRY", colors: ["#1B458F", "#C4122E"], rating: 70, attack: 70, defense: 70, form: 72, pedigree: 55, titles: "Est. 1905" },
  { id: "bou", name: "Bournemouth",         short: "BOU", colors: ["#DA291C", "#000000"], rating: 69, attack: 71, defense: 66, form: 71, pedigree: 48, titles: "Est. 1899" },
  { id: "ful", name: "Fulham",              short: "FUL", colors: ["#FFFFFF", "#000000"], rating: 70, attack: 71, defense: 68, form: 69, pedigree: 54, titles: "Est. 1879" },
  { id: "wol", name: "Wolves",              short: "WOL", colors: ["#FDB913", "#231F20"], rating: 70, attack: 70, defense: 69, form: 70, pedigree: 62, titles: "3 top-flight titles" },
  { id: "eve", name: "Everton",             short: "EVE", colors: ["#003399", "#FFFFFF"], rating: 68, attack: 66, defense: 70, form: 66, pedigree: 74, titles: "9 top-flight titles" },
  { id: "bre", name: "Brentford",           short: "BRE", colors: ["#D20000", "#FBB800"], rating: 69, attack: 72, defense: 65, form: 68, pedigree: 50, titles: "Est. 1889" },
  { id: "nfo", name: "Nottingham Forest",   short: "NFO", colors: ["#DD0000", "#FFFFFF"], rating: 67, attack: 68, defense: 65, form: 67, pedigree: 72, titles: "2 European Cups" },
  { id: "lut", name: "Luton Town",          short: "LUT", colors: ["#F78F1E", "#002D62"], rating: 62, attack: 63, defense: 60, form: 63, pedigree: 44, titles: "Est. 1885" },
  { id: "bur", name: "Burnley",             short: "BUR", colors: ["#6C1D45", "#99D6EA"], rating: 63, attack: 62, defense: 63, form: 61, pedigree: 58, titles: "2 top-flight titles" },
  { id: "shu", name: "Sheffield United",    short: "SHU", colors: ["#EE2737", "#000000"], rating: 61, attack: 60, defense: 60, form: 59, pedigree: 56, titles: "1 top-flight title" },
];

const WORLD_CUP = [
  { id: "arg", name: "Argentina",    short: "ARG", colors: ["#75AADB", "#FFFFFF"], rating: 93, attack: 91, defense: 88, form: 94, pedigree: 92, titles: "3× World Cup" },
  { id: "fra", name: "France",       short: "FRA", colors: ["#002654", "#ED2939"], rating: 92, attack: 93, defense: 87, form: 90, pedigree: 90, titles: "2× World Cup" },
  { id: "bra", name: "Brazil",       short: "BRA", colors: ["#FEDF00", "#009C3B"], rating: 90, attack: 92, defense: 84, form: 84, pedigree: 96, titles: "5× World Cup" },
  { id: "eng", name: "England",      short: "ENG", colors: ["#FFFFFF", "#CE1124"], rating: 88, attack: 88, defense: 85, form: 86, pedigree: 78, titles: "1× World Cup" },
  { id: "esp", name: "Spain",        short: "ESP", colors: ["#AA151B", "#F1BF00"], rating: 88, attack: 89, defense: 84, form: 88, pedigree: 84, titles: "1× World Cup" },
  { id: "por", name: "Portugal",     short: "POR", colors: ["#006600", "#FF0000"], rating: 87, attack: 89, defense: 82, form: 85, pedigree: 74, titles: "Euro 2016" },
  { id: "ned", name: "Netherlands",  short: "NED", colors: ["#FF6600", "#FFFFFF"], rating: 85, attack: 86, defense: 82, form: 82, pedigree: 80, titles: "3× WC finalist" },
  { id: "bel", name: "Belgium",      short: "BEL", colors: ["#E30613", "#FDDA24"], rating: 84, attack: 85, defense: 80, form: 78, pedigree: 70, titles: "WC 3rd '18" },
  { id: "ger", name: "Germany",      short: "GER", colors: ["#000000", "#DD0000"], rating: 85, attack: 85, defense: 83, form: 79, pedigree: 90, titles: "4× World Cup" },
  { id: "ita", name: "Italy",        short: "ITA", colors: ["#0066CC", "#FFFFFF"], rating: 84, attack: 82, defense: 88, form: 80, pedigree: 88, titles: "4× World Cup" },
  { id: "cro", name: "Croatia",      short: "CRO", colors: ["#FF0000", "#FFFFFF"], rating: 83, attack: 82, defense: 81, form: 81, pedigree: 76, titles: "WC finalist '18" },
  { id: "uru", name: "Uruguay",      short: "URU", colors: ["#5CBFEB", "#000000"], rating: 82, attack: 83, defense: 80, form: 83, pedigree: 80, titles: "2× World Cup" },
  { id: "mar", name: "Morocco",      short: "MAR", colors: ["#C1272D", "#006233"], rating: 81, attack: 79, defense: 84, form: 82, pedigree: 64, titles: "WC 4th '22" },
  { id: "usa", name: "USA",          short: "USA", colors: ["#0A3161", "#B31942"], rating: 76, attack: 77, defense: 74, form: 78, pedigree: 58, titles: "WC 3rd '30" },
  { id: "mex", name: "Mexico",       short: "MEX", colors: ["#006847", "#CE1126"], rating: 78, attack: 79, defense: 76, form: 74, pedigree: 66, titles: "2× WC QF" },
  { id: "sen", name: "Senegal",      short: "SEN", colors: ["#00853F", "#FDEF42"], rating: 78, attack: 78, defense: 78, form: 77, pedigree: 62, titles: "AFCON 2021" },
  { id: "jpn", name: "Japan",        short: "JPN", colors: ["#0A2865", "#FFFFFF"], rating: 78, attack: 79, defense: 76, form: 80, pedigree: 60, titles: "4× WC R16" },
  { id: "col", name: "Colombia",     short: "COL", colors: ["#FCD116", "#003893"], rating: 81, attack: 82, defense: 78, form: 84, pedigree: 66, titles: "Copa finalist '24" },
  { id: "kor", name: "South Korea",  short: "KOR", colors: ["#CD2E3A", "#0047A0"], rating: 76, attack: 77, defense: 73, form: 76, pedigree: 62, titles: "WC 4th '02" },
  { id: "sui", name: "Switzerland",  short: "SUI", colors: ["#FF0000", "#FFFFFF"], rating: 77, attack: 75, defense: 79, form: 75, pedigree: 64, titles: "Consistent R16" },
];

const DATASETS = {
  premier: {
    id: "premier",
    label: "Premier League",
    tagline: "England's top flight — club vs club",
    icon: "🦁",
    homeAdvantage: 5.5,
    teams: PREMIER_LEAGUE,
  },
  world: {
    id: "world",
    label: "World Cup",
    tagline: "Nation vs nation on the biggest stage",
    icon: "🌍",
    homeAdvantage: 4.0,
    teams: WORLD_CUP,
  },
};
