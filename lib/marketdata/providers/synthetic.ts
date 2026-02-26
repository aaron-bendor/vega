/**
 * Synthetic market data provider (DEFAULT).
 * Offline, deterministic, scenario-based.
 */

import type { Bar, MarketDataProvider, SymbolInfo } from "../types";
import { generateMultiAssetPrices } from "@/lib/simulation/markets/multiAsset";
import { simpleHash } from "@/lib/simulation/rng";

const DEFAULT_SYMBOLS: SymbolInfo[] = [
  { symbol: "SYN1", name: "Synthetic Equity 1", assetClass: "equity" },
  { symbol: "SYN2", name: "Synthetic Equity 2", assetClass: "equity" },
  { symbol: "SYN3", name: "Synthetic Equity 3", assetClass: "equity" },
];

function dateToDays(s: string): number {
  const d = new Date(s);
  return Math.floor(d.getTime() / 86400000);
}

export class SyntheticProvider implements MarketDataProvider {
  async getSeries(params: {
    symbol: string;
    start: string;
    end: string;
  }): Promise<Bar[]> {
    const startDays = dateToDays(params.start);
    const endDays = dateToDays(params.end);
    const horizon = Math.max(1, endDays - startDays);
    const seed = simpleHash(`${params.symbol}-${params.start}-${params.end}`);
    const regimeSeed = simpleHash(`${params.symbol}-regime-${params.start}`);

    const s0 = [100];
    const priceArrays = generateMultiAssetPrices(s0, seed, horizon + 1, regimeSeed);
    const prices = priceArrays[0] ?? [100];

    const bars: Bar[] = [];
    for (let i = 0; i < prices.length; i++) {
      const d = new Date(startDays * 86400000 + i * 86400000);
      const p = prices[i] ?? 100;
      bars.push({
        date: d.toISOString().slice(0, 10),
        open: p,
        high: p * 1.01,
        low: p * 0.99,
        close: p,
        volume: 1000000,
      });
    }
    return bars;
  }

  async listSymbols(): Promise<SymbolInfo[]> {
    return DEFAULT_SYMBOLS;
  }
}

export const defaultSyntheticProvider = new SyntheticProvider();
