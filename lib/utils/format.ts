/**
 * Formatting utilities for display values.
 */
export function formatPercent(value: number): string {
  return `${(value * 100).toFixed(2)}%`;
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
}
