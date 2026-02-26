import { describe, it, expect } from "vitest";
import { runBacktest } from "../backtest";

describe("determinism", () => {
  const params = {
    versionId: "test-version-123",
    horizon: 252,
    strategyId: "buyAndHold" as const,
    parameters: {},
    startingCapital: 10000,
  };

  it("produces identical results for same seed", () => {
    const r1 = runBacktest(
      params.versionId,
      params.horizon,
      params.strategyId,
      params.parameters,
      params.startingCapital
    );
    const r2 = runBacktest(
      params.versionId,
      params.horizon,
      params.strategyId,
      params.parameters,
      params.startingCapital
    );
    expect(r1.equityPoints.length).toBe(r2.equityPoints.length);
    r1.equityPoints.forEach((p, i) => {
      expect(p.value).toBe(r2.equityPoints[i]!.value);
    });
    expect(r1.metrics.cumulativeReturn).toBe(r2.metrics.cumulativeReturn);
    expect(r1.seed).toBe(r2.seed);
  });

  it("produces different results for different parameters", () => {
    const r1 = runBacktest(
      params.versionId,
      params.horizon,
      "buyAndHold",
      {},
      params.startingCapital
    );
    const r2 = runBacktest(
      params.versionId,
      params.horizon,
      "maCrossover",
      { fastWindow: 10, slowWindow: 30 },
      params.startingCapital
    );
    expect(r1.equityPoints[100]!.value).not.toBe(r2.equityPoints[100]!.value);
  });
});
