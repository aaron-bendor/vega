/**
 * Risk level labels for algorithm cards.
 */
export const RISK_LABELS = ["Low", "Medium", "High"] as const;
export type RiskLevel = (typeof RISK_LABELS)[number];
