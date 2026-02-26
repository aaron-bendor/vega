/**
 * Simulation engine types.
 * Pure TypeScript, no side effects.
 */

export interface PriceSeries {
  dates: number[];
  prices: number[];
}

export interface EquitySeries {
  dates: number[];
  values: number[];
}

export interface BacktestResult {
  equityPoints: { dayIndex: number; value: number }[];
  metrics: {
    cumulativeReturn: number;
    sharpeRatio: number | null;
    maxDrawdown: number;
    annualisedVolatility: number;
  };
  seed: string;
}

export type StrategyId = "buyAndHold" | "maCrossover" | "meanReversion";

export interface StrategyParameters {
  fastWindow?: number;
  slowWindow?: number;
  lookback?: number;
}
