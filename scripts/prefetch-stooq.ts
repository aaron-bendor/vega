#!/usr/bin/env npx tsx
/**
 * Prefetch Stooq daily CSV data and cache locally.
 * Usage: npx tsx scripts/prefetch-stooq.ts --symbols "^spx,spy.us" --start 2019-01-01 --end 2024-12-31
 * PORT env var and --baseUrl are unused (script runs standalone); use for consistency.
 */

import * as path from "path";
import { getStooqBars } from "../lib/marketdata/providers/stooq";

function parseArgs(): { symbols: string[]; start: string; end: string } {
  const args = process.argv.slice(2);
  let symbols: string[] = ["^spx", "spy.us", "qqq.us", "tlt.us", "gld.us"];
  let start = "2019-01-01";
  let end = "2024-12-31";

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--symbols" && args[i + 1]) {
      symbols = args[++i]!.split(",").map((s) => s.trim()).filter(Boolean);
    } else if (args[i] === "--start" && args[i + 1]) {
      start = args[++i]!;
    } else if (args[i] === "--end" && args[i + 1]) {
      end = args[++i]!;
    }
  }

  return { symbols, start, end };
}

async function main() {
  const { symbols, start, end } = parseArgs();
  console.log(`Prefetching Stooq: ${symbols.join(", ")} | ${start} → ${end}\n`);

  const cacheDir = path.join(process.cwd(), "data", "stooq", "cache");
  const rows: { symbol: string; bars: number; path: string }[] = [];

  for (const symbol of symbols) {
    try {
      const bars = await getStooqBars(symbol, start, end);
      const safe = symbol.replace(/[^a-z0-9]/gi, "_");
      const d1 = start.replace(/-/g, "");
      const d2 = end.replace(/-/g, "");
      const key = `${safe}_${d1}_${d2}.json`;
      const filePath = path.join(cacheDir, key);
      rows.push({ symbol, bars: bars.length, path: filePath });
      console.log(`  ${symbol}: ${bars.length} bars → ${filePath}`);
    } catch (err) {
      console.error(`  ${symbol}: FAILED -`, err instanceof Error ? err.message : err);
    }
  }

  console.log("\n--- Summary ---");
  console.table(rows);
  console.log(`Cache directory: ${cacheDir}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
