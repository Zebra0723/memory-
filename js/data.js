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

const CHAMPIONS_LEAGUE = [
  { id: "rma", name: "Real Madrid",        short: "RMA", colors: ["#FEBE10", "#00529F"], rating: 93, attack: 93, defense: 88, form: 88, pedigree: 99, titles: "15× UCL" },
  { id: "mci", name: "Manchester City",    short: "MCI", colors: ["#6CABDD", "#1C2C5B"], rating: 92, attack: 94, defense: 88, form: 88, pedigree: 78, titles: "UCL 2023" },
  { id: "bay", name: "Bayern Munich",      short: "BAY", colors: ["#DC052D", "#FFFFFF"], rating: 90, attack: 91, defense: 85, form: 84, pedigree: 92, titles: "6× UCL" },
  { id: "liv", name: "Liverpool",          short: "LIV", colors: ["#C8102E", "#00B2A9"], rating: 88, attack: 89, defense: 83, form: 86, pedigree: 90, titles: "6× UCL" },
  { id: "psg", name: "Paris Saint-Germain",short: "PSG", colors: ["#004170", "#DA291C"], rating: 88, attack: 89, defense: 82, form: 84, pedigree: 66, titles: "Finalist '20" },
  { id: "bar", name: "Barcelona",          short: "BAR", colors: ["#A50044", "#004D98"], rating: 88, attack: 90, defense: 82, form: 85, pedigree: 92, titles: "5× UCL" },
  { id: "int", name: "Inter",              short: "INT", colors: ["#0068A8", "#000000"], rating: 87, attack: 86, defense: 86, form: 84, pedigree: 80, titles: "3× UCL" },
  { id: "ars", name: "Arsenal",            short: "ARS", colors: ["#EF0107", "#FFFFFF"], rating: 87, attack: 88, defense: 85, form: 88, pedigree: 66, titles: "Finalist '06" },
  { id: "b04", name: "Bayer Leverkusen",   short: "B04", colors: ["#E32219", "#000000"], rating: 86, attack: 87, defense: 83, form: 86, pedigree: 64, titles: "Finalist '02" },
  { id: "atm", name: "Atlético Madrid",    short: "ATM", colors: ["#CB3524", "#262E62"], rating: 85, attack: 83, defense: 86, form: 82, pedigree: 74, titles: "3× finalist" },
  { id: "bvb", name: "Borussia Dortmund",  short: "BVB", colors: ["#FDE100", "#000000"], rating: 83, attack: 84, defense: 78, form: 80, pedigree: 78, titles: "UCL 1997" },
  { id: "juv", name: "Juventus",           short: "JUV", colors: ["#000000", "#FFFFFF"], rating: 83, attack: 81, defense: 84, form: 80, pedigree: 86, titles: "2× UCL" },
  { id: "mil", name: "AC Milan",           short: "MIL", colors: ["#FB090B", "#000000"], rating: 83, attack: 83, defense: 80, form: 80, pedigree: 92, titles: "7× UCL" },
  { id: "ata", name: "Atalanta",           short: "ATA", colors: ["#1E71B8", "#000000"], rating: 81, attack: 84, defense: 76, form: 82, pedigree: 52, titles: "Europa '24" },
  { id: "nap", name: "Napoli",             short: "NAP", colors: ["#12A0D7", "#FFFFFF"], rating: 82, attack: 83, defense: 79, form: 81, pedigree: 58, titles: "QF '24" },
  { id: "rbl", name: "RB Leipzig",         short: "RBL", colors: ["#DD0741", "#FFFFFF"], rating: 82, attack: 84, defense: 79, form: 81, pedigree: 52, titles: "SF '20" },
  { id: "ben", name: "Benfica",            short: "BEN", colors: ["#E00913", "#FFFFFF"], rating: 80, attack: 81, defense: 77, form: 79, pedigree: 76, titles: "2× UCL" },
  { id: "prt", name: "Porto",              short: "POR", colors: ["#003DA5", "#FFFFFF"], rating: 79, attack: 79, defense: 78, form: 78, pedigree: 74, titles: "2× UCL" },
  { id: "psv", name: "PSV",                short: "PSV", colors: ["#ED1C24", "#FFFFFF"], rating: 78, attack: 81, defense: 74, form: 80, pedigree: 64, titles: "UCL 1988" },
  { id: "cel", name: "Celtic",             short: "CEL", colors: ["#018749", "#FFFFFF"], rating: 73, attack: 75, defense: 70, form: 74, pedigree: 66, titles: "UCL 1967" },
];

