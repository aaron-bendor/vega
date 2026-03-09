/**
 * Step/progress logic for GoldSilverExplainer animation.
 * Pure helpers with no React dependency — testable for regression.
 */

const N = 120;

const STEP_RANGES = [
  { start: 0, end: 50 },
  { start: 51, end: 51 },
  { start: 52, end: 87 },
  { start: 88, end: N - 1 },
];

export const GOLD_SILVER_N = N;

/** Which step 0..3 corresponds to a given revealed index. */
export function getStepForIndex(index: number): number {
  for (let s = 0; s < STEP_RANGES.length; s++) {
    if (index >= STEP_RANGES[s].start && index <= STEP_RANGES[s].end) return s;
  }
  return 0;
}

export interface StepSnapshot {
  revealedTo: number;
  currentStep: number;
  showTradeAnno: boolean;
}

/** Consistent snapshot for a given step (tab clicks, reset-to-step). */
export function getStepSnapshot(step: number): StepSnapshot {
  if (step < 0 || step > 3) {
    return { revealedTo: 0, currentStep: 0, showTradeAnno: false };
  }
  const end = STEP_RANGES[step].end;
  return {
    revealedTo: end,
    currentStep: step,
    showTradeAnno: step >= 2,
  };
}
