import { PLAYER_BY_ID } from "./players";

export type Sticker = {
  id: string;
  name: string;
  team: string;
  count: number;
  owned: boolean;
};

const teams = [
  { code: "ARG", name: "Argentina" },
  { code: "AUS", name: "Australia" },
  { code: "AUT", name: "Austria" },
  { code: "BEL", name: "Belgium" },
  { code: "BIH", name: "Bosnia" },
  { code: "BRA", name: "Brazil" },
  { code: "CAN", name: "Canada" },
  { code: "CPV", name: "Cape Verde" },
  { code: "COL", name: "Colombia" },
  { code: "COD", name: "Congo DR" },
  { code: "CRO", name: "Croatia" },
  { code: "CUW", name: "Curacao" },
  { code: "CZE", name: "Czechia" },
  { code: "ECU", name: "Ecuador" },
  { code: "EGY", name: "Egypt" },
  { code: "ENG", name: "England" },
  { code: "FRA", name: "France" },
  { code: "GER", name: "Germany" },
  { code: "GHA", name: "Ghana" },
  { code: "HAI", name: "Haiti" },
  { code: "IRN", name: "Iran" },
  { code: "IRQ", name: "Iraq" },
  { code: "CIV", name: "Ivory Coast" },
  { code: "JPN", name: "Japan" },
  { code: "JOR", name: "Jordan" },
  { code: "ALG", name: "Algeria" },
  { code: "MEX", name: "Mexico" },
  { code: "MAR", name: "Morocco" },
  { code: "NED", name: "Netherlands" },
  { code: "NZL", name: "New Zealand" },
  { code: "NOR", name: "Norway" },
  { code: "PAN", name: "Panama" },
  { code: "PAR", name: "Paraguay" },
  { code: "POR", name: "Portugal" },
  { code: "QAT", name: "Qatar" },
  { code: "KSA", name: "Saudi Arabia" },
  { code: "SCO", name: "Scotland" },
  { code: "SEN", name: "Senegal" },
  { code: "RSA", name: "South Africa" },
  { code: "KOR", name: "South Korea" },
  { code: "ESP", name: "Spain" },
  { code: "SWE", name: "Sweden" },
  { code: "SUI", name: "Switzerland" },
  { code: "TUN", name: "Tunisia" },
  { code: "TUR", name: "Turkey" },
  { code: "URU", name: "Uruguay" },
  { code: "USA", name: "USA" },
  { code: "UZB", name: "Uzbekistan" },
];

const generateStickers = (): Sticker[] => {
  const result: Sticker[] = [];

  // ✅ PANINI LOGO
  result.push({
    id: "00",
    name: PLAYER_BY_ID["00"] || "Panini Logo",
    team: "Specials",
    count: 0,
    owned: false,
  });

  // ✅ FWC
  for (let i = 1; i <= 19; i++) {
    const id = `FWC${i}`;

    result.push({
      id,
      name: PLAYER_BY_ID[id] || id,
      team: "Specials",
      count: 0,
      owned: false,
    });
  }

  // ✅ TEAMS
  teams.forEach((team) => {
    for (let i = 1; i <= 20; i++) {
      const id = `${team.code}${i}`;

      result.push({
        id,
        name: PLAYER_BY_ID[id] || "",
        team: team.name,
        count: 0,
        owned: false,
      });
    }
  });

  return result;
};

export const stickers: Sticker[] = generateStickers();