const EUROS = [
  { id: "fra", name: "France",       short: "FRA", colors: ["#002654", "#ED2939"], rating: 92, attack: 93, defense: 87, form: 88, pedigree: 88, titles: "2× Euro" },
  { id: "esp", name: "Spain",        short: "ESP", colors: ["#AA151B", "#F1BF00"], rating: 91, attack: 90, defense: 86, form: 91, pedigree: 90, titles: "4× Euro" },
  { id: "eng", name: "England",      short: "ENG", colors: ["#FFFFFF", "#CE1124"], rating: 89, attack: 88, defense: 86, form: 86, pedigree: 70, titles: "2× finalist" },
  { id: "por", name: "Portugal",     short: "POR", colors: ["#006600", "#FF0000"], rating: 88, attack: 89, defense: 83, form: 85, pedigree: 80, titles: "Euro 2016" },
  { id: "ger", name: "Germany",      short: "GER", colors: ["#000000", "#DD0000"], rating: 87, attack: 87, defense: 84, form: 84, pedigree: 90, titles: "3× Euro" },
  { id: "ita", name: "Italy",        short: "ITA", colors: ["#0066CC", "#FFFFFF"], rating: 85, attack: 83, defense: 87, form: 80, pedigree: 88, titles: "2× Euro" },
  { id: "ned", name: "Netherlands",  short: "NED", colors: ["#FF6600", "#FFFFFF"], rating: 85, attack: 86, defense: 82, form: 83, pedigree: 78, titles: "Euro 1988" },
  { id: "bel", name: "Belgium",      short: "BEL", colors: ["#E30613", "#FDDA24"], rating: 83, attack: 85, defense: 79, form: 78, pedigree: 64, titles: "SF 2016" },
  { id: "cro", name: "Croatia",      short: "CRO", colors: ["#FF0000", "#FFFFFF"], rating: 83, attack: 82, defense: 81, form: 80, pedigree: 72, titles: "WC finalist" },
  { id: "tur", name: "Türkiye",      short: "TUR", colors: ["#E30A17", "#FFFFFF"], rating: 79, attack: 80, defense: 76, form: 80, pedigree: 60, titles: "QF 2024" },
  { id: "sui", name: "Switzerland",  short: "SUI", colors: ["#FF0000", "#FFFFFF"], rating: 80, attack: 79, defense: 81, form: 81, pedigree: 64, titles: "QF 2024" },
  { id: "den", name: "Denmark",      short: "DEN", colors: ["#C60C30", "#FFFFFF"], rating: 80, attack: 79, defense: 80, form: 78, pedigree: 70, titles: "Euro 1992" },
  { id: "aut", name: "Austria",      short: "AUT", colors: ["#ED2939", "#FFFFFF"], rating: 79, attack: 80, defense: 78, form: 82, pedigree: 58, titles: "R16 2024" },
  { id: "ukr", name: "Ukraine",      short: "UKR", colors: ["#0057B7", "#FFD700"], rating: 76, attack: 76, defense: 75, form: 74, pedigree: 56, titles: "QF 2020" },
  { id: "pol", name: "Poland",       short: "POL", colors: ["#DC143C", "#FFFFFF"], rating: 75, attack: 77, defense: 72, form: 71, pedigree: 60, titles: "Regular" },
  { id: "srb", name: "Serbia",       short: "SRB", colors: ["#C6363C", "#0C4076"], rating: 76, attack: 78, defense: 73, form: 72, pedigree: 58, titles: "Regular" },
  { id: "sco", name: "Scotland",     short: "SCO", colors: ["#0065BF", "#FFFFFF"], rating: 73, attack: 72, defense: 73, form: 72, pedigree: 54, titles: "Regular" },
  { id: "cze", name: "Czechia",      short: "CZE", colors: ["#D7141A", "#11457E"], rating: 75, attack: 74, defense: 75, form: 73, pedigree: 66, titles: "Euro 1976" },
  { id: "rou", name: "Romania",      short: "ROU", colors: ["#FCD116", "#002B7F"], rating: 73, attack: 73, defense: 73, form: 76, pedigree: 56, titles: "R16 2024" },
  { id: "hun", name: "Hungary",      short: "HUN", colors: ["#436F4D", "#CD2A3E"], rating: 73, attack: 74, defense: 71, form: 72, pedigree: 62, titles: "3× finalist" },
];

