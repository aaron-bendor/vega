/**
 * Shared formatting utilities. Single source of truth for display values.
 * British locale, GBP, consistent decimals. Use these everywhere to avoid double signs or inconsistent formatting.
 *
 * - formatPercent: pass decimal (e.g. 0.1233 for 12.33%). Returns e.g. "+12.33%" or "-5.00%".
 *   Contract: callers must pass decimal (0.3059 = 30.59%), not percentage points. A guard treats |value| > 1.5 as points and divides by 100 to avoid 3059%-style bugs.
 * - formatCurrency: pass amount in pounds. Returns e.g. "£12,450.00".
 */

const percentFormatter = new Intl.NumberFormat("en-GB", {
  style: "percent",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  signDisplay: "always",
});

const currencyFormatter = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * Format a decimal as percent (e.g. 0.1233 → "+12.33%").
 * Contract: value must be a decimal (0.3059 for 30.59%), not percentage points.
 * Guard: if |value| > 1.5 we treat it as percentage points and divide by 100 to avoid 3059%-style bugs.
 */
export function formatPercent(value: number): string {
  const decimal = Math.abs(value) > 1.5 ? value / 100 : value;
  return percentFormatter.format(decimal);
}

/** Placeholder when a metric is not available in the demo. Use instead of "—" for trust. */
export const UNAVAILABLE_IN_DEMO = "Unavailable in current demo";

/** Format a number as GBP (e.g. 12450 → "£12,450.00"). */
export function formatCurrency(value: number): string {
  return currencyFormatter.format(value);
}
