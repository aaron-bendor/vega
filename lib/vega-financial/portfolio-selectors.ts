/**
 * Single source of truth for portfolio-derived maths.
 * All screens must use these selectors only. No duplicated calculations.
 */

import type { PaperHolding, PortfolioState } from "./portfolio-store";

/** Sum of allocated amounts (capital invested). */
export function getTotalInvested(holdings: PaperHolding[]): number {
  return holdings.reduce((sum, h) => sum + h.allocated, 0);
}

/** Sum of current market values (holdings value). */
export function getHoldingsValue(holdings: PaperHolding[]): number {
  return holdings.reduce((sum, h) => sum + h.currentValue, 0);
}

/** Total equity = available cash + holdings value. */
export function getEquity(availableCash: number, holdings: PaperHolding[]): number {
  return availableCash + getHoldingsValue(holdings);
}

/** Unrealised PnL = holdings value − invested. */
export function getUnrealisedPnl(holdings: PaperHolding[]): number {
  return getHoldingsValue(holdings) - getTotalInvested(holdings);
}

/** Unrealised PnL % = (unrealisedPnl / invested) × 100 when invested > 0; else 0. */
export function getUnrealisedPnlPct(holdings: PaperHolding[]): number {
  const invested = getTotalInvested(holdings);
  if (invested <= 0) return 0;
  return (getUnrealisedPnl(holdings) / invested) * 100;
}

/** Weight as % of total portfolio: (currentValue / equity) × 100. Use this definition everywhere; label "% of total portfolio". */
export function getHoldingWeightPct(currentValue: number, equity: number): number {
  if (equity <= 0) return 0;
  return (currentValue / equity) * 100;
}

/** Minimal state needed to compute derived totals. */
export type PortfolioDerivedInput = Pick<PortfolioState, "availableCash" | "holdings">;

/** All derived totals from state. Use this for dashboard and portfolio so numbers never drift. */
export function getPortfolioDerived(state: PortfolioDerivedInput) {
  const invested = getTotalInvested(state.holdings);
  const holdingsValue = getHoldingsValue(state.holdings);
  const equity = getEquity(state.availableCash, state.holdings);
  const unrealisedPnl = getUnrealisedPnl(state.holdings);
  const unrealisedPnlPct = getUnrealisedPnlPct(state.holdings);
  return {
    invested,
    holdingsValue,
    equity,
    unrealisedPnl,
    unrealisedPnlPct,
  };
}

/**
 * Asserts portfolio invariants. Call after seed, load, and every allocation.
 * In development: throws on failure. In production: returns false so caller can block save and surface an error.
 */
export function assertPortfolioInvariants(state: PortfolioState): boolean {
  const holdingsValue = getHoldingsValue(state.holdings);
  const invested = getTotalInvested(state.holdings);
  const equity = getEquity(state.availableCash, state.holdings);
  const unrealisedPnl = getUnrealisedPnl(state.holdings);

  const okEquity = Math.abs(equity - (state.availableCash + holdingsValue)) < 1e-6;
  const okInvested = Math.abs(invested - state.holdings.reduce((s, h) => s + h.allocated, 0)) < 1e-6;
  const okPnl = Math.abs(unrealisedPnl - (holdingsValue - invested)) < 1e-6;
  const okCash = state.availableCash >= 0;
  const okHoldings = state.holdings.every(
    (h) => h.allocated >= 0 && h.currentValue >= 0
  );

  const ok = okEquity && okInvested && okPnl && okCash && okHoldings;
  if (!ok && process.env.NODE_ENV === "development") {
    throw new Error(
      `Portfolio invariants violated: equity=${equity} vs cash+holdings=${state.availableCash + holdingsValue}, invested=${invested}, unrealisedPnl=${unrealisedPnl}, okCash=${okCash}, okHoldings=${okHoldings}`
    );
  }
  return ok;
}
