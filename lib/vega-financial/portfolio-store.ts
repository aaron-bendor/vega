/**
 * Paper portfolio store — client-side state persisted in localStorage.
 * Versioned key for safe schema evolution.
 * Derived maths live in portfolio-selectors; this module persists canonical state only.
 */

import { MOCK_ACCOUNT } from "@/lib/mock/portfolio";
import {
  getHoldingsValue,
  getEquity,
  getHoldingWeightPct,
  getUnrealisedPnlPct,
  assertPortfolioInvariants,
} from "@/lib/vega-financial/portfolio-selectors";

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

/** Sum of allocated amounts (capital invested). Re-exported from portfolio-selectors. */
export { getTotalInvested } from "@/lib/vega-financial/portfolio-selectors";

/** Sum of current market values (holdings value). Re-exported for backward compatibility. */
export function getTotalCurrentValue(holdings: PaperHolding[]): number {
  return getHoldingsValue(holdings);
}

/** Unrealised return % when invested > 0. Second arg ignored; use selectors for consistency. */
export function getTotalReturnPct(holdings: PaperHolding[], totalCurrentValue?: number): number {
  void totalCurrentValue;
  return getUnrealisedPnlPct(holdings);
}

/** One-time seed from MOCK_ACCOUNT when store is empty. Call from client only. */
export function seedFromMockAccountIfEmpty(): void {
  if (typeof window === "undefined") return;
  const raw = localStorage.getItem(PORTFOLIO_STORAGE_KEY);
  if (raw != null && raw !== "") return;
  const now = new Date().toISOString();
  const totalInvested = MOCK_ACCOUNT.holdings.reduce((s, h) => s + h.allocated, 0);
  const holdingsValue = MOCK_ACCOUNT.holdings.reduce((s, h) => s + h.currentValue, 0);
  const startingCash = MOCK_ACCOUNT.availableCash + totalInvested;
  const equity = MOCK_ACCOUNT.availableCash + holdingsValue;
  const holdings: PaperHolding[] = MOCK_ACCOUNT.holdings.map((h) => ({
    id: h.id,
    algorithmId: h.algorithmId,
    name: h.name,
    allocated: h.allocated,
    currentValue: h.currentValue,
    weight: getHoldingWeightPct(h.currentValue, equity),
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
  const state: PortfolioState = {
    ...defaultState,
    startingCash,
    availableCash: MOCK_ACCOUNT.availableCash,
    holdings,
    activityLog,
  };
  if (!assertPortfolioInvariants(state)) return;
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

export type DemoSellResult = DemoAllocationResult | DemoAllocationError;

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
    const totalEquity = getEquity(state.availableCash, state.holdings);
    const existing = state.holdings.find((h) => h.algorithmId === versionId);
    const newAllocated = (existing?.allocated ?? 0) + amount;
    const newCurrentValue = (existing?.currentValue ?? 0) + amount;
    const newHoldings: PaperHolding[] = existing
      ? state.holdings.map((h) =>
          h.algorithmId === versionId
            ? {
                ...h,
                allocated: newAllocated,
                currentValue: newCurrentValue,
                weight: getHoldingWeightPct(newCurrentValue, totalEquity),
              }
            : {
                ...h,
                weight: getHoldingWeightPct(h.currentValue, totalEquity),
              }
        )
      : [
          ...state.holdings.map((h) => ({
            ...h,
            weight: getHoldingWeightPct(h.currentValue, totalEquity),
          })),
          {
            id: `paper-${versionId}-${Date.now()}`,
            algorithmId: versionId,
            name: strategyName,
            allocated: amount,
            currentValue: amount,
            weight: getHoldingWeightPct(amount, totalEquity),
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
    if (!assertPortfolioInvariants(newState)) {
      return {
        success: false,
        error: "Portfolio state would be inconsistent. Please refresh and try again.",
      };
    }
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

/**
 * Perform a demo sell: return cash, reduce or remove holding, append activity.
 * Partial sell uses "reduce"; full exit uses "remove".
 * Does not subtract amount directly from allocated; reduces allocated proportionally.
 */
export function performDemoSell(
  versionId: string,
  amount: number,
  strategyName: string
): DemoSellResult {
  if (typeof window === "undefined") {
    return { success: false, error: "Demo portfolio state is unavailable." };
  }
  try {
    const state = loadPortfolioState();
    if (amount <= 0) {
      return { success: false, error: "Sell amount must be greater than £0." };
    }
    const existing = state.holdings.find((h) => h.algorithmId === versionId);
    if (!existing) {
      return { success: false, error: "You do not hold this strategy in your demo portfolio." };
    }
    if (amount > existing.currentValue) {
      return { success: false, error: "Sell amount cannot exceed your current holding." };
    }

    const soldFraction = amount / existing.currentValue;
    const newAllocated = existing.allocated * (1 - soldFraction);
    const newCurrentValue = existing.currentValue - amount;
    const isFullExit = newCurrentValue < 1e-6; // effectively zero

    const newCash = state.availableCash + amount;
    const activityType: ActivityLogEntry["type"] = isFullExit ? "remove" : "reduce";
    const activityEntry: ActivityLogEntry = {
      id: `act-${Date.now()}`,
      type: activityType,
      algorithmId: versionId,
      algorithmName: strategyName,
      amount,
      previousAmount: existing.allocated,
      at: new Date().toISOString(),
    };

    const newHoldings: PaperHolding[] = isFullExit
      ? state.holdings
          .filter((h) => h.algorithmId !== versionId)
          .map((h) => ({
            ...h,
            weight: 0, // will recompute below
          }))
      : state.holdings.map((h) =>
          h.algorithmId === versionId
            ? {
                ...h,
                allocated: newAllocated,
                currentValue: newCurrentValue,
                returnPct:
                  newAllocated > 0
                    ? ((newCurrentValue - newAllocated) / newAllocated) * 100
                    : 0,
                weight: 0, // will recompute below
              }
            : { ...h, weight: 0 }
        );

    const totalEquity = getEquity(newCash, newHoldings);
    const recomputedHoldings: PaperHolding[] = newHoldings.map((h) => ({
      ...h,
      weight: getHoldingWeightPct(h.currentValue, totalEquity),
    }));

    const newState: PortfolioState = {
      ...state,
      availableCash: newCash,
      holdings: recomputedHoldings,
      activityLog: [...state.activityLog, activityEntry],
    };

    if (!assertPortfolioInvariants(newState)) {
      return {
        success: false,
        error: "Portfolio state would be inconsistent. Please refresh and try again.",
      };
    }
    savePortfolioState(newState);
    return { success: true, newState };
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error("Demo sell error:", err);
    }
    return {
      success: false,
      error: err instanceof Error ? err.message : "Could not complete demo sell. Please try again.",
    };
  }
}
