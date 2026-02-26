import { describe, it, expect } from "vitest";
import { runBacktestV2 } from "../backtestV2";

describe("runBacktestV2", () => {
  const baseInput = {
    templateId: "buy_and_hold",
    params: {},
    horizon: 252,
    startingCapital: 10000,
  };

  it("is deterministic: same inputs produce identical equity curve", () => {
    const r1 = runBacktestV2({ ...baseInput, versionId: "test-1" });
    const r2 = runBacktestV2({ ...baseInput, versionId: "test-1" });
    expect(r1.equityPoints.length).toBe(r2.equityPoints.length);
    r1.equityPoints.forEach((p, i) => {
      expect(p.value).toBe(r2.equityPoints[i]!.value);
    });
    expect(r1.seed).toBe(r2.seed);
  });

  it("exposures are in [0, 1]: equity never negative", () => {
    const r = runBacktestV2(baseInput);
    r.equityPoints.forEach((p) => {
      expect(p.value).toBeGreaterThanOrEqual(0);
    });
  });

  it("metrics are finite when defined, no NaNs", () => {
    const r = runBacktestV2(baseInput);
    expect(Number.isFinite(r.metrics.cumulativeReturn)).toBe(true);
    expect(
      r.metrics.sharpeRatio === null || Number.isFinite(r.metrics.sharpeRatio)
    ).toBe(true);
    expect(Number.isFinite(r.metrics.maxDrawdown)).toBe(true);
    expect(Number.isFinite(r.metrics.annualisedVolatility)).toBe(true);
    expect(Number.isNaN(r.metrics.cumulativeReturn)).toBe(false);
    expect(r.metrics.sharpeRatio === null || !Number.isNaN(r.metrics.sharpeRatio)).toBe(true);
    expect(Number.isNaN(r.metrics.maxDrawdown)).toBe(false);
  });

  it("different templateIds produce different results", () => {
    const r1 = runBacktestV2({
      ...baseInput,
      templateId: "buy_and_hold",
      versionId: "t1",
    });
    const r2 = runBacktestV2({
      ...baseInput,
      templateId: "ma_crossover",
      params: { fastWindow: 10, slowWindow: 30 },
      versionId: "t2",
    });
    expect(r1.equityPoints[100]!.value).not.toBe(r2.equityPoints[100]!.value);
  });
});
