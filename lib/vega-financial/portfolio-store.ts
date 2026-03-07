/**
 * Paper portfolio store — client-side state persisted in localStorage.
 * Versioned key for safe schema evolution.
 */

import { MOCK_ACCOUNT } from "@/lib/mock/portfolio";

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

function migrateHoldings(holdings: unknown): PaperHolding[] {
  if (!Array.isArray(holdings)) return defaultState.holdings;
  const now = new Date().toISOString();
  return (holdings as PaperHolding[]).map((h) => ({
    ...h,
    addedAt: typeof (h as PaperHolding & { addedAt?: string }).addedAt === "string"
      ? (h as PaperHolding).addedAt
      : now,
  }));
}

function migrate(state: unknown): PortfolioState {
  if (!state || typeof state !== "object") return defaultState;
  const s = state as Record<string, unknown>;
  return {
    startingCash: typeof s.startingCash === "number" ? s.startingCash : defaultState.startingCash,
    availableCash: typeof s.availableCash === "number" ? s.availableCash : defaultState.availableCash,
    holdings: migrateHoldings(s.holdings),
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

export const PORTFOLIO_UPDATED_EVENT = "vega-portfolio-updated";

export function savePortfolioState(state: PortfolioState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent(PORTFOLIO_UPDATED_EVENT));
  } catch {
    // ignore quota or security errors
  }
}

export function subscribePortfolioUpdate(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = () => callback();
  window.addEventListener(PORTFOLIO_UPDATED_EVENT, handler);
  return () => window.removeEventListener(PORTFOLIO_UPDATED_EVENT, handler);
}

/** Sum of allocated amounts (capital invested). */
export function getTotalInvested(holdings: PaperHolding[]): number {
  return holdings.reduce((sum, h) => sum + h.allocated, 0);
}

/** Sum of current market values. */
export function getTotalCurrentValue(holdings: PaperHolding[]): number {
  return holdings.reduce((sum, h) => sum + h.currentValue, 0);
}

/** Unrealised return % = (totalCurrentValue - totalInvested) / totalInvested * 100 when invested > 0. */
export function getTotalReturnPct(holdings: PaperHolding[], totalCurrentValue: number): number {
  if (totalCurrentValue <= 0) return 0;
  const totalInvested = getTotalInvested(holdings);
  if (totalInvested <= 0) return 0;
  return ((totalCurrentValue - totalInvested) / totalInvested) * 100;
}

/** One-time seed from MOCK_ACCOUNT when store is empty. Call from client only. */
export function seedFromMockAccountIfEmpty(): void {
  if (typeof window === "undefined") return;
  const raw = localStorage.getItem(PORTFOLIO_STORAGE_KEY);
  if (raw != null && raw !== "") return;
  const now = new Date().toISOString();
  const holdings: PaperHolding[] = MOCK_ACCOUNT.holdings.map((h) => ({
    id: h.id,
    algorithmId: h.algorithmId,
    name: h.name,
    allocated: h.allocated,
    currentValue: h.currentValue,
    weight: h.weight,
    returnPct: h.returnPct,
    tags: h.tags ?? [],
    addedAt: now,
  }));
  const activityLog: ActivityLogEntry[] = MOCK_ACCOUNT.holdings.map((h, i) => ({
    id: `seed-${i}`,
    type: "allocate" as const,
    algorithmId: h.algorithmId,
    algorithmName: h.name,
    amount: h.allocated,
    at: now,
  }));
  const totalInvested = holdings.reduce((s, h) => s + h.allocated, 0);
  const startingCash = MOCK_ACCOUNT.availableCash + totalInvested;
  const state: PortfolioState = {
    ...defaultState,
    startingCash,
    availableCash: MOCK_ACCOUNT.availableCash,
    holdings,
    activityLog,
  };
  savePortfolioState(state);
}

export interface DemoAllocationResult {
  success: true;
  newState: PortfolioState;
}

export interface DemoAllocationError {
  success: false;
  error: string;
}

/**
 * Perform a demo allocation locally: deduct cash, add/update holding, append activity.
 * Does not call any API. Use for investor paper-trading only.
 */
export function performDemoAllocation(
  versionId: string,
  amount: number,
  strategyName: string
): DemoAllocationResult | DemoAllocationError {
  if (typeof window === "undefined") {
    return { success: false, error: "Demo portfolio state is unavailable." };
  }
  try {
    const state = loadPortfolioState();
    if (amount <= 0 || amount > state.availableCash) {
      return { success: false, error: "Allocation exceeds available demo cash." };
    }
    const totalCurrentValue = getTotalCurrentValue(state.holdings);
    const totalEquity = state.availableCash + totalCurrentValue;
    const existing = state.holdings.find((h) => h.algorithmId === versionId);
    const newAllocated = (existing?.allocated ?? 0) + amount;
    const newCurrentValue = (existing?.currentValue ?? 0) + amount;
    const newTotalEquity = totalEquity;
    const newHoldings: PaperHolding[] = existing
      ? state.holdings.map((h) =>
          h.algorithmId === versionId
            ? {
                ...h,
                allocated: newAllocated,
                currentValue: newCurrentValue,
                weight: newTotalEquity > 0 ? (newCurrentValue / newTotalEquity) * 100 : 0,
              }
            : {
                ...h,
                weight: newTotalEquity > 0 ? (h.currentValue / newTotalEquity) * 100 : 0,
              }
        )
      : [
          ...state.holdings.map((h) => ({
            ...h,
            weight: newTotalEquity > 0 ? (h.currentValue / newTotalEquity) * 100 : 0,
          })),
          {
            id: `paper-${versionId}-${Date.now()}`,
            algorithmId: versionId,
            name: strategyName,
            allocated: amount,
            currentValue: amount,
            weight: newTotalEquity > 0 ? (amount / newTotalEquity) * 100 : 0,
            returnPct: 0,
            tags: [],
            addedAt: new Date().toISOString(),
          },
        ];
    const newCash = Math.max(0, state.availableCash - amount);
    const activityEntry: ActivityLogEntry = {
      id: `act-${Date.now()}`,
      type: "allocate",
      algorithmId: versionId,
      algorithmName: strategyName,
      amount,
      at: new Date().toISOString(),
    };
    const newState: PortfolioState = {
      ...state,
      availableCash: newCash,
      holdings: newHoldings,
      activityLog: [...state.activityLog, activityEntry],
    };
    savePortfolioState(newState);
    return { success: true, newState };
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error("Demo allocation error:", err);
    }
    return {
      success: false,
      error: err instanceof Error ? err.message : "Could not complete demo allocation. Please try again.",
    };
  }
}
