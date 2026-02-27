/**
 * Shared types for Vega Financial investor UI (risk, attributes, positions).
 * Aligned with Darwinex/eToro-style risk and attribute patterns.
 */

/** 1–10 risk score for fast scanning (eToro pattern). */
export type RiskScore = number;

/** Investable attributes (Darwinex-style platform vocabulary). */
export interface InvestableAttributes {
  experience?: number; // track record months
  marketCorrelation?: number; // 0–100
  riskStability?: number; // 0–100
  riskAdjustment?: number; // 0–100
  performancePercentile?: number; // 0–100 vs simulated peers at same risk
}

export interface RiskInfo {
  /** 1–10 for fast read (eToro). */
  riskScore: RiskScore;
  /** 95% monthly VaR as decimal (e.g. 0.05 = 5%). Darwinex-style drill-down. */
  var95MonthlyPct?: number;
  /** True if strategy is wrapped by platform risk engine (standardised). */
  standardised?: boolean;
}
