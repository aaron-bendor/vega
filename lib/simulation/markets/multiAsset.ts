/**
 * Multi-asset price generation with correlated shocks.
 * Cholesky of fixed correlation matrix. 3 synthetic assets.
 */

import type { ScenarioId } from "./scenarios";
import { SCENARIOS } from "./scenarios";
import { getRegimeSequence } from "./regimes";
import { boxMuller, seededRandom } from "../rng";

const CORR: number[][] = [
  [1, 0.5, 0.3],
  [0.5, 1, 0.4],
  [0.3, 0.4, 1],
];

function cholesky(A: number[][]): number[][] {
  const n = A.length;
  const L: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j <= i; j++) {
      let sum = 0;
      for (let k = 0; k < j; k++) sum += L[i]![k]! * L[j]![k]!;
      if (i === j) {
        L[i]![j] = Math.sqrt(Math.max(0, A[i]![i]! - sum));
      } else {
        L[i]![j] = (A[i]![j]! - sum) / (L[j]![j]! || 1);
      }
    }
  }
  return L;
}

const L = cholesky(CORR);
const dt = 1 / 252;

export function generateMultiAssetPrices(
  s0: number[],
  seed: number,
  horizon: number,
  regimeSeed: number
): number[][] {
  const nAssets = Math.min(3, s0.length);
  const rng = boxMuller(seededRandom(seed));
  const regimes = getRegimeSequence(regimeSeed, horizon);

  const prices: number[][] = s0.slice(0, nAssets).map((s) => [s]);

  for (let t = 0; t < horizon - 1; t++) {
    const regime = regimes[t] as ScenarioId;
    const sc = SCENARIOS[regime]!;

    const e = Array.from({ length: nAssets }, () => rng());
    const z: number[] = [];
    for (let i = 0; i < nAssets; i++) {
      z[i] = L[i]!.reduce((s, l, k) => s + l * (e[k] ?? 0), 0);
    }

    for (let i = 0; i < nAssets; i++) {
      const drift = (sc.mu - 0.5 * sc.sigma ** 2) * dt;
      const diff = sc.sigma * Math.sqrt(dt);
      const ret = drift + diff * (z[i] ?? 0);
      prices[i]!.push(prices[i]![t]! * Math.exp(ret));
    }
  }
  return prices;
}
