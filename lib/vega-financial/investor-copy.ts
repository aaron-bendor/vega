/**
 * Plain-English labels and microcopy for the investor product.
 * Use these instead of technical terms on primary screens.
 */

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
  /** For tooltips / advanced mode, keep technical term */
  maxDrawdown: "Max drawdown",
  sharpeRatio: "Sharpe ratio",
  volatility: "Volatility",
  correlation: "Correlation",
} as const;

export const EMPTY_STATES = {
  noHoldings: {
    headline: "No holdings yet",
    body: "Explore algorithms and add them to your portfolio to see performance here.",
    cta: "Explore algorithms",
  },
  noActivity: {
    headline: "No recent activity",
    body: "When you add funds or allocate to a strategy, the updates will appear here.",
    cta: "Explore strategies",
  },
} as const;

export const PAGE_SUBTITLES = {
  dashboard: "Track your portfolio, review your holdings, and decide what to do next.",
  explore: "Discover algorithms you might want to add to your portfolio.",
  portfolio: "How your money is allocated and how it's performing.",
  algorithmDetail: "Review performance, risk and how it works before adding to your portfolio.",
} as const;