const LA_LIGA = [
  { id: "rma", name: "Real Madrid",     short: "RMA", colors: ["#FEBE10", "#00529F"], rating: 93, attack: 93, defense: 88, form: 88, pedigree: 98, titles: "36× La Liga" },
  { id: "bar", name: "Barcelona",       short: "BAR", colors: ["#A50044", "#004D98"], rating: 89, attack: 91, defense: 82, form: 87, pedigree: 92, titles: "27× La Liga" },
  { id: "atm", name: "Atlético Madrid", short: "ATM", colors: ["#CB3524", "#262E62"], rating: 86, attack: 84, defense: 86, form: 83, pedigree: 78, titles: "11× La Liga" },
  { id: "ath", name: "Athletic Bilbao", short: "ATH", colors: ["#EE2523", "#FFFFFF"], rating: 80, attack: 80, defense: 79, form: 81, pedigree: 68, titles: "8× La Liga" },
  { id: "gir", name: "Girona",          short: "GIR", colors: ["#CD2534", "#FFFFFF"], rating: 79, attack: 82, defense: 74, form: 79, pedigree: 44, titles: "UCL debut '24" },
  { id: "rso", name: "Real Sociedad",   short: "RSO", colors: ["#0067B1", "#FFFFFF"], rating: 78, attack: 78, defense: 77, form: 76, pedigree: 62, titles: "2× La Liga" },
  { id: "bet", name: "Real Betis",      short: "BET", colors: ["#00954C", "#FFFFFF"], rating: 76, attack: 77, defense: 74, form: 76, pedigree: 56, titles: "1× La Liga" },
  { id: "vil", name: "Villarreal",      short: "VIL", colors: ["#FFE667", "#005187"], rating: 77, attack: 79, defense: 73, form: 76, pedigree: 58, titles: "Europa '21" },
  { id: "val", name: "Valencia",        short: "VAL", colors: ["#FF7F00", "#000000"], rating: 74, attack: 73, defense: 74, form: 72, pedigree: 66, titles: "6× La Liga" },
  { id: "sev", name: "Sevilla",         short: "SEV", colors: ["#D9111B", "#FFFFFF"], rating: 74, attack: 74, defense: 73, form: 70, pedigree: 62, titles: "7× Europa" },
  { id: "osa", name: "Osasuna",         short: "OSA", colors: ["#0A346F", "#D91A21"], rating: 72, attack: 71, defense: 72, form: 72, pedigree: 50, titles: "Est. 1920" },
  { id: "get", name: "Getafe",          short: "GET", colors: ["#005999", "#FFFFFF"], rating: 71, attack: 68, defense: 74, form: 70, pedigree: 46, titles: "Est. 1983" },
  { id: "cel", name: "Celta Vigo",      short: "CEL", colors: ["#8AC3EE", "#E4022E"], rating: 71, attack: 73, defense: 68, form: 72, pedigree: 50, titles: "Est. 1923" },
  { id: "ray", name: "Rayo Vallecano",  short: "RAY", colors: ["#FFFFFF", "#E53027"], rating: 70, attack: 69, defense: 71, form: 71, pedigree: 44, titles: "Est. 1924" },
  { id: "mlg", name: "Mallorca",        short: "MLL", colors: ["#E20613", "#000000"], rating: 70, attack: 68, defense: 72, form: 70, pedigree: 46, titles: "Est. 1916" },
  { id: "ala", name: "Alavés",          short: "ALA", colors: ["#0761AF", "#FFFFFF"], rating: 69, attack: 68, defense: 70, form: 69, pedigree: 44, titles: "Est. 1921" },
  { id: "lpa", name: "Las Palmas",      short: "LPA", colors: ["#FEDD00", "#0055A5"], rating: 68, attack: 69, defense: 66, form: 66, pedigree: 46, titles: "Est. 1949" },
  { id: "esp", name: "Espanyol",        short: "ESP", colors: ["#0072CE", "#FFFFFF"], rating: 68, attack: 68, defense: 68, form: 68, pedigree: 50, titles: "Est. 1900" },
];

const BUNDESLIGA = [
  { id: "bay", name: "Bayern Munich",     short: "BAY", colors: ["#DC052D", "#FFFFFF"], rating: 90, attack: 92, defense: 85, form: 86, pedigree: 96, titles: "33× Bundesliga" },
  { id: "b04", name: "Bayer Leverkusen",  short: "B04", colors: ["#E32219", "#000000"], rating: 87, attack: 88, defense: 84, form: 86, pedigree: 58, titles: "Champions '24" },
  { id: "rbl", name: "RB Leipzig",        short: "RBL", colors: ["#DD0741", "#001F47"], rating: 83, attack: 85, defense: 80, form: 82, pedigree: 50, titles: "Runners-up" },
  { id: "bvb", name: "Borussia Dortmund", short: "BVB", colors: ["#FDE100", "#000000"], rating: 83, attack: 84, defense: 78, form: 79, pedigree: 80, titles: "8× Bundesliga" },
  { id: "vfb", name: "Stuttgart",         short: "VFB", colors: ["#FFFFFF", "#E32219"], rating: 80, attack: 83, defense: 76, form: 80, pedigree: 60, titles: "5× champions" },
  { id: "sge", name: "Eintracht Frankfurt",short: "SGE", colors: ["#E1000F", "#000000"], rating: 78, attack: 80, defense: 74, form: 78, pedigree: 58, titles: "Europa '22" },
  { id: "scf", name: "Freiburg",          short: "SCF", colors: ["#000000", "#E1000F"], rating: 75, attack: 74, defense: 76, form: 74, pedigree: 48, titles: "Est. 1904" },
  { id: "wob", name: "Wolfsburg",         short: "WOB", colors: ["#65B32E", "#FFFFFF"], rating: 73, attack: 73, defense: 72, form: 71, pedigree: 54, titles: "1× champions" },
  { id: "tsg", name: "Hoffenheim",        short: "TSG", colors: ["#1961B5", "#FFFFFF"], rating: 72, attack: 74, defense: 69, form: 70, pedigree: 44, titles: "Est. 1899" },
  { id: "m05", name: "Mainz 05",          short: "M05", colors: ["#C3141E", "#FFFFFF"], rating: 71, attack: 70, defense: 72, form: 72, pedigree: 46, titles: "Est. 1905" },
  { id: "fcu", name: "Union Berlin",      short: "FCU", colors: ["#EB1923", "#FFED00"], rating: 71, attack: 69, defense: 73, form: 69, pedigree: 44, titles: "Est. 1966" },
  { id: "svw", name: "Werder Bremen",     short: "SVW", colors: ["#1D9053", "#FFFFFF"], rating: 72, attack: 73, defense: 70, form: 71, pedigree: 66, titles: "4× champions" },
  { id: "bmg", name: "Gladbach",          short: "BMG", colors: ["#000000", "#00A650"], rating: 71, attack: 72, defense: 69, form: 70, pedigree: 62, titles: "5× champions" },
  { id: "fca", name: "Augsburg",          short: "FCA", colors: ["#BA3733", "#46714D"], rating: 70, attack: 69, defense: 71, form: 70, pedigree: 42, titles: "Est. 1907" },
  { id: "svp", name: "St. Pauli",         short: "STP", colors: ["#61391B", "#FFFFFF"], rating: 68, attack: 66, defense: 70, form: 69, pedigree: 40, titles: "Est. 1910" },
  { id: "boc", name: "Bochum",            short: "BOC", colors: ["#005CA9", "#FFFFFF"], rating: 66, attack: 65, defense: 66, form: 64, pedigree: 44, titles: "Est. 1848" },
];

