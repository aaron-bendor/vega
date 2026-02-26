/**
 * Calibration: estimate μ, σ, correlation from Bar[].
 * Writes to data/calibration/*.json for SyntheticProvider.
 */

import type { Bar } from "@/lib/marketdata/types";
import * as fs from "fs";
import * as path from "path";

export interface CalibratedParams {
  mu: number;
  sigma: number;
  correlation?: number[][];
  symbol?: string;
  start?: string;
  end?: string;
}

export function estimateFromBars(bars: Bar[]): { mu: number; sigma: number } {
  if (bars.length < 2) return { mu: 0, sigma: 0.2 };
  const returns: number[] = [];
  for (let i = 1; i < bars.length; i++) {
    const prev = bars[i - 1]!.close;
    if (prev > 0) returns.push((bars[i]!.close - prev) / prev);
  }
  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance =
    returns.reduce((a, r) => a + (r - mean) ** 2, 0) / returns.length;
  return {
    mu: mean,
    sigma: Math.sqrt(variance),
  };
}

export function estimateCorrelation(
  series: number[][]
): number[][] {
  const n = series.length;
  if (n === 0) return [];
  const len = Math.min(...series.map((s) => s.length));
  if (len < 2) return [];

  const returns = series.map((p) => {
    const r: number[] = [];
    for (let i = 1; i < len; i++) {
      const prev = p[i - 1];
      r.push(prev && prev > 0 ? (p[i]! - prev) / prev : 0);
    }
    return r;
  });

  const corr: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    corr[i]![i] = 1;
    for (let j = i + 1; j < n; j++) {
      const ri = returns[i]!;
      const rj = returns[j]!;
      const mui = ri.reduce((a, b) => a + b, 0) / ri.length;
      const muj = rj.reduce((a, b) => a + b, 0) / rj.length;
      let cov = 0;
      let vi = 0;
      let vj = 0;
      for (let k = 0; k < ri.length; k++) {
        const di = (ri[k] ?? 0) - mui;
        const dj = (rj[k] ?? 0) - muj;
        cov += di * dj;
        vi += di * di;
        vj += dj * dj;
      }
      const c = vi > 0 && vj > 0 ? cov / Math.sqrt(vi * vj) : 0;
      corr[i]![j] = c;
      corr[j]![i] = c;
    }
  }
  return corr;
}

export function writeCalibration(
  dir: string,
  symbol: string,
  params: CalibratedParams
): void {
  const outDir = path.join(process.cwd(), dir);
  fs.mkdirSync(outDir, { recursive: true });
  const file = path.join(outDir, `${symbol.replace(/[^a-z0-9]/gi, "_")}.json`);
  fs.writeFileSync(file, JSON.stringify(params, null, 2));
}
