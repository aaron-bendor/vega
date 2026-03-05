/**
 * Shared formatting utilities. Single source of truth for display values.
 * British locale, GBP, consistent decimals. Use these everywhere to avoid double signs or inconsistent formatting.
 *
 * - formatPercent: pass decimal (e.g. 0.1233 for 12.33%). Returns e.g. "+12.33%" or "-5.00%".
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

/** Format a decimal as percent (e.g. 0.1233 → "+12.33%"). Value must be decimal, not already a percentage. */
export function formatPercent(value: number): string {
  return percentFormatter.format(value);
}

/** Format a number as GBP (e.g. 12450 → "£12,450.00"). */
export function formatCurrency(value: number): string {
  return currencyFormatter.format(value);
}
