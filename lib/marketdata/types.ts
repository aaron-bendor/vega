/**
 * Market data provider abstraction.
 * Pure types, no side effects.
 */

export interface Bar {
  date: string; // YYYY-MM-DD
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export interface SymbolInfo {
  symbol: string;
  name: string;
  assetClass: string;
}

export type Timeframe = "d" | "w"; // daily, weekly

export interface GetSeriesParams {
  symbol: string;
  start: string; // YYYY-MM-DD
  end: string; // YYYY-MM-DD
  timeframe?: Timeframe;
}

export interface MarketDataProvider {
  getSeries(params: GetSeriesParams): Promise<Bar[]>;
  listSymbols(): Promise<SymbolInfo[]>;
}
