/**
 * Paper portfolio store — client-side state persisted in localStorage.
 * Versioned key for safe schema evolution.
 */

export const PORTFOLIO_STORAGE_KEY = "vega_portfolio_v1";

export type RiskPreference = "conservative" | "balanced" | "adventurous";

export interface PaperHolding {
  id: string;
  algorithmId: string;
  name: string;
  allocated: number;
  /** Simulated current value (e.g. from backtest end or scaled). */
  currentValue: number;
  weight: number;
  returnPct: number;
  tags: string[];
  /** When this allocation was added (ISO string). */
  addedAt: string;
}

export interface ActivityLogEntry {
  id: string;
  type: "allocate" | "reduce" | "remove";
  algorithmId: string;
  algorithmName: string;
  amount: number;
  /** For reduce/remove, previous allocated. */
  previousAmount?: number;
  at: string;
}

export interface PortfolioState {
  /** Starting virtual cash for the demo. */
  startingCash: number;
  availableCash: number;
  holdings: PaperHolding[];
  watchlist: string[];
  activityLog: ActivityLogEntry[];
  onboardingCompleted: boolean;
  beginnerMode: boolean;
  riskPreference: RiskPreference;
  /** Up to 3 strategy ids for compare mode. */
  compareSelection: string[];
  /** Step index or "done". */
  tutorialState: number | "done";
}

const DEFAULT_STARTING_CASH = 100_000;

const defaultState: PortfolioState = {
  startingCash: DEFAULT_STARTING_CASH,
  availableCash: DEFAULT_STARTING_CASH,
  holdings: [],
  watchlist: [],
  activityLog: [],
  onboardingCompleted: false,
  beginnerMode: true,
  riskPreference: "balanced",
  compareSelection: [],
  tutorialState: 0,
};

function safeParse<T>(json: string, fallback: T): T {
  try {
    const parsed = JSON.parse(json) as T;
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function migrate(state: unknown): PortfolioState {
  if (!state || typeof state !== "object") return defaultState;
  const s = state as Record<string, unknown>;
  return {
    startingCash: typeof s.startingCash === "number" ? s.startingCash : defaultState.startingCash,
    availableCash: typeof s.availableCash === "number" ? s.availableCash : defaultState.availableCash,
    holdings: Array.isArray(s.holdings) ? (s.holdings as PaperHolding[]) : defaultState.holdings,
    watchlist: Array.isArray(s.watchlist) ? (s.watchlist as string[]) : defaultState.watchlist,
    activityLog: Array.isArray(s.activityLog) ? (s.activityLog as ActivityLogEntry[]) : defaultState.activityLog,
    onboardingCompleted: s.onboardingCompleted === true,
    beginnerMode: s.beginnerMode !== false,
    riskPreference: ["conservative", "balanced", "adventurous"].includes(s.riskPreference as string)
      ? (s.riskPreference as RiskPreference)
      : defaultState.riskPreference,
    compareSelection: Array.isArray(s.compareSelection) ? (s.compareSelection as string[]) : defaultState.compareSelection,
    tutorialState: typeof s.tutorialState === "number" || s.tutorialState === "done"
      ? (s.tutorialState as number | "done")
      : defaultState.tutorialState,
  };
}

export function loadPortfolioState(): PortfolioState {
  if (typeof window === "undefined") return defaultState;
  try {
    const raw = localStorage.getItem(PORTFOLIO_STORAGE_KEY);
    if (!raw) return defaultState;
    return migrate(safeParse(raw, defaultState));
  } catch {
    return defaultState;
  }
}

export function savePortfolioState(state: PortfolioState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore quota or security errors
  }
}

export function getTotalAllocated(holdings: PaperHolding[]): number {
  return holdings.reduce((sum, h) => sum + h.currentValue, 0);
}

export function getTotalReturnPct(holdings: PaperHolding[], totalAllocated: number): number {
  if (totalAllocated <= 0) return 0;
  const totalInvested = holdings.reduce((s, h) => s + h.allocated, 0);
  if (totalInvested <= 0) return 0;
  return ((totalAllocated - totalInvested) / totalInvested) * 100;
}
