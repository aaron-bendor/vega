/**
 * Temporary developer profile data until wired to the data model.
 * Replace with DB or loadDemoDevelopers() when schema supports full profile.
 */

export interface DeveloperProfileAlgo {
  name: string;
  liveFor: string;
  ytd: string;
}

export interface DeveloperProfile {
  slug: string;
  name: string;
  verified: boolean;
  joined: string;
  role: string;
  stats: {
    liveAlgorithms: number;
    totalCapitalManaged: string;
    averageReturn: string;
  };
  about: string;
  topPerformers: DeveloperProfileAlgo[];
  newByDeveloper: DeveloperProfileAlgo[];
}

const DEMO_DEVELOPER: DeveloperProfile = {
  slug: "acar-gok",
  name: "Acar Gök",
  verified: true,
  joined: "Dec 14 2024",
  role:
    "Former hedge fund quant research intern, Imperial College London student, and co-founder of Vega Financial",
  stats: {
    liveAlgorithms: 12,
    totalCapitalManaged: "£34,542.95",
    averageReturn: "36%",
  },
  about:
    "Hi! I'm a former hedge fund quant research intern, Imperial College London student, and one of the co-founders of Vega Financial. My algorithms mostly focus on long/short statistical arbitrage strategies trading equities and foreign exchange.",
  topPerformers: [
    { name: "Momentum Breakout Engine ($MBE)", liveFor: "9m 4d", ytd: "+92%" },
    { name: "Adaptive Trend Tracker ($ATT)", liveFor: "8m 12d", ytd: "+104%" },
    { name: "Volatility Regime Switch ($VRS)", liveFor: "7m 2d", ytd: "+68%" },
  ],
  newByDeveloper: [
    { name: "StatArb Pair Trader ($SAPT)", liveFor: "13d", ytd: "+8%" },
    { name: "Event Drift Model ($EDM)", liveFor: "26d", ytd: "-2%" },
  ],
};

const BY_SLUG: Record<string, DeveloperProfile> = {
  "acar-gok": DEMO_DEVELOPER,
};

export function getDeveloperProfileBySlug(slug: string): DeveloperProfile | null {
  return BY_SLUG[slug] ?? null;
}

/** Slug for the default demo developer (e.g. for algorithm detail page link). */
export const DEFAULT_DEMO_DEVELOPER_SLUG = "acar-gok";
