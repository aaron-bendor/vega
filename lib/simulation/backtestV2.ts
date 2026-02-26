/**
 * Backtest runner v2. Uses market data provider, scenario engine, templates.
 * Supports real Bar[] (Stooq) or synthetic prices. Deterministic by seed when synthetic.
 * Works without DB.
 */

import type { Bar } from "@/lib/marketdata/types";
import { generateMultiAssetPrices } from "./markets/multiAsset";
import {
  buyAndHold,
  maCrossover,
  bollingerReversion,
  rsiMomentum,
  volTargetOverlay,
} from "./templates/strategies";
import { computeMetrics } from "./metrics";
import { simpleHash } from "./rng";

export type ScenarioId = "TREND" | "RANGE" | "CRASH" | "RECOVERY";

export interface BacktestInput {
  versionId?: string;
  templateId: string;
  params: Record<string, number | string>;
  scenario?: ScenarioId;
  horizon?: number;
  startingCapital: number;
  seed?: string;
  /** Real price bars from Stooq etc. When set, use these instead of synthetic. */
  priceBars?: Bar[];
}

export interface BacktestResult {
  equityPoints: { dayIndex: number; value: number }[];
  drawdownPoints: { dayIndex: number; value: number }[];
  metrics: {
    cumulativeReturn: number;
    sharpeRatio: number | null;
    maxDrawdown: number;
    annualisedVolatility: number;
  };
  seed: string;
}

function toNum(v: number | string | undefined, d: number): number {
  if (v === undefined) return d;
  return typeof v === "number" ? v : parseInt(String(v), 10) || d;
}

function getExposure(
  templateId: string,
  params: Record<string, number | string>,
  prices: number[]
): number[] {
  const p = { prices };
  switch (templateId) {
    case "buy_and_hold":
      return buyAndHold(p);
    case "ma_crossover":
      return maCrossover(
        p,
        toNum(params.fastWindow, 10),
        toNum(params.slowWindow, 30)
      );
    case "bollinger_reversion":
      return bollingerReversion(
        p,
        toNum(params.window, 20),
        toNum(params.k, 2)
      );
    case "rsi_momentum":
      return rsiMomentum(
        p,
        toNum(params.window, 14),
        toNum(params.entry, 30),
        toNum(params.exit, 70)
      );
    case "vol_target_overlay": {
      const innerId = params.innerTemplate as string | undefined;
      const inner = innerId
        ? getExposure(innerId, {}, prices)
        : buyAndHold(p);
      return volTargetOverlay(
        inner,
        prices,
        toNum(params.targetVol, 0.15),
        toNum(params.maxLeverage, 1)
      );
    }
    default:
      return buyAndHold(p);
  }
}

export function runBacktestV2(input: BacktestInput): BacktestResult {
  const horizon = input.priceBars?.length ?? (input.horizon ?? 252);
  const seedStr =
    input.seed ??
    `${input.versionId ?? "demo"}-${horizon}-${input.templateId}-${JSON.stringify(input.params)}`;
  const seed = simpleHash(seedStr);
  const regimeSeed = simpleHash(seedStr + "-regime");

  const prices: number[] = input.priceBars
    ? input.priceBars.map((b) => b.close)
    : (() => {
        const s0 = [100];
        const priceArrays = generateMultiAssetPrices(
          s0,
          seed,
          (input.horizon ?? 252) + 1,
          regimeSeed
        );
        return priceArrays[0] ?? Array.from({ length: (input.horizon ?? 252) + 1 }, () => 100);
      })();

  const exposure = getExposure(input.templateId, input.params, prices);

  const equity: number[] = [];
  let cash = input.startingCapital;
  let shares = 0;

  for (let t = 0; t < prices.length; t++) {
    const pos = Math.max(0, Math.min(1, exposure[t] ?? 0));
    const targetValue = cash + shares * (prices[t] ?? 100);
    const targetEquity = targetValue * pos;
    const price = prices[t] ?? 100;
    shares = price > 0 && pos > 0 ? targetEquity / price : 0;
    cash = targetValue - shares * price;
    equity.push(cash + shares * price);
  }

  const equityPoints = equity.map((value, dayIndex) => ({ dayIndex, value }));

  let peak = equity[0] ?? input.startingCapital;
  const drawdownPoints = equity.map((v, i) => {
    peak = Math.max(peak, v);
    return {
      dayIndex: i,
      value: peak > 0 ? (v / peak - 1) * 100 : 0,
    };
  });

  const metrics = computeMetrics(equity);

  return {
    equityPoints,
    drawdownPoints,
    metrics,
    seed: seedStr,
  };
}
