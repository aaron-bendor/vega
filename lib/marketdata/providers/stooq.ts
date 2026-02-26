/**
 * Stooq daily CSV provider with file caching.
 * Server-side only. https://stooq.com/q/d/l/?s=SYMBOL&i=d&d1=YYYYMMDD&d2=YYYYMMDD
 */

import type { Bar, MarketDataProvider, SymbolInfo } from "../types";
import * as fs from "fs";
import * as path from "path";

const BASE_URL = "https://stooq.com/q/d/l/";
const CACHE_DIR = path.join(process.cwd(), "data", "stooq", "cache");
const MAX_RETRIES = 3;
const RETRY_BASE_MS = 1000;

function normaliseSymbol(symbol: string): string {
  const s = symbol.trim();
  if (s.startsWith("^")) return s.toLowerCase();
  if (s.includes(".")) return s;
  return `${s.toUpperCase()}.US`;
}

export function buildUrl(symbol: string, start: string, end: string): string {
  const d1 = start.replace(/-/g, "");
  const d2 = end.replace(/-/g, "");
  const sym = normaliseSymbol(symbol);
  const params = new URLSearchParams({
    s: sym,
    i: "d",
    d1,
    d2,
  });
  return `${BASE_URL}?${params.toString()}`;
}

function cacheKey(symbol: string, start: string, end: string): string {
  const d1 = start.replace(/-/g, "");
  const d2 = end.replace(/-/g, "");
  const sym = normaliseSymbol(symbol).replace(/[^a-z0-9]/gi, "_");
  return `${sym}_${d1}_${d2}`;
}

function cachePath(key: string): string {
  return path.join(CACHE_DIR, `${key}.json`);
}

function lockPath(key: string): string {
  return path.join(CACHE_DIR, `${key}.lock`);
}

function parseStooqCsv(csv: string): Bar[] {
  const lines = csv.trim().split("\n");
  if (lines.length < 2) return [];

  const bars: Bar[] = [];
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i]!.split(",");
    if (parts.length < 5) continue;
    const [date, open, high, low, close, vol] = parts;
    const c = parseFloat(close ?? "NaN");
    if (isNaN(c) || c <= 0) continue;
    const o = parseFloat(open ?? "0");
    const h = parseFloat(high ?? "0");
    const l = parseFloat(low ?? "0");
    const d = (date ?? "").trim();
    const dateStr = /^\d{4}-\d{2}-\d{2}$/.test(d)
      ? d
      : d.replace(/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) continue;
    bars.push({
      date: dateStr,
      open: isNaN(o) ? c : o,
      high: isNaN(h) || h <= 0 ? c : h,
      low: isNaN(l) || l <= 0 ? c : l,
      close: c,
      volume: vol && !isNaN(parseInt(vol, 10)) ? parseInt(vol, 10) : undefined,
    });
  }
  bars.sort((a, b) => a.date.localeCompare(b.date));
  return bars;
}

let mutex: Promise<unknown> = Promise.resolve();

async function withMutex<T>(fn: () => Promise<T>): Promise<T> {
  const prev = mutex;
  let resolveMutex: () => void = () => {};
  mutex = new Promise<void>((r) => { resolveMutex = r; });
  await prev;
  try {
    return await fn();
  } finally {
    resolveMutex();
  }
}

function jitter(ms: number): number {
  return ms + Math.floor(Math.random() * ms * 0.3);
}

async function fetchWithRetry(url: string): Promise<string> {
  let lastErr: Error | null = null;
  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "VegaFinancial/1.0 (University Prototype)" },
      });
      if (!res.ok) throw new Error(`Stooq fetch failed: ${res.status} ${res.statusText}`);
      return await res.text();
    } catch (e) {
      lastErr = e instanceof Error ? e : new Error(String(e));
      if (i < MAX_RETRIES - 1) {
        await new Promise((r) => setTimeout(r, jitter(RETRY_BASE_MS * 2 ** i)));
      }
    }
  }
  throw lastErr ?? new Error("Stooq fetch failed");
}

