/**
 * Strategy detail page copy — overview cards, methodology, metrics.
 * Keyed by demo algorithm id for use on strategy detail pages.
 */

export interface StrategyOverviewCopy {
  /** Card 1: What this strategy does (body). */
  whatItDoes: string;
  /** Card 2: Where it tends to work (bullets). */
  whereWorks: string[];
  /** Card 3: Where it can struggle (bullets). */
  whereStruggles: string[];
  /** Card 4: Portfolio fit rows. */
  bestUsedAs: string;
  suggestedSize: string;
  maySuitYouIf: string;
  mayNotSuitYouIf: string;
  /** Legacy fields for backwards compatibility. */
  overview?: string;
  whyExists?: string;
  whenWorks?: string;
  whenStruggles?: string;
  whoFits?: string;
  whoNotFit?: string;
  suggestedRole?: string;
  suggestedAllocationRange?: string;
  /** Extra note (e.g. Trend Tracker risk label clarification). */
  extraNote?: string;
  /** Fallback when metrics are unavailable. */
  metricsUnavailableNote?: string;
}

export const STRATEGY_OVERVIEW_COPY: Record<string, StrategyOverviewCopy> = {
  "demo-1": {
    whatItDoes:
      "Alpha Momentum Pro follows strong equity trends using an adaptive lookback window. It is designed to stay with persistent market leadership without relying on one fixed setting in every environment.",
    whereWorks: [
      "Sustained trends with clear market leadership",
      "Periods where winners continue to outperform for longer than expected",
    ],
    whereStruggles: [
      "Sharp reversals after strong trends",
      "Fast rotation between sectors or styles",
      "Short rallies that fail before momentum can build",
    ],
    bestUsedAs: "Satellite growth allocation",
    suggestedSize: "5% to 15% of a diversified demo portfolio",
    maySuitYouIf: "You want rules-based equity exposure with a momentum tilt",
    mayNotSuitYouIf: "You prefer low drawdown, lower turnover, or stronger downside protection",
    overview:
      "Alpha Momentum Pro is a rules-based equity momentum strategy that tries to stay with strong market leadership while adapting its lookback period over time.",
    whyExists:
      "Momentum can be effective when trends last longer than expected. This strategy is designed for investors who want a systematic way to follow strength without manually chasing winners.",
    whenWorks:
      "It tends to work best when market leadership is clear and trends persist over weeks or months.",
    whenStruggles:
      "It can struggle when trends reverse quickly, when market leadership rotates sharply, or when short-lived rallies fail.",
    whoFits:
      "Investors looking for a rules-based growth-oriented strategy with equity exposure.",
    whoNotFit:
      "Investors who want low turnover, low drawdown, or strong protection in sudden reversals.",
    suggestedRole: "Satellite growth allocation.",
    suggestedAllocationRange: "5% to 15% of a diversified demo portfolio.",
  },
  "demo-2": {
    whatItDoes:
      "Trend Tracker is a simple trend-following equity strategy that aims to stay aligned with broad market direction rather than forecast turning points. It is designed to be straightforward and easy to compare against a market benchmark.",
    whereWorks: [
      "Markets moving in a sustained direction",
      "Periods when signal noise stays relatively low",
    ],
    whereStruggles: [
      "Choppy or sideways markets",
      "Repeated false signals causing whipsaw losses",
    ],
    bestUsedAs: "Core rules-based trend sleeve",
    suggestedSize: "5% to 20% of a diversified demo portfolio",
    maySuitYouIf: "You want a clean, readable trend strategy and are comfortable with equity market dependence",
    mayNotSuitYouIf: "You treat a low risk label as a promise of small drawdowns in all conditions",
    overview:
      "Trend Tracker is a simple trend-following equity strategy that aims to stay aligned with broad market direction.",
    whyExists: "Many investors want systematic exposure without a complex model.",
    whenWorks: "It tends to work best when markets move in a sustained direction.",
    whenStruggles: "It can struggle in choppy or sideways markets.",
    whoFits: "Investors who want a clean, readable trend strategy.",
    whoNotFit: "Investors who treat a low risk label as a promise of small losses.",
    suggestedRole: "Core rules-based trend sleeve.",
    suggestedAllocationRange: "5% to 20% of a diversified demo portfolio.",
    extraNote:
      "Risk label refers to the strategy's internal classification in this prototype, not a guarantee of small losses. Always review drawdown and volatility alongside the headline label.",
  },
  "demo-3": {
    whatItDoes:
      "Bollinger Reversion is a mean-reversion strategy that looks for temporary price moves away from a normal trading range and positions for a move back towards that range. It is intended to behave differently from pure momentum or trend-following approaches.",
    whereWorks: [
      "Markets that overshoot then settle back into a stable range",
      "Conditions where prices revert to a mean",
    ],
    whereStruggles: [
      "Strong trends that continue longer than expected",
      "Prices that do not revert quickly",
    ],
    bestUsedAs: "Diversifying tactical sleeve",
    suggestedSize: "5% to 15% of a diversified demo portfolio",
    maySuitYouIf: "You are looking to diversify away from pure trend exposure",
    mayNotSuitYouIf: "You prefer simple long-only directional strategies or very low trading frequency",
    overview:
      "Bollinger Reversion is a mean-reversion strategy that looks for temporary price moves away from a normal trading range.",
    whyExists: "Not all markets trend smoothly; mean-reversion can complement directional approaches.",
    whenWorks: "It tends to work best when markets overshoot and settle back.",
    whenStruggles: "It can struggle when strong trends continue for longer than expected.",
    whoFits: "Investors looking to diversify away from pure trend exposure.",
    whoNotFit: "Investors who prefer simple long-only directional strategies.",
    suggestedRole: "Diversifying tactical sleeve.",
    suggestedAllocationRange: "5% to 15% of a diversified demo portfolio.",
  },
  "demo-4": {
    whatItDoes:
      "RSI Momentum is a tactical strategy built around overbought and oversold signals from the RSI indicator. It aims to respond to short-term extremes rather than hold a steady long-term directional view.",
    whereWorks: [
      "Reversals that happen cleanly after momentum extremes",
      "Environments where the signal is not overwhelmed by noise",
    ],
    whereStruggles: [
      "Choppy markets or persistent trends",
      "Indicator thresholds too sensitive to the environment",
    ],
    bestUsedAs: "Small tactical allocation",
    suggestedSize: "0% to 10% of a diversified demo portfolio",
    maySuitYouIf: "You want a tactical strategy and understand that indicator-driven systems can be unstable",
    mayNotSuitYouIf: "You are looking for smoother historical performance or a simpler long-horizon strategy",
    overview:
      "RSI Momentum is a tactical strategy built around overbought and oversold signals from the RSI indicator.",
    whyExists: "Some investors want a more tactical, signal-based approach.",
    whenWorks: "It tends to work best when reversals happen cleanly after momentum extremes.",
    whenStruggles: "It can struggle in choppy markets or during persistent trends.",
    whoFits: "Investors who want a tactical strategy.",
    whoNotFit: "Investors looking for smoother performance or a simpler strategy.",
    suggestedRole: "Small tactical allocation.",
    suggestedAllocationRange: "0% to 10% of a diversified demo portfolio.",
  },
  "demo-5": {
    whatItDoes:
      "Balanced Growth is a diversified multi-asset strategy designed to spread exposure across different market drivers instead of relying on one style or one instrument. The aim is to provide a steadier base for investors who value diversification.",
    whereWorks: [
      "Periods when diversification benefits hold",
      "When no single asset class dominates the portfolio",
    ],
    whereStruggles: [
      "When diversification breaks down",
      "Multiple risk assets weakening together",
    ],
    bestUsedAs: "Core diversified anchor",
    suggestedSize: "10% to 25% of a diversified demo portfolio",
    maySuitYouIf: "You are starting a paper portfolio and want a more balanced first allocation",
    mayNotSuitYouIf: "You are looking for the highest upside from a concentrated strategy style",
    overview:
      "Balanced Growth is a diversified multi-asset strategy designed to spread exposure across different market drivers.",
    whyExists: "A single-strategy portfolio can become overly dependent on one idea.",
    whenWorks: "It tends to work best when diversification benefits hold.",
    whenStruggles: "It can struggle when diversification breaks down.",
    whoFits: "Investors starting a paper portfolio who want a more balanced first allocation.",
    whoNotFit: "Investors looking for the highest upside from a concentrated strategy.",
    suggestedRole: "Core diversified anchor.",
    suggestedAllocationRange: "10% to 25% of a diversified demo portfolio.",
    metricsUnavailableNote:
      "Latest performance metrics are being prepared for this demo strategy. You can still review the strategy summary and methodology, but avoid comparing it on headline numbers until the metric set is complete.",
  },
  "demo-6": {
    whatItDoes:
      "Gold Hedge is a defensive allocation overlay built to add precious metals exposure alongside risk assets. The main role is diversification rather than aggressive growth.",
    whereWorks: [
      "When investors are seeking safety",
      "Periods when inflation concerns rise or equity leadership weakens",
    ],
    whereStruggles: [
      "When growth assets rally strongly",
      "Defensive exposures lagging behind",
    ],
    bestUsedAs: "Defensive diversifier",
    suggestedSize: "5% to 15% of a diversified demo portfolio",
    maySuitYouIf: "You want to reduce concentration to equity-driven strategies",
    mayNotSuitYouIf: "You are seeking a high-growth standalone strategy",
    overview:
      "Gold Hedge is a defensive allocation overlay built to add precious metals exposure alongside risk assets.",
    whyExists: "Some portfolios become too dependent on equities; gold can behave differently in stress.",
    whenWorks: "It tends to work best when investors are seeking safety or inflation concerns rise.",
    whenStruggles: "It can struggle when growth assets rally strongly.",
    whoFits: "Investors who want to reduce concentration to equity-driven strategies.",
    whoNotFit: "Investors seeking a high-growth standalone strategy.",
    suggestedRole: "Defensive diversifier.",
    suggestedAllocationRange: "5% to 15% of a diversified demo portfolio.",
    metricsUnavailableNote:
      "This strategy is currently available for qualitative review, but its latest demo metric panel is incomplete. Use it as a diversification idea, not as a fully comparable metric page, until the data is filled in.",
  },
};

