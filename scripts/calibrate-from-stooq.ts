/**
 * One-time calibration from Stooq CSV.
 * Downloads daily data, estimates mu/sigma, writes to data/calibration/.
 *
 * Usage: npx tsx scripts/calibrate-from-stooq.ts ^spx 2019-01-01 2024-12-31
 * Note: Use Stooq symbols: ^spx (S&P 500), spy.us, qqq.us, tlt.us, gld.us
 */

import * as fs from "fs";
import * as path from "path";

const BASE = "https://stooq.com/q/d/l/";

async function fetchCsv(
  symbol: string,
  d1: string,
  d2: string
): Promise<string> {
  const d1s = d1.replace(/-/g, "");
  const d2s = d2.replace(/-/g, "");
  const url = `${BASE}?s=${encodeURIComponent(symbol)}&i=d&d1=${d1s}&d2=${d2s}`;
  const res = await fetch(url, {
    headers: { "User-Agent": "VegaFinancial/1.0" },
  });
  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
  return res.text();
}

function parseCsv(csv: string): { date: string; close: number }[] {
  const lines = csv.trim().split("\n");
  const out: { date: string; close: number }[] = [];
  for (let i = 1; i < lines.length; i++) {
    const [date, , , , close] = lines[i]!.split(",");
    const c = parseFloat(close ?? "0");
    if (date && !isNaN(c)) {
      out.push({
        date: (date ?? "").replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3"),
        close: c,
      });
    }
  }
  return out.reverse();
}

function estimate(series: number[]): { mu: number; sigma: number } {
  const returns: number[] = [];
  for (let i = 1; i < series.length; i++) {
    const prev = series[i - 1];
    if (prev && prev > 0) returns.push((series[i]! - prev) / prev);
  }
  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance =
    returns.reduce((a, r) => a + (r - mean) ** 2, 0) / returns.length;
  return { mu: mean, sigma: Math.sqrt(variance) };
}

async function main() {
  const [symbol, start, end] = process.argv.slice(2);
  if (!symbol || !start || !end) {
    console.error("Usage: npx tsx scripts/calibrate-from-stooq.ts SYMBOL START END");
    console.error("Example: npx tsx scripts/calibrate-from-stooq.ts ^spx 2019-01-01 2024-12-31");
    process.exit(1);
  }

  const csv = await fetchCsv(symbol, start, end);
  const rows = parseCsv(csv);
  const prices = rows.map((r) => r.close);

  if (prices.length < 10) {
    console.error("Not enough data points");
    process.exit(1);
  }

  const { mu, sigma } = estimate(prices);
  const outDir = path.join(process.cwd(), "data", "calibration");
  fs.mkdirSync(outDir, { recursive: true });
  const safeName = symbol.replace(/[^a-z0-9]/gi, "_");
  const file = path.join(outDir, `${safeName}.json`);
  const params = { mu, sigma, symbol, start, end };
  fs.writeFileSync(file, JSON.stringify(params, null, 2));
  console.log("Calibrated:", params);
  console.log("Written to:", file);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
