/**
 * Temporary developer profile data until wired to the data model.
 * Placeholder fictional developer personas matched to the 6 live demo strategies.
 * Replace with DB or loadDemoDevelopers() when schema supports full profile.
 */

export interface DeveloperProfileStats {
  liveAlgorithms: string;
  totalCapitalManaged: string;
  averageReturn: string;
}

export interface PublishedStrategy {
  name: string;
  return: string;
}

export interface DeveloperProfile {
  slug: string;
  algorithmId: string;
  algorithmName: string;
  developerName: string;
  verified: boolean;
  joined: string;
  role: string;
  educationBadge: string;
  publishedCountLabel: string;
  stats: DeveloperProfileStats;
  about: string;
  tags: string[];
  publishedStrategies: PublishedStrategy[];
}

export const developerProfiles: DeveloperProfile[] = [
  {
    slug: "acar-gok",
    algorithmId: "demo-1",
    algorithmName: "Alpha Momentum Pro",
    developerName: "Acar Gök",
    verified: true,
    joined: "14 Dec 2024",
    role: "Imperial College London student, aspiring quant researcher, and co-founder of Vega Financial.",
    educationBadge: "Imperial College London",
    publishedCountLabel: "1 strategy published",
    stats: {
      liveAlgorithms: "1",
      totalCapitalManaged: "£34,542.95",
      averageReturn: "+55.06%",
    },
    about:
      "Hi, I'm Acar. I build systematic equity strategies with a focus on momentum, regime awareness, and disciplined risk sizing. I am particularly interested in how adaptive signals can stay with market leaders while avoiding overfitting to one fixed lookback.",
    tags: [
      "Equity momentum",
      "Adaptive lookbacks",
      "Trend following",
      "Python / pandas",
      "Backtesting",
    ],
    publishedStrategies: [
      { name: "Alpha Momentum Pro", return: "+55.06%" },
    ],
  },
  {
    slug: "ibrahim-rahman",
    algorithmId: "demo-2",
    algorithmName: "Trend Tracker",
    developerName: "Ibrahim Rahman",
    verified: true,
    joined: "09 Jan 2025",
    role: "MSc Mathematical Finance student at the University of Warwick, building rules-based trend systems for public markets.",
    educationBadge: "University of Warwick",
    publishedCountLabel: "1 strategy published",
    stats: {
      liveAlgorithms: "1",
      totalCapitalManaged: "£27,180.00",
      averageReturn: "+157.49%",
    },
    about:
      "I focus on simple, transparent trend-following systems that are easy to monitor and explain. My work centres on signal stability, regime filtering, and making directional strategies robust enough for real portfolio use.",
    tags: [
      "Trend following",
      "Equities",
      "Regime filters",
      "Python / pandas",
      "Risk sizing",
    ],
    publishedStrategies: [
      { name: "Trend Tracker", return: "+157.49%" },
    ],
  },
  {
    slug: "sofia-patel",
    algorithmId: "demo-3",
    algorithmName: "Bollinger Reversion",
    developerName: "Sofia Patel",
    verified: true,
    joined: "21 Jan 2025",
    role: "MSc Financial Mathematics student at UCL, researching mean-reversion signals and tactical equity dislocations.",
    educationBadge: "UCL",
    publishedCountLabel: "1 strategy published",
    stats: {
      liveAlgorithms: "1",
      totalCapitalManaged: "£24,860.00",
      averageReturn: "+134.81%",
    },
    about:
      "My research focuses on mean-reversion and the way short-term price extremes can normalise when markets settle. I am interested in building systematic strategies that complement momentum by behaving differently across market regimes.",
    tags: [
      "Mean reversion",
      "Bollinger Bands",
      "Equities",
      "Python / pandas",
      "Backtesting",
    ],
    publishedStrategies: [
      { name: "Bollinger Reversion", return: "+134.81%" },
    ],
  },
  {
    slug: "daniel-mensah",
    algorithmId: "demo-4",
    algorithmName: "RSI Momentum",
    developerName: "Daniel Mensah",
    verified: true,
    joined: "02 Feb 2025",
    role: "Financial Mathematics with Data Science MSc student at King's College London, exploring short-horizon technical signals.",
    educationBadge: "King's College London",
    publishedCountLabel: "1 strategy published",
    stats: {
      liveAlgorithms: "1",
      totalCapitalManaged: "£12,940.00",
      averageReturn: "+1.54%",
    },
    about:
      "I am interested in tactical signal research, especially oscillator-based systems that react to overbought and oversold conditions. My work focuses on testing when these signals add value and when signal noise makes them unreliable.",
    tags: [
      "Momentum",
      "RSI signals",
      "Tactical trading",
      "Python / pandas",
      "Data science",
    ],
    publishedStrategies: [
      { name: "RSI Momentum", return: "+1.54%" },
    ],
  },
  {
    slug: "maya-shah",
    algorithmId: "demo-5",
    algorithmName: "Balanced Growth",
    developerName: "Maya Shah",
    verified: true,
    joined: "18 Feb 2025",
    role: "MSc Computational Mathematical Finance student at the University of Edinburgh, focused on diversified portfolio construction.",
    educationBadge: "University of Edinburgh",
    publishedCountLabel: "1 strategy published",
    stats: {
      liveAlgorithms: "1",
      totalCapitalManaged: "£31,420.00",
      averageReturn: "+22.00%",
    },
    about:
      "I build multi-asset strategies designed to spread exposure across different market drivers rather than rely on a single source of return. I am particularly interested in diversification, risk budgeting, and smoother long-run compounding.",
    tags: [
      "Multi-asset",
      "Diversification",
      "Portfolio construction",
      "Python / pandas",
      "Risk budgeting",
    ],
    publishedStrategies: [
      { name: "Balanced Growth", return: "+22.00%" },
    ],
  },
  {
    slug: "yusuf-malik",
    algorithmId: "demo-6",
    algorithmName: "Gold Hedge",
    developerName: "Yusuf Malik",
    verified: true,
    joined: "03 Mar 2025",
    role: "MSc Quantitative Finance student at Bayes Business School, researching defensive overlays and commodities exposure.",
    educationBadge: "Bayes Business School",
    publishedCountLabel: "1 strategy published",
    stats: {
      liveAlgorithms: "1",
      totalCapitalManaged: "£19,760.00",
      averageReturn: "+18.00%",
    },
    about:
      "My work focuses on defensive systematic allocations, especially how precious metals can behave differently from growth assets during stress. I am interested in portfolio protection, inflation-aware positioning, and practical diversifiers for broader portfolios.",
    tags: [
      "Commodities",
      "Gold overlay",
      "Inflation hedge",
      "Python / pandas",
      "Portfolio risk",
    ],
    publishedStrategies: [
      { name: "Gold Hedge", return: "+18.00%" },
    ],
  },
];

const BY_SLUG = new Map(developerProfiles.map((p) => [p.slug, p]));
const BY_ALGORITHM_ID = new Map(developerProfiles.map((p) => [p.algorithmId, p]));

export function getDeveloperProfileBySlug(slug: string): DeveloperProfile | null {
  return BY_SLUG.get(slug) ?? null;
}

/** Resolve developer for an algorithm (e.g. demo-1 → acar-gok). Use for the card under the algorithm name. */
export function getDeveloperByAlgorithmId(algorithmId: string): DeveloperProfile | null {
  return BY_ALGORITHM_ID.get(algorithmId) ?? null;
}