export const METRICS_EXPLAINER_COPY =
  "These metrics come from the latest simulated backtest for this strategy version. They are useful for comparing ideas, not for predicting future results.";

export const METHODOLOGY_NOTE_COPY =
  "This strategy page keeps the code private, but the data source, tested date range, and headline assumptions should still be visible so investors can judge the result with context.";

export const ALLOCATION_NOTE_COPY =
  "This is a paper allocation only. It changes your demo portfolio, not a real investment account.";

export const HOW_SCORES_CALCULATED = {
  intro:
    "These scores are simplified summaries designed to help compare demo strategies quickly. They are not investment ratings and should always be read alongside the underlying metrics.",
  marketCorrelation:
    "A higher score means the strategy has moved more consistently with its chosen market benchmark. Lower values may indicate better diversification, but only if the strategy's behaviour is still understood.",
  riskStability:
    "A higher score means the strategy's risk profile has been more consistent across the tested period.",
  riskAdjusted:
    "A higher score means the strategy delivered stronger returns relative to the risk it took in this demo framework.",
  performance:
    "A higher score means the strategy delivered stronger historical simulated results overall. This score is a summary, not a forecast.",
  importantNote:
    "Scores are internal comparison tools for this prototype. They do not replace drawdown, volatility, benchmark comparison, or methodology review.",
};
