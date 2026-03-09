/**
 * Plain-English labels and microcopy for the investor product.
 * Use these instead of technical terms on primary screens.
 */

/** Shown on all investor pages. */
export const INVESTOR_DISCLAIMER =
  "University prototype. Paper trading only. Not investment advice.";

export const METRIC_LABELS = {
  /** Use instead of "Max drawdown" */
  biggestDrop: "Biggest drop",
  /** Use instead of "Volatility" */
  priceMovement: "Price movement",
  /** Use instead of "Sharpe ratio" */
  riskAdjustedReturn: "Risk-adjusted return",
  /** Use instead of "Correlation" */
  similarityToMarket: "Similarity to market",
  /** Cumulative return */
  return: "Return",
  /** Strategy snapshot / allocation summary */
  marketSimilarity: "Market similarity",
  dataConfidence: "Data confidence",
  /** For tooltips / advanced mode, keep technical term */
  maxDrawdown: "Max drawdown",
  sharpeRatio: "Sharpe ratio",
  volatility: "Volatility",
  correlation: "Correlation",
} as const;

export const EMPTY_STATES = {
  noHoldings: {
    headline: "No holdings yet",
    body: "Explore strategies and add them to your portfolio to see performance here.",
    cta: "Browse strategies",
  },
  noActivity: {
    headline: "No recent activity",
    body: "Activity appears as you interact with the demo. Allocations, watchlist changes, and portfolio updates will appear here.",
    cta: "Browse strategies",
  },
} as const;

/** Three stages for demo entry (headings, empty states, tutorial). */
export const DEMO_STAGES = {
  understand: "Understand the demo",
  explore: "Explore the dashboard",
  personalise: "Personalise or reset in Settings",
} as const;

export const PAGE_SUBTITLES = {
  dashboard: "Allocation, performance, and next actions at a glance.",
  explore: "Compare strategies by risk, biggest drop, and portfolio role before trying them in your paper portfolio.",
  portfolio: "See your current allocations, concentration, and overall portfolio behaviour.",
  algorithmDetail: "Review performance, risk and how it works before adding to your portfolio.",
} as const;

/** First-run welcome banner and onboarding. */
export const DEMO_ONBOARDING = {
  welcomeBanner: {
    eyebrow: "Demo mode",
    title: "Welcome to the Vega Financial demo",
    body: "Explore a paper trading experience with simulated balances, guided walkthroughs, and no live money movement.",
    ctaStartTutorial: "Start tutorial",
    ctaSkip: "Skip for now",
    linkResetLater: "Reset or restart later in Settings",
  },
  trustCues: [
    "Simulated environment",
    "No live transactions",
    "Local demo preferences only",
  ],
  simulatedDisclosure: "Values shown are simulated for demonstration purposes.",
} as const;

/** Quick-start strip under the banner. */
export const DEMO_QUICK_START = [
  {
    title: "Explore strategies",
    description: "Browse and compare algorithms by risk and return.",
    href: "/vega-financial/marketplace",
  },
  {
    title: "Track a sample portfolio",
    description: "Your demo portfolio is preloaded so you can explore immediately.",
    href: "/vega-financial/portfolio",
  },
  {
    title: "Learn how the demo works",
    description: "Understand metrics and how the paper trading experience works.",
    href: "/vega-financial/learn",
  },
] as const;

/** Empty and initial states for first-run. */
export const DEMO_EMPTY_STATES = {
  portfolioPreloaded:
    "Your demo portfolio is preloaded so you can explore immediately.",
  watchlistHint: "Save strategies to your watchlist to compare them later.",
  activityHint: "Activity appears as you interact with the demo.",
} as const;
