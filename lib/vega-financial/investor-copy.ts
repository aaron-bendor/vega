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
    cta: "Explore strategies",
  },
  noActivity: {
    headline: "No recent activity",
    body: "Allocations, watchlist changes, and portfolio updates will appear here.",
    cta: "Explore strategies",
  },
} as const;

export const PAGE_SUBTITLES = {
  dashboard: "Allocation, performance, and next actions at a glance.",
  explore: "Compare systematic strategies by risk, drawdown, and portfolio role before you allocate.",
  portfolio: "See your current allocations, concentration, and overall portfolio behaviour.",
  algorithmDetail: "Review performance, risk and how it works before adding to your portfolio.",
} as const;
