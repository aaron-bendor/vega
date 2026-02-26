/**
 * Moving average crossover strategy.
 * position = 1 if MA_fast > MA_slow else 0
 */

import type { PriceSeries } from "../types";

function sma(prices: number[], window: number): number[] {
  const result: number[] = [];
  for (let i = 0; i < prices.length; i++) {
    if (i < window - 1) {
      result.push(prices[i]!);
    } else {
      let sum = 0;
      for (let j = 0; j < window; j++) sum += prices[i - j]!;
      result.push(sum / window);
    }
  }
  return result;
}

export function maCrossover(
  prices: PriceSeries,
  fastWindow: number,
  slowWindow: number
): number[] {
  const { prices: p } = prices;
  const maFast = sma(p, fastWindow);
  const maSlow = sma(p, slowWindow);
  const position: number[] = [];

  for (let i = 0; i < p.length; i++) {
    if (i < slowWindow - 1) {
      position.push(0);
    } else {
      position.push(maFast[i]! > maSlow[i]! ? 1 : 0);
    }
  }
  return position;
}
