/**
 * Backtest runner. Deterministic by seed.
 */

import { generateGBMPrices } from "./gbm";
import { buyAndHold } from "./strategies/buyAndHold";
import { maCrossover } from "./strategies/maCrossover";
import type { BacktestResult, StrategyId, StrategyParameters } from "./types";
import { computeMetrics } from "./metrics";

function simpleHash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export function runBacktest(
  versionId: string,
  horizon: number,
  strategyId: StrategyId,
  parameters: StrategyParameters,
  startingCapital: number
): BacktestResult {
  const paramStr = JSON.stringify(parameters ?? {});
  const seedStr = `${versionId}-${horizon}-${strategyId}-${paramStr}`;
  const seed = simpleHash(seedStr);

  const prices = generateGBMPrices(100, 0.08, 0.2, horizon, seed);
  const priceSeries = { dates: prices.map((_, i) => i), prices };

  let position: number[];
  if (strategyId === "buyAndHold") {
    position = buyAndHold(priceSeries);
  } else if (strategyId === "maCrossover") {
    const fast = parameters.fastWindow ?? 10;
    const slow = parameters.slowWindow ?? 30;
    position = maCrossover(priceSeries, fast, slow);
  } else {
    position = buyAndHold(priceSeries);
  }

  const equity: number[] = [];
  let cash = startingCapital;
  let shares = 0;

  for (let t = 0; t < horizon; t++) {
    const pos = position[t] ?? 0;
    const targetValue = cash + shares * prices[t]!;
    const targetEquity = targetValue * pos;
    const price = prices[t]!;
    if (price <= 0) {
      equity.push(equity[t - 1] ?? startingCapital);
      continue;
    }
    shares = pos > 0 ? targetEquity / price : 0;
    cash = targetValue - shares * price;
    equity.push(cash + shares * price);
  }

  const equityPoints = equity.map((value, dayIndex) => ({ dayIndex, value }));
  const metrics = computeMetrics(equity);

  return {
    equityPoints,
    metrics,
    seed: seedStr,
  };
}
