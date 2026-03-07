/**
 * Pure helpers for portfolio/account metrics. Safe to use in Server Components.
 */

export type RiskMixLabel = "Low" | "Medium" | "High";

export type DiversificationLabel =
  | "Well diversified"
  | "Moderately concentrated"
  | "Concentrated";

/** Derive risk mix from holdings' risk scores (1–10). */
export function riskMixFromScores(scores: (number | undefined)[]): RiskMixLabel {
  const defined = scores.filter((s): s is number => s != null);
  if (defined.length === 0) return "Medium";
  const avg = defined.reduce((a, b) => a + b, 0) / defined.length;
  if (avg <= 3) return "Low";
  if (avg >= 7) return "High";
  return "Medium";
}

/** Derive diversification label from number of holdings and concentration. */
export function diversificationLabel(
  numberOfHoldings: number,
  maxWeightPct?: number
): DiversificationLabel {
  if (numberOfHoldings >= 4 && (maxWeightPct == null || maxWeightPct <= 35)) return "Well diversified";
  if (numberOfHoldings >= 2 && (maxWeightPct == null || maxWeightPct <= 50)) return "Moderately concentrated";
  return "Concentrated";
}