const SERIE_A = [
  { id: "int", name: "Inter",       short: "INT", colors: ["#0068A8", "#000000"], rating: 88, attack: 88, defense: 86, form: 86, pedigree: 84, titles: "20× Scudetti" },
  { id: "juv", name: "Juventus",    short: "JUV", colors: ["#000000", "#FFFFFF"], rating: 84, attack: 82, defense: 85, form: 82, pedigree: 92, titles: "36× Scudetti" },
  { id: "mil", name: "AC Milan",    short: "MIL", colors: ["#FB090B", "#000000"], rating: 83, attack: 84, defense: 80, form: 80, pedigree: 88, titles: "19× Scudetti" },
  { id: "nap", name: "Napoli",      short: "NAP", colors: ["#12A0D7", "#FFFFFF"], rating: 83, attack: 84, defense: 80, form: 83, pedigree: 62, titles: "3× Scudetti" },
  { id: "ata", name: "Atalanta",    short: "ATA", colors: ["#1E71B8", "#000000"], rating: 82, attack: 85, defense: 77, form: 83, pedigree: 52, titles: "Europa '24" },
  { id: "rom", name: "Roma",        short: "ROM", colors: ["#8E1F2F", "#F0BC42"], rating: 79, attack: 80, defense: 77, form: 76, pedigree: 66, titles: "3× Scudetti" },
  { id: "laz", name: "Lazio",       short: "LAZ", colors: ["#87D8F7", "#FFFFFF"], rating: 78, attack: 78, defense: 77, form: 76, pedigree: 62, titles: "2× Scudetti" },
  { id: "fio", name: "Fiorentina",  short: "FIO", colors: ["#59168B", "#FFFFFF"], rating: 77, attack: 78, defense: 75, form: 77, pedigree: 58, titles: "2× Scudetti" },
  { id: "bol", name: "Bologna",     short: "BOL", colors: ["#1A2F48", "#A81E22"], rating: 77, attack: 76, defense: 77, form: 78, pedigree: 56, titles: "7× Scudetti" },
  { id: "tor", name: "Torino",      short: "TOR", colors: ["#881600", "#FFFFFF"], rating: 73, attack: 71, defense: 75, form: 72, pedigree: 62, titles: "7× Scudetti" },
  { id: "udi", name: "Udinese",     short: "UDI", colors: ["#000000", "#FFFFFF"], rating: 71, attack: 70, defense: 72, form: 70, pedigree: 48, titles: "Est. 1896" },
  { id: "gen", name: "Genoa",       short: "GEN", colors: ["#B01E23", "#003B7F"], rating: 70, attack: 69, defense: 71, form: 70, pedigree: 56, titles: "9× Scudetti" },
  { id: "mon", name: "Monza",       short: "MON", colors: ["#E20613", "#FFFFFF"], rating: 69, attack: 68, defense: 70, form: 68, pedigree: 40, titles: "Est. 1912" },
  { id: "cag", name: "Cagliari",    short: "CAG", colors: ["#BE1E2D", "#00295B"], rating: 68, attack: 67, defense: 69, form: 68, pedigree: 46, titles: "1× Scudetto" },
  { id: "emp", name: "Empoli",      short: "EMP", colors: ["#00579C", "#FFFFFF"], rating: 67, attack: 65, defense: 69, form: 67, pedigree: 40, titles: "Est. 1920" },
  { id: "lec", name: "Lecce",       short: "LEC", colors: ["#F8E100", "#E2001A"], rating: 66, attack: 65, defense: 67, form: 66, pedigree: 40, titles: "Est. 1908" },
  { id: "ver", name: "Verona",      short: "VER", colors: ["#FCE500", "#003C7D"], rating: 66, attack: 66, defense: 66, form: 65, pedigree: 44, titles: "1× Scudetto" },
  { id: "par", name: "Parma",       short: "PAR", colors: ["#FFD200", "#003399"], rating: 68, attack: 69, defense: 66, form: 70, pedigree: 50, titles: "UEFA Cups" },
];