export async function downloadCsv(
  symbol: string,
  start: string,
  end: string
): Promise<Bar[]> {
  const url = buildUrl(symbol, start, end);
  const csv = await fetchWithRetry(url);
  return parseStooqCsv(csv);
}

const LOCK_POLL_MS = 200;
const LOCK_TIMEOUT_MS = 30000;

async function waitForLockRelease(lockPathFile: string): Promise<boolean> {
  const deadline = Date.now() + LOCK_TIMEOUT_MS;
  while (Date.now() < deadline) {
    try {
      fs.accessSync(lockPathFile);
    } catch {
      return true;
    }
    await new Promise((r) => setTimeout(r, LOCK_POLL_MS));
  }
  return false;
}

export async function getStooqBars(
  symbol: string,
  start: string,
  end: string
): Promise<Bar[]> {
  const key = cacheKey(symbol, start, end);
  const filePath = cachePath(key);
  const lockPathFile = lockPath(key);

  fs.mkdirSync(CACHE_DIR, { recursive: true });

  try {
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw) as Bar[];
  } catch {
    /* cache miss */
  }

  return withMutex(async () => {
    const released = await waitForLockRelease(lockPathFile);
    if (released) {
      try {
        const raw = fs.readFileSync(filePath, "utf8");
        return JSON.parse(raw) as Bar[];
      } catch {
        /* proceed to download */
      }
    }

    try {
      fs.writeFileSync(lockPathFile, Date.now().toString());
    } catch {
      /* ignore */
    }

    try {
      const bars = await downloadCsv(symbol, start, end);
      fs.writeFileSync(filePath, JSON.stringify(bars));
      return bars;
    } finally {
      try {
        fs.unlinkSync(lockPathFile);
      } catch {
        /* ignore */
      }
    }
  });
}

export function listCachedFiles(): {
  key: string;
  symbol: string;
  d1: string;
  d2: string;
  bars: number;
  lastUpdated: string;
}[] {
  const out: { key: string; symbol: string; d1: string; d2: string; bars: number; lastUpdated: string }[] = [];
  try {
    const files = fs.readdirSync(CACHE_DIR);
    for (const f of files) {
      if (!f.endsWith(".json")) continue;
      const key = f.replace(".json", "");
      const fullPath = path.join(CACHE_DIR, f);
      try {
        const stat = fs.statSync(fullPath);
        const raw = fs.readFileSync(fullPath, "utf8");
        const bars = JSON.parse(raw) as Bar[];
        const m = key.match(/^(.+)_(\d{8})_(\d{8})$/);
        const symPart = m?.[1] ?? key;
        const symbol =
          symPart.startsWith("_") && !symPart.includes(".")
            ? "^" + symPart.slice(1)
            : symPart.replace(/_/g, ".");
        out.push({
          key,
          symbol,
          d1: m?.[2] ?? "",
          d2: m?.[3] ?? "",
          bars: bars.length,
          lastUpdated: stat.mtime.toISOString(),
        });
      } catch {
        /* skip corrupt */
      }
    }
  } catch {
    /* no cache dir */
  }
  return out;
}

export const DEFAULT_SYMBOLS: SymbolInfo[] = [
  { symbol: "^spx", name: "S&P 500 Index", assetClass: "index" },
  { symbol: "spy.us", name: "S&P 500 ETF", assetClass: "etf" },
  { symbol: "qqq.us", name: "Nasdaq-100 ETF", assetClass: "etf" },
  { symbol: "tlt.us", name: "US Treasury ETF", assetClass: "etf" },
  { symbol: "gld.us", name: "Gold ETF", assetClass: "etf" },
];

export class StooqCsvProvider implements MarketDataProvider {
  async getSeries(params: {
    symbol: string;
    start: string;
    end: string;
    timeframe?: string;
  }): Promise<Bar[]> {
    return getStooqBars(params.symbol, params.start, params.end);
  }

  async listSymbols(): Promise<SymbolInfo[]> {
    return DEFAULT_SYMBOLS;
  }
}
