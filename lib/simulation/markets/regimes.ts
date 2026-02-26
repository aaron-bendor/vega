/**
 * Markov regime switching. Deterministic from seed.
 * 4 states: TREND, RANGE, CRASH, RECOVERY
 */

import type { ScenarioId } from "./scenarios";
import { seededRandom } from "../rng";

const REGIMES: ScenarioId[] = ["TREND", "RANGE", "CRASH", "RECOVERY"];

// Transition matrix: P[next | current]. Row = current, col = next.
// TREND tends to stay; RANGE similar; CRASH -> RECOVERY; RECOVERY -> TREND
const TRANSITION: number[][] = [
  [0.85, 0.08, 0.05, 0.02], // TREND
  [0.1, 0.8, 0.05, 0.05], // RANGE
  [0, 0.05, 0.3, 0.65], // CRASH -> RECOVERY
  [0.4, 0.1, 0.05, 0.45], // RECOVERY
];

export function getRegimeSequence(seed: number, horizon: number): ScenarioId[] {
  const rng = seededRandom(seed);
  const out: ScenarioId[] = [];
  let state = 0; // TREND

  for (let t = 0; t < horizon; t++) {
    out.push(REGIMES[state]!);
    const row = TRANSITION[state]!;
    const u = rng();
    let cum = 0;
    for (let j = 0; j < row.length; j++) {
      cum += row[j]!;
      if (u < cum) {
        state = j;
        break;
      }
    }
  }
  return out;
}