const LIGUE_1 = [
  { id: "psg", name: "Paris Saint-Germain", short: "PSG", colors: ["#004170", "#DA291C"], rating: 89, attack: 90, defense: 83, form: 86, pedigree: 78, titles: "12× Ligue 1" },
  { id: "asm", name: "Monaco",              short: "ASM", colors: ["#E51B22", "#FFFFFF"], rating: 80, attack: 82, defense: 76, form: 80, pedigree: 66, titles: "8× Ligue 1" },
  { id: "mar", name: "Marseille",           short: "OM",  colors: ["#2FAEE0", "#FFFFFF"], rating: 79, attack: 80, defense: 76, form: 78, pedigree: 70, titles: "9× Ligue 1" },
  { id: "lil", name: "Lille",               short: "LIL", colors: ["#E01E13", "#FFFFFF"], rating: 78, attack: 78, defense: 77, form: 78, pedigree: 58, titles: "4× Ligue 1" },
  { id: "nic", name: "Nice",                short: "NCE", colors: ["#000000", "#E1000F"], rating: 76, attack: 74, defense: 78, form: 76, pedigree: 56, titles: "4× Ligue 1" },
  { id: "lyo", name: "Lyon",                short: "OL",  colors: ["#FFFFFF", "#DA001A"], rating: 76, attack: 77, defense: 73, form: 74, pedigree: 72, titles: "7× Ligue 1" },
  { id: "len", name: "Lens",                short: "RCL", colors: ["#FFED00", "#E20613"], rating: 76, attack: 76, defense: 75, form: 74, pedigree: 52, titles: "1× Ligue 1" },
  { id: "ren", name: "Rennes",              short: "REN", colors: ["#E23328", "#000000"], rating: 75, attack: 77, defense: 72, form: 74, pedigree: 52, titles: "Est. 1901" },
  { id: "rei", name: "Reims",               short: "SDR", colors: ["#E1001A", "#FFFFFF"], rating: 72, attack: 71, defense: 73, form: 72, pedigree: 56, titles: "6× Ligue 1" },
  { id: "stg", name: "Strasbourg",          short: "RCS", colors: ["#009FE3", "#FFFFFF"], rating: 71, attack: 71, defense: 71, form: 72, pedigree: 48, titles: "1× Ligue 1" },
  { id: "fcn", name: "Nantes",              short: "FCN", colors: ["#FCD405", "#009540"], rating: 70, attack: 69, defense: 71, form: 69, pedigree: 60, titles: "8× Ligue 1" },
  { id: "sb2", name: "Brest",               short: "SB29",colors: ["#E30613", "#FFFFFF"], rating: 73, attack: 73, defense: 73, form: 75, pedigree: 40, titles: "UCL debut '24" },
  { id: "tfc", name: "Toulouse",            short: "TFC", colors: ["#7B2482", "#FFFFFF"], rating: 71, attack: 70, defense: 72, form: 71, pedigree: 44, titles: "Coupe '23" },
  { id: "mtp", name: "Montpellier",         short: "MHSC",colors: ["#F7911E", "#0055A4"], rating: 68, attack: 68, defense: 67, form: 66, pedigree: 46, titles: "1× Ligue 1" },
  { id: "hac", name: "Le Havre",            short: "HAC", colors: ["#00A2E1", "#0A0A0A"], rating: 66, attack: 64, defense: 68, form: 66, pedigree: 42, titles: "Est. 1872" },
  { id: "aja", name: "Auxerre",             short: "AJA", colors: ["#0069B4", "#FFFFFF"], rating: 67, attack: 67, defense: 67, form: 68, pedigree: 48, titles: "1× Ligue 1" },
];

const EREDIVISIE = [
  { id: "psv", name: "PSV",              short: "PSV", colors: ["#ED1C24", "#FFFFFF"], rating: 82, attack: 85, defense: 78, form: 84, pedigree: 82, titles: "25× Eredivisie" },
  { id: "fey", name: "Feyenoord",        short: "FEY", colors: ["#E30613", "#000000"], rating: 80, attack: 82, defense: 77, form: 80, pedigree: 78, titles: "16× Eredivisie" },
  { id: "aja", name: "Ajax",             short: "AJA", colors: ["#D2122E", "#FFFFFF"], rating: 78, attack: 80, defense: 74, form: 74, pedigree: 92, titles: "36× Eredivisie" },
  { id: "az",  name: "AZ Alkmaar",       short: "AZ",  colors: ["#E30613", "#FFFFFF"], rating: 76, attack: 78, defense: 73, form: 77, pedigree: 58, titles: "2× Eredivisie" },
  { id: "twe", name: "Twente",           short: "TWE", colors: ["#E30613", "#FFFFFF"], rating: 74, attack: 74, defense: 73, form: 75, pedigree: 52, titles: "1× Eredivisie" },
  { id: "utr", name: "Utrecht",          short: "UTR", colors: ["#E30613", "#FFFFFF"], rating: 71, attack: 71, defense: 71, form: 72, pedigree: 48, titles: "Est. 1970" },
  { id: "spa", name: "Sparta Rotterdam", short: "SPA", colors: ["#E30613", "#FFFFFF"], rating: 67, attack: 66, defense: 68, form: 67, pedigree: 50, titles: "6× Eredivisie" },
  { id: "hee", name: "Heerenveen",       short: "HEE", colors: ["#005EB8", "#FFFFFF"], rating: 68, attack: 69, defense: 66, form: 68, pedigree: 46, titles: "Est. 1920" },
  { id: "nec", name: "NEC Nijmegen",     short: "NEC", colors: ["#E30613", "#008D36"], rating: 68, attack: 68, defense: 68, form: 68, pedigree: 44, titles: "Est. 1900" },
  { id: "gae", name: "Go Ahead Eagles",  short: "GAE", colors: ["#E30613", "#FFD700"], rating: 66, attack: 66, defense: 66, form: 67, pedigree: 46, titles: "Est. 1902" },
];

