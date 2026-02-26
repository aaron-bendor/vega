import { describe, it, expect } from "vitest";
import { computeMetrics } from "../metrics";

describe("computeMetrics", () => {
  it("returns zero metrics for single point", () => {
    const m = computeMetrics([100]);
    expect(m.cumulativeReturn).toBe(0);
    expect(m.sharpeRatio).toBeNull();
    expect(m.maxDrawdown).toBe(0);
    expect(m.annualisedVolatility).toBe(0);
  });

  it("computes cumulative return correctly", () => {
    const m = computeMetrics([100, 110]);
    expect(m.cumulativeReturn).toBeCloseTo(0.1, 4);
  });

  it("computes max drawdown correctly", () => {
    const m = computeMetrics([100, 120, 90, 100]);
    expect(m.maxDrawdown).toBeLessThanOrEqual(0);
    expect(m.maxDrawdown).toBeCloseTo((90 / 120) - 1, 4);
  });

  it("returns null Sharpe for flat series (zero vol)", () => {
    const m = computeMetrics([100, 100, 100, 100]);
    expect(m.sharpeRatio).toBeNull();
  });
});
