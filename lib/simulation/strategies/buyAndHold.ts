/**
 * Buy-and-hold strategy: always fully invested.
 */

import type { PriceSeries } from "../types";

export function buyAndHold(_prices: PriceSeries): number[] {
  return _prices.prices.map(() => 1);
}