const PRIMEIRA = [
  { id: "scp", name: "Sporting CP",     short: "SCP", colors: ["#008057", "#FFFFFF"], rating: 84, attack: 86, defense: 81, form: 86, pedigree: 78, titles: "20× Primeira" },
  { id: "ben", name: "Benfica",         short: "BEN", colors: ["#E00913", "#FFFFFF"], rating: 83, attack: 84, defense: 80, form: 82, pedigree: 84, titles: "38× Primeira" },
  { id: "prt", name: "Porto",           short: "POR", colors: ["#003DA5", "#FFFFFF"], rating: 82, attack: 82, defense: 80, form: 80, pedigree: 84, titles: "30× Primeira" },
  { id: "brg", name: "Braga",           short: "SCB", colors: ["#E30613", "#FFFFFF"], rating: 77, attack: 78, defense: 75, form: 77, pedigree: 56, titles: "Regular top-4" },
  { id: "vsc", name: "Vitória SC",      short: "VSC", colors: ["#FFFFFF", "#000000"], rating: 72, attack: 72, defense: 71, form: 72, pedigree: 50, titles: "Est. 1922" },
  { id: "mor", name: "Moreirense",      short: "MOR", colors: ["#00A650", "#FFFFFF"], rating: 68, attack: 67, defense: 69, form: 69, pedigree: 40, titles: "Est. 1938" },
  { id: "fam", name: "Famalicão",       short: "FAM", colors: ["#00337F", "#FFFFFF"], rating: 68, attack: 68, defense: 68, form: 68, pedigree: 40, titles: "Est. 1931" },
  { id: "est", name: "Estoril",         short: "EST", colors: ["#FCD116", "#005BAA"], rating: 67, attack: 67, defense: 66, form: 67, pedigree: 42, titles: "Est. 1939" },
  { id: "gil", name: "Gil Vicente",     short: "GIL", colors: ["#E30613", "#009540"], rating: 67, attack: 66, defense: 67, form: 67, pedigree: 40, titles: "Est. 1924" },
  { id: "rio", name: "Rio Ave",         short: "RIO", colors: ["#008542", "#E30613"], rating: 66, attack: 65, defense: 66, form: 66, pedigree: 40, titles: "Est. 1939" },
];

const CHAMPIONSHIP = [
  { id: "lee", name: "Leeds United",     short: "LEE", colors: ["#FFFFFF", "#1D428A"], rating: 76, attack: 79, defense: 72, form: 78, pedigree: 66, titles: "3× English top-flight" },
  { id: "bur", name: "Burnley",          short: "BUR", colors: ["#6C1D45", "#99D6EA"], rating: 74, attack: 73, defense: 76, form: 74, pedigree: 58, titles: "2× top-flight" },
  { id: "lei", name: "Leicester City",   short: "LEI", colors: ["#003090", "#FDBE11"], rating: 75, attack: 77, defense: 72, form: 74, pedigree: 62, titles: "PL 2016" },
  { id: "ips", name: "Ipswich Town",     short: "IPS", colors: ["#3A64A3", "#FFFFFF"], rating: 72, attack: 74, defense: 70, form: 76, pedigree: 54, titles: "1× top-flight" },
  { id: "sou", name: "Southampton",      short: "SOU", colors: ["#D71920", "#FFFFFF"], rating: 73, attack: 74, defense: 71, form: 72, pedigree: 52, titles: "Est. 1885" },
  { id: "wba", name: "West Brom",        short: "WBA", colors: ["#122F67", "#FFFFFF"], rating: 71, attack: 70, defense: 72, form: 71, pedigree: 54, titles: "1× top-flight" },
  { id: "nor", name: "Norwich City",     short: "NOR", colors: ["#00A650", "#FFF200"], rating: 70, attack: 72, defense: 68, form: 70, pedigree: 48, titles: "Est. 1902" },
  { id: "hul", name: "Hull City",        short: "HUL", colors: ["#F18A01", "#000000"], rating: 68, attack: 68, defense: 68, form: 68, pedigree: 44, titles: "Est. 1904" },
  { id: "mid", name: "Middlesbrough",    short: "MID", colors: ["#E21C38", "#FFFFFF"], rating: 71, attack: 72, defense: 70, form: 71, pedigree: 52, titles: "League Cup '04" },
  { id: "cov", name: "Coventry City",    short: "COV", colors: ["#78D0F1", "#FFFFFF"], rating: 70, attack: 71, defense: 69, form: 71, pedigree: 48, titles: "FA Cup '87" },
  { id: "sun", name: "Sunderland",       short: "SUN", colors: ["#EB172B", "#FFFFFF"], rating: 71, attack: 72, defense: 70, form: 72, pedigree: 56, titles: "6× top-flight" },
  { id: "wat", name: "Watford",          short: "WAT", colors: ["#FBEE23", "#ED2127"], rating: 69, attack: 70, defense: 68, form: 68, pedigree: 46, titles: "Est. 1881" },
  { id: "brc", name: "Bristol City",     short: "BRC", colors: ["#E21C38", "#FFFFFF"], rating: 68, attack: 68, defense: 68, form: 69, pedigree: 44, titles: "Est. 1894" },
  { id: "mil", name: "Millwall",         short: "MIL", colors: ["#001D5B", "#FFFFFF"], rating: 67, attack: 66, defense: 68, form: 67, pedigree: 42, titles: "Est. 1885" },
  { id: "pne", name: "Preston",          short: "PNE", colors: ["#B2B2B2", "#001C58"], rating: 67, attack: 66, defense: 68, form: 66, pedigree: 50, titles: "2× top-flight" },
  { id: "shw", name: "Sheffield Wed",    short: "SHW", colors: ["#004488", "#FFFFFF"], rating: 66, attack: 65, defense: 67, form: 66, pedigree: 52, titles: "4× top-flight" },
];

