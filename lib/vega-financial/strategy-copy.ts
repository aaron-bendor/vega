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
  /** Hero: one-line plain-English summary. */
  oneLineSummary?: string;
  /** Hero: suitable for (quick summary list). */
  suitableFor?: string;
  /** Hero: best role in a portfolio. */
  bestRole?: string;
  /** Hero: typical behaviour. */
  typicalBehaviour?: string;
  /** Hero: main drawback. */
  mainDrawback?: string;
  /** Hero: why consider this (3 mini cards). */
  whyConsider?: { title: string; body: string }[];
  /** Hero: trust strip items. */
  trustSignals?: string[];
  /** Action card: plain-English insight. */
  actionInsight?: string;
  /** Overview: risks to know (3 cards). */
  risksToKnow?: string[];
  /** Overview: when it tends to work (short list). */
  whenWorksList?: string[];
  /** Overview: when it tends to struggle (short list). */
  whenStrugglesList?: string[];
  /** Overview: who it may suit (one line). */
  whoItMaySuit?: string;
  /** Overview: how to read metrics (expandable). */
  metricsHelp?: Record<string, string>;
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
    oneLineSummary:
      "Momentum strategy that aims to follow strong equity trends while adjusting to changing market conditions.",
    suitableFor: "Users comfortable with medium risk and trend-following behaviour.",
    bestRole: "Growth-oriented strategy that may complement slower or defensive holdings.",
    typicalBehaviour: "Tends to do better in sustained trends.",
    mainDrawback: "Can struggle in sideways or reversing markets.",
    whyConsider: [
      { title: "Upside potential", body: "Can benefit from persistent market leadership." },
      { title: "Risk profile", body: "Medium risk with meaningful pullbacks." },
      { title: "Diversification role", body: "May complement lower-growth or non-momentum strategies." },
    ],
    trustSignals: ["Reviewed before publication", "Simulated portfolio use", "Methodology explained", "Advanced analysis available"],
    actionInsight:
      "This strategy has delivered strong returns in the demo period, but it has also experienced meaningful declines. It may suit users who can tolerate short-term losses.",
    risksToKnow: [
      "Can lose momentum quickly during reversals",
      "May underperform in sideways markets",
      "Returns may arrive in bursts rather than steadily",
    ],
    whenWorksList: ["Sustained trending markets", "Clear market leadership"],
    whenStrugglesList: ["Choppy or rapidly reversing conditions", "Fast rotation between sectors"],
    whoItMaySuit:
      "May suit investors looking for growth-oriented exposure who are comfortable with medium risk and periods of underperformance.",
    metricsHelp: {
      return: "Total change in value over the tested period.",
      biggestDrop: "Largest peak-to-trough fall before recovering.",
      riskAdjustedReturn: "How much return the strategy delivered for the level of risk taken.",
      marketSimilarity: "How closely the strategy moved with the market benchmark.",
      dataConfidence: "Based on the amount of history available for this strategy.",
    },
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
    oneLineSummary:
      "Trend-following strategy that aims to stay aligned with broad market direction without forecasting turning points.",
    suitableFor: "Users comfortable with equity market dependence and medium risk.",
    bestRole: "Core rules-based trend sleeve that can complement defensive holdings.",
    typicalBehaviour: "Tends to do better when markets move in a sustained direction.",
    mainDrawback: "Can struggle in choppy or sideways markets.",
    whyConsider: [
      { title: "Upside potential", body: "Can capture sustained market moves." },
      { title: "Risk profile", body: "Medium risk with meaningful pullbacks." },
      { title: "Diversification role", body: "May complement non-trend or defensive strategies." },
    ],
    trustSignals: ["Reviewed before publication", "Simulated portfolio use", "Methodology explained", "Advanced analysis available"],
    actionInsight:
      "This strategy has delivered strong returns in the demo period, but it has also experienced meaningful declines. It may suit users who can tolerate short-term losses.",
    risksToKnow: [
      "Can lose momentum quickly during reversals",
      "May underperform in sideways markets",
      "Returns may arrive in bursts rather than steadily",
    ],
    whenWorksList: ["Sustained trending markets", "Clear directional moves"],
    whenStrugglesList: ["Choppy or sideways markets", "Repeated false signals"],
    whoItMaySuit:
      "May suit investors looking for a clean trend strategy who are comfortable with medium risk and equity dependence.",
    metricsHelp: {
      return: "Total change in value over the tested period.",
      biggestDrop: "Largest peak-to-trough fall before recovering.",
      riskAdjustedReturn: "How much return the strategy delivered for the level of risk taken.",
      marketSimilarity: "How closely the strategy moved with the market benchmark.",
      dataConfidence: "Based on the amount of history available for this strategy.",
    },
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
    oneLineSummary:
      "Mean-reversion strategy that looks for temporary price moves away from a normal range and positions for a move back.",
    suitableFor: "Users looking to diversify away from pure trend exposure.",
    bestRole: "Diversifying tactical sleeve that can complement momentum strategies.",
    typicalBehaviour: "Tends to do better when markets overshoot then settle back.",
    mainDrawback: "Can struggle when strong trends continue longer than expected.",
    whyConsider: [
      { title: "Upside potential", body: "Can benefit when prices revert to the mean." },
      { title: "Risk profile", body: "Medium risk; behaves differently from trend strategies." },
      { title: "Diversification role", body: "May complement momentum or trend-following holdings." },
    ],
    trustSignals: ["Reviewed before publication", "Simulated portfolio use", "Methodology explained", "Advanced analysis available"],
    actionInsight:
      "This strategy can behave differently from trend-following approaches. It may suit investors looking to diversify their paper portfolio.",
    risksToKnow: [
      "Can struggle in strong trending markets",
      "May underperform when prices do not revert quickly",
      "Returns can be uneven over shorter periods",
    ],
    whenWorksList: ["Markets that overshoot then settle", "Conditions where prices revert to a mean"],
    whenStrugglesList: ["Strong trends that continue longer than expected", "Prices that do not revert quickly"],
    whoItMaySuit:
      "May suit investors looking to diversify away from pure trend exposure and comfortable with medium risk.",
    metricsHelp: {
      return: "Total change in value over the tested period.",
      biggestDrop: "Largest peak-to-trough fall before recovering.",
      riskAdjustedReturn: "How much return the strategy delivered for the level of risk taken.",
      marketSimilarity: "How closely the strategy moved with the market benchmark.",
      dataConfidence: "Based on the amount of history available for this strategy.",
    },
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
    oneLineSummary: "Tactical strategy built around overbought and oversold signals; aims to respond to short-term extremes.",
    suitableFor: "Users who want a tactical strategy and understand that indicator-driven systems can be unstable.",
    bestRole: "Small tactical allocation.",
    typicalBehaviour: "Tends to respond to momentum extremes and reversals.",
    mainDrawback: "Can be unstable in choppy or persistent trends.",
    whyConsider: [
      { title: "Upside potential", body: "Can capture short-term reversals." },
      { title: "Risk profile", body: "Higher variability; tactical by design." },
      { title: "Diversification role", body: "May add tactical variety to a portfolio." },
    ],
    trustSignals: ["Reviewed before publication", "Simulated portfolio use", "Methodology explained", "Advanced analysis available"],
    actionInsight: "This is a tactical strategy with higher variability. Suits investors who understand short-term signal-based approaches.",
    risksToKnow: ["Can struggle in choppy markets", "May underperform in persistent trends", "Returns can be uneven"],
    whenWorksList: ["Reversals after momentum extremes"],
    whenStrugglesList: ["Choppy markets", "Persistent trends"],
    whoItMaySuit: "Investors who want a tactical strategy and understand that indicator-driven systems can be unstable.",
    metricsHelp: {
      return: "Total change in value over the tested period.",
      biggestDrop: "Largest peak-to-trough fall before recovering.",
      riskAdjustedReturn: "How much return the strategy delivered for the level of risk taken.",
      marketSimilarity: "How closely the strategy moved with the market benchmark.",
      dataConfidence: "Based on the amount of history available for this strategy.",
    },
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
    oneLineSummary: "Diversified multi-asset strategy designed to spread exposure across different market drivers.",
    suitableFor: "Users starting a paper portfolio who want a more balanced first allocation.",
    bestRole: "Core diversified anchor.",
    typicalBehaviour: "Tends to provide a steadier base when diversification benefits hold.",
    mainDrawback: "Can struggle when diversification breaks down or risk assets weaken together.",
    whyConsider: [
      { title: "Upside potential", body: "Spreads exposure across different drivers." },
      { title: "Risk profile", body: "Designed for steadier base; not highest upside." },
      { title: "Diversification role", body: "Core anchor that may complement concentrated strategies." },
    ],
    trustSignals: ["Reviewed before publication", "Simulated portfolio use", "Methodology explained", "Advanced analysis available"],
    actionInsight: "This strategy aims to provide a steadier base. Suits investors who value diversification over concentrated upside.",
    risksToKnow: ["Can struggle when diversification breaks down", "Multiple risk assets may weaken together", "Returns can be moderate"],
    whenWorksList: ["Periods when diversification benefits hold", "When no single asset class dominates"],
    whenStrugglesList: ["When diversification breaks down", "Multiple risk assets weakening together"],
    whoItMaySuit: "Investors starting a paper portfolio who want a more balanced first allocation.",
    metricsHelp: {
      return: "Total change in value over the tested period.",
      biggestDrop: "Largest peak-to-trough fall before recovering.",
      riskAdjustedReturn: "How much return the strategy delivered for the level of risk taken.",
      marketSimilarity: "How closely the strategy moved with the market benchmark.",
      dataConfidence: "Based on the amount of history available for this strategy.",
    },
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
    oneLineSummary: "Defensive allocation overlay built to add precious metals exposure alongside risk assets.",
    suitableFor: "Users seeking to reduce concentration to equity-driven strategies.",
    bestRole: "Defensive diversifier.",
    typicalBehaviour: "Tends to behave differently from growth assets in stress.",
    mainDrawback: "Can lag when growth assets rally strongly.",
    whyConsider: [
      { title: "Upside potential", body: "Diversification rather than aggressive growth." },
      { title: "Risk profile", body: "Defensive; may behave differently in stress." },
      { title: "Diversification role", body: "May reduce concentration to equities." },
    ],
    trustSignals: ["Reviewed before publication", "Simulated portfolio use", "Methodology explained", "Advanced analysis available"],
    actionInsight: "This strategy is designed for diversification. Use it as a defensive sleeve, not a high-growth standalone.",
    risksToKnow: ["Can lag when growth assets rally", "Defensive exposures may underperform in strong bull markets", "Returns can be uneven"],
    whenWorksList: ["When investors seek safety", "When inflation concerns rise"],
    whenStrugglesList: ["When growth assets rally strongly", "When defensive exposures lag"],
    whoItMaySuit: "Investors who want to reduce concentration to equity-driven strategies.",
    metricsHelp: {
      return: "Total change in value over the tested period.",
      biggestDrop: "Largest peak-to-trough fall before recovering.",
      riskAdjustedReturn: "How much return the strategy delivered for the level of risk taken.",
      marketSimilarity: "How closely the strategy moved with the market benchmark.",
      dataConfidence: "Based on the amount of history available for this strategy.",
    },
  },
};

/** Default trust signals when not specified per strategy. */
export const DEFAULT_TRUST_SIGNALS = [
  "Reviewed before publication",
  "Simulated portfolio use",
  "Methodology explained",
  "Advanced analysis available",
];

/** Default metrics help when not specified per strategy. */
export const DEFAULT_METRICS_HELP: Record<string, string> = {
  return: "Total change in value over the tested period.",
  biggestDrop: "Largest peak-to-trough fall before recovering.",
  riskAdjustedReturn: "How much return the strategy delivered for the level of risk taken.",
  marketSimilarity: "How closely the strategy moved with the market benchmark.",
  dataConfidence: "Based on the amount of history available for this strategy.",
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
