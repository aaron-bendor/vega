/**
 * Strategy implementations. Return exposure in [0, 1].
 */

import { sma } from "../indicators/sma";
import { rollingStd } from "../indicators/rollingStd";
import { rsi } from "../indicators/rsi";

interface PriceSeries {
  prices: number[];
}

export function buyAndHold(_p: PriceSeries): number[] {
  return _p.prices.map(() => 1);
}

export function maCrossover(
  p: PriceSeries,
  fastWindow: number,
  slowWindow: number
): number[] {
  const maFast = sma(p.prices, fastWindow);
  const maSlow = sma(p.prices, slowWindow);
  return p.prices.map((_, i) =>
    i >= slowWindow - 1 && maFast[i]! > maSlow[i]! ? 1 : 0
  );
}

export function bollingerReversion(
  p: PriceSeries,
  window: number,
  k: number
): number[] {
  const ma = sma(p.prices, window);
  const std = rollingStd(p.prices, window);
  return p.prices.map((_, i) => {
    if (i < window - 1) return 0;
    const upper = ma[i]! + k * (std[i]! || 0.01);
    const lower = ma[i]! - k * (std[i]! || 0.01);
    const price = p.prices[i]!;
    if (price <= lower) return 1;
    if (price >= upper) return 0;
    return 0.5; // neutral zone
  });
}

export function rsiMomentum(
  p: PriceSeries,
  window: number,
  entry: number,
  exit: number
): number[] {
  const r = rsi(p.prices, window);
  return r.map((v) => (v <= entry ? 1 : v >= exit ? 0 : 0.5));
}

export function volTargetOverlay(
  baseExposure: number[],
  prices: number[],
  targetVol: number,
  maxLeverage: number,
  window: number = 20
): number[] {
  const std = rollingStd(prices, window);
  const annVol = std.map((s) => s * Math.sqrt(252));
  return baseExposure.map((e, i) => {
    const vol = annVol[i] ?? 0.2;
    const scale = vol > 0 ? Math.min(maxLeverage, targetVol / vol) : 1;
    return Math.max(0, Math.min(1, e * scale));
  });
}