const LIBERTADORES = [
  { id: "fla", name: "Flamengo",          short: "FLA", colors: ["#E30613", "#000000"], rating: 85, attack: 86, defense: 82, form: 84, pedigree: 82, titles: "3× Libertadores" },
  { id: "pal", name: "Palmeiras",         short: "PAL", colors: ["#006437", "#FFFFFF"], rating: 85, attack: 85, defense: 83, form: 85, pedigree: 84, titles: "3× Libertadores" },
  { id: "riv", name: "River Plate",       short: "RIV", colors: ["#FFFFFF", "#E30613"], rating: 84, attack: 85, defense: 81, form: 83, pedigree: 88, titles: "4× Libertadores" },
  { id: "boc", name: "Boca Juniors",      short: "BOC", colors: ["#0A3B7C", "#F2C200"], rating: 82, attack: 82, defense: 81, form: 80, pedigree: 92, titles: "6× Libertadores" },
  { id: "flu", name: "Fluminense",        short: "FLU", colors: ["#7A1F3D", "#00613C"], rating: 81, attack: 82, defense: 79, form: 79, pedigree: 66, titles: "Champions '23" },
  { id: "cam", name: "Atlético Mineiro",  short: "CAM", colors: ["#000000", "#FFFFFF"], rating: 82, attack: 83, defense: 80, form: 82, pedigree: 68, titles: "1× Libertadores" },
  { id: "bot", name: "Botafogo",          short: "BOT", colors: ["#000000", "#FFFFFF"], rating: 82, attack: 84, defense: 79, form: 84, pedigree: 60, titles: "Champions '24" },
  { id: "gre", name: "Grêmio",            short: "GRE", colors: ["#0D80BF", "#000000"], rating: 79, attack: 79, defense: 78, form: 77, pedigree: 78, titles: "3× Libertadores" },
  { id: "int", name: "Internacional",     short: "INT", colors: ["#E30613", "#FFFFFF"], rating: 79, attack: 79, defense: 79, form: 78, pedigree: 74, titles: "2× Libertadores" },
  { id: "pen", name: "Peñarol",           short: "PEN", colors: ["#FCD116", "#000000"], rating: 78, attack: 78, defense: 77, form: 78, pedigree: 86, titles: "5× Libertadores" },
  { id: "nac", name: "Nacional",          short: "NAC", colors: ["#FFFFFF", "#003DA5"], rating: 76, attack: 76, defense: 76, form: 76, pedigree: 78, titles: "3× Libertadores" },
  { id: "col", name: "Colo-Colo",         short: "COL", colors: ["#FFFFFF", "#000000"], rating: 77, attack: 77, defense: 76, form: 78, pedigree: 74, titles: "1× Libertadores" },
  { id: "spa", name: "São Paulo",         short: "SAO", colors: ["#E30613", "#000000"], rating: 79, attack: 79, defense: 79, form: 78, pedigree: 80, titles: "3× Libertadores" },
  { id: "est", name: "Estudiantes",       short: "EDLP",colors: ["#E30613", "#FFFFFF"], rating: 76, attack: 76, defense: 76, form: 75, pedigree: 76, titles: "4× Libertadores" },
];

