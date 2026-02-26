#!/usr/bin/env npx tsx
/**
 * Precompute headline backtests for demo algorithms.
 * Writes to data/demo/runs/*.json. Run after stooq:prefetch.
 */

import * as fs from "fs";
import * as path from "path";
import type { Bar } from "../lib/marketdata/types";
import { loadDemoAlgorithms } from "../lib/demo/loader";
import { getStooqBars } from "../lib/marketdata/providers/stooq";
import { runBacktestV2 } from "../lib/simulation/backtestV2";

const RUNS_DIR = path.join(process.cwd(), "data", "demo", "runs");

async function main() {
  fs.mkdirSync(RUNS_DIR, { recursive: true });
  const algos = loadDemoAlgorithms();

  for (const algo of algos) {
    const symbol = algo.symbols?.[0] ?? "^spx";
    const start = algo.startDate ?? "2019-01-01";
    const end = algo.endDate ?? "2024-12-31";

    let bars: Bar[];
    try {
      bars = await getStooqBars(symbol, start, end);
    } catch (err) {
      console.warn(`${algo.id}: Stooq fetch failed, using synthetic:`, err instanceof Error ? err.message : err);
      bars = [];
    }

    const result = runBacktestV2({
      versionId: algo.id,
      templateId: algo.templateId,
      params: algo.defaultParams ?? {},
      startingCapital: 10000,
      priceBars: bars.length > 0 ? bars : undefined,
      horizon: bars.length > 0 ? undefined : 252,
    });

    const run = {
      metrics: result.metrics,
      equityPoints: result.equityPoints,
    };
    const outPath = path.join(RUNS_DIR, `${algo.id}.json`);
    fs.writeFileSync(outPath, JSON.stringify(run));
    console.log(`${algo.id}: ${result.equityPoints.length} points → ${outPath}`);
  }

  console.log("\nDone. Demo algo pages will use these precomputed runs when DB is unavailable.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
