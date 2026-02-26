/**
 * Market scenario definitions for strategy-separable regimes.
 * TREND, RANGE (mean-revert), CRASH, RECOVERY.
 */

export type ScenarioId = "TREND" | "RANGE" | "CRASH" | "RECOVERY";

export interface ScenarioParams {
  mu: number; // daily drift
  sigma: number; // daily vol
  meanReversion?: number; // for RANGE
  crashSeverity?: number; // for CRASH
}

export const SCENARIOS: Record<ScenarioId, ScenarioParams> = {
  TREND: { mu: 0.0004, sigma: 0.012 },
  RANGE: { mu: 0, sigma: 0.008, meanReversion: 0.1 },
  CRASH: { mu: -0.002, sigma: 0.03, crashSeverity: 0.15 },
  RECOVERY: { mu: 0.001, sigma: 0.015 },
};