const BRASILEIRAO = [
  { id: "fla", name: "Flamengo",          short: "FLA", colors: ["#E30613", "#000000"], rating: 85, attack: 86, defense: 82, form: 84, pedigree: 82, titles: "8× Brasileirão" },
  { id: "pal", name: "Palmeiras",         short: "PAL", colors: ["#006437", "#FFFFFF"], rating: 85, attack: 85, defense: 83, form: 85, pedigree: 88, titles: "12× Brasileirão" },
  { id: "bot", name: "Botafogo",          short: "BOT", colors: ["#000000", "#FFFFFF"], rating: 82, attack: 84, defense: 79, form: 84, pedigree: 62, titles: "Champions '24" },
  { id: "flu", name: "Fluminense",        short: "FLU", colors: ["#7A1F3D", "#00613C"], rating: 79, attack: 80, defense: 77, form: 77, pedigree: 66, titles: "4× Brasileirão" },
  { id: "cam", name: "Atlético Mineiro",  short: "CAM", colors: ["#000000", "#FFFFFF"], rating: 81, attack: 82, defense: 79, form: 81, pedigree: 66, titles: "2× Brasileirão" },
  { id: "gre", name: "Grêmio",            short: "GRE", colors: ["#0D80BF", "#000000"], rating: 78, attack: 78, defense: 77, form: 76, pedigree: 72, titles: "2× Brasileirão" },
  { id: "int", name: "Internacional",     short: "INT", colors: ["#E30613", "#FFFFFF"], rating: 79, attack: 79, defense: 79, form: 79, pedigree: 70, titles: "3× Brasileirão" },
  { id: "spa", name: "São Paulo",         short: "SAO", colors: ["#E30613", "#000000"], rating: 80, attack: 80, defense: 79, form: 79, pedigree: 78, titles: "6× Brasileirão" },
  { id: "cor", name: "Corinthians",       short: "COR", colors: ["#000000", "#FFFFFF"], rating: 77, attack: 77, defense: 76, form: 76, pedigree: 76, titles: "7× Brasileirão" },
  { id: "for", name: "Fortaleza",         short: "FOR", colors: ["#005BAA", "#E30613"], rating: 78, attack: 79, defense: 77, form: 80, pedigree: 48, titles: "Rising force" },
  { id: "cru", name: "Cruzeiro",          short: "CRU", colors: ["#003DA5", "#FFFFFF"], rating: 77, attack: 77, defense: 76, form: 77, pedigree: 70, titles: "4× Brasileirão" },
  { id: "bah", name: "Bahia",             short: "BAH", colors: ["#005BAA", "#E30613"], rating: 75, attack: 75, defense: 74, form: 76, pedigree: 56, titles: "2× Brasileirão" },
  { id: "vas", name: "Vasco da Gama",     short: "VAS", colors: ["#000000", "#FFFFFF"], rating: 73, attack: 73, defense: 72, form: 72, pedigree: 64, titles: "4× Brasileirão" },
  { id: "cap", name: "Athletico-PR",      short: "CAP", colors: ["#E30613", "#000000"], rating: 75, attack: 75, defense: 75, form: 74, pedigree: 56, titles: "1× Brasileirão" },
];

const DATASETS = {
  world:        { id: "world",        label: "World Cup",             tagline: "Nation vs nation on the biggest stage", kind: "nation", homeAdvantage: 4.0, teams: WORLD_CUP },
  euros:        { id: "euros",        label: "European Championship", tagline: "Europe's finest national teams",         kind: "nation", homeAdvantage: 4.0, teams: EUROS },
  champions:    { id: "champions",    label: "Champions League",      tagline: "Europe's elite clubs collide",           kind: "club",   homeAdvantage: 4.5, teams: CHAMPIONS_LEAGUE },
  premier:      { id: "premier",      label: "Premier League",        tagline: "England's top flight — club vs club",    kind: "club",   homeAdvantage: 5.5, teams: PREMIER_LEAGUE },
  laliga:       { id: "laliga",       label: "La Liga",               tagline: "Spain's finest go head to head",         kind: "club",   homeAdvantage: 5.2, teams: LA_LIGA },
  bundesliga:   { id: "bundesliga",   label: "Bundesliga",            tagline: "Germany's top division",                 kind: "club",   homeAdvantage: 5.2, teams: BUNDESLIGA },
  seriea:       { id: "seriea",       label: "Serie A",               tagline: "Italian football's tactical stage",      kind: "club",   homeAdvantage: 5.2, teams: SERIE_A },
  ligue1:       { id: "ligue1",       label: "Ligue 1",               tagline: "France's premier competition",           kind: "club",   homeAdvantage: 5.2, teams: LIGUE_1 },
  primeira:     { id: "primeira",     label: "Primeira Liga",         tagline: "Portugal's big three and beyond",        kind: "club",   homeAdvantage: 5.2, teams: PRIMEIRA },
  eredivisie:   { id: "eredivisie",   label: "Eredivisie",            tagline: "Dutch total football",                   kind: "club",   homeAdvantage: 5.2, teams: EREDIVISIE },
  championship: { id: "championship", label: "Championship",          tagline: "England's second-tier scrap",            kind: "club",   homeAdvantage: 5.5, teams: CHAMPIONSHIP },
  libertadores: { id: "libertadores", label: "Copa Libertadores",     tagline: "South America's continental crown",      kind: "club",   homeAdvantage: 6.5, teams: LIBERTADORES },
  brasileirao:  { id: "brasileirao",  label: "Brasileirão",           tagline: "Brazil's Série A",                       kind: "club",   homeAdvantage: 5.5, teams: BRASILEIRAO },
};
