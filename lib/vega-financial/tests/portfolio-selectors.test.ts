import { describe, it, expect } from "vitest";
import {
  getTotalInvested,
  getHoldingsValue,
  getEquity,
  getUnrealisedPnl,
  getUnrealisedPnlPct,
  getHoldingWeightPct,
  getPortfolioDerived,
  assertPortfolioInvariants,
} from "../portfolio-selectors";
import type { PaperHolding, PortfolioState } from "../portfolio-store";

function holding(
  id: string,
  allocated: number,
  currentValue: number
): PaperHolding {
  return {
    id,
    algorithmId: id,
    name: id,
    allocated,
    currentValue,
    weight: 0,
    returnPct: 0,
    tags: [],
    addedAt: new Date().toISOString(),
  };
}

describe("portfolio-selectors", () => {
  describe("getTotalInvested", () => {
    it("sums allocated of all holdings", () => {
      const holdings: PaperHolding[] = [
        holding("1", 1000, 1100),
        holding("2", 2000, 1900),
      ];
      expect(getTotalInvested(holdings)).toBe(3000);
    });
    it("returns 0 for empty holdings", () => {
      expect(getTotalInvested([])).toBe(0);
    });
  });

  describe("getHoldingsValue", () => {
    it("sums currentValue of all holdings", () => {
      const holdings: PaperHolding[] = [
        holding("1", 1000, 1100),
        holding("2", 2000, 1900),
      ];
      expect(getHoldingsValue(holdings)).toBe(3000);
    });
  });

  describe("getEquity", () => {
    it("returns availableCash + holdings value", () => {
      const holdings: PaperHolding[] = [
        holding("1", 1000, 1100),
        holding("2", 2000, 1900),
      ];
      expect(getEquity(500, holdings)).toBe(500 + 3000);
    });
  });

  describe("getUnrealisedPnl", () => {
    it("returns holdings value minus invested", () => {
      const holdings: PaperHolding[] = [
        holding("1", 1000, 1100),
        holding("2", 2000, 1900),
      ];
      expect(getUnrealisedPnl(holdings)).toBe(3000 - 3000);
    });
    it("positive when holdings gained", () => {
      const holdings: PaperHolding[] = [holding("1", 1000, 1500)];
      expect(getUnrealisedPnl(holdings)).toBe(500);
    });
  });

  describe("getUnrealisedPnlPct", () => {
    it("returns 0 when invested is 0", () => {
      expect(getUnrealisedPnlPct([])).toBe(0);
    });
    it("returns (unrealisedPnl / invested) * 100 when invested > 0", () => {
      const holdings: PaperHolding[] = [holding("1", 10_000, 12_452)];
      expect(getUnrealisedPnlPct(holdings)).toBeCloseTo(24.52, 1);
    });
  });

  describe("getHoldingWeightPct", () => {
    it("returns (currentValue / equity) * 100", () => {
      expect(getHoldingWeightPct(16_850, 64_902)).toBeCloseTo(25.96, 1);
    });
    it("returns 0 when equity is 0", () => {
      expect(getHoldingWeightPct(100, 0)).toBe(0);
    });
  });

  describe("getPortfolioDerived", () => {
    it("returns same numbers as individual selectors and satisfies equity = cash + holdingsValue, unrealisedPnl = holdingsValue - invested", () => {
      const state: PortfolioState = {
        startingCash: 52_450,
        availableCash: 12_450,
        holdings: [
          holding("1", 15_000, 16_850),
          holding("2", 10_000, 15_749),
          holding("3", 15_000, 19_853),
        ],
        watchlist: [],
        activityLog: [],
        onboardingCompleted: false,
        beginnerMode: true,
        riskPreference: "balanced",
        compareSelection: [],
        tutorialState: 0,
      };
      const d = getPortfolioDerived(state);
      expect(d.invested).toBe(40_000);
      expect(d.holdingsValue).toBe(52_452);
      expect(d.equity).toBe(64_902);
      expect(d.unrealisedPnl).toBe(12_452);
      expect(d.unrealisedPnlPct).toBeCloseTo(31.13, 1);
      expect(d.equity).toBe(d.holdingsValue + state.availableCash);
      expect(d.unrealisedPnl).toBe(d.holdingsValue - d.invested);
    });
  });

  describe("assertPortfolioInvariants", () => {
    it("returns true for reconciled state", () => {
      const state: PortfolioState = {
        startingCash: 52_450,
        availableCash: 12_450,
        holdings: [
          holding("1", 15_000, 16_850),
          holding("2", 10_000, 15_749),
          holding("3", 15_000, 19_853),
        ],
        watchlist: [],
        activityLog: [],
        onboardingCompleted: false,
        beginnerMode: true,
        riskPreference: "balanced",
        compareSelection: [],
        tutorialState: 0,
      };
      expect(assertPortfolioInvariants(state)).toBe(true);
    });
    it("returns true for empty portfolio", () => {
      const state: PortfolioState = {
        startingCash: 100_000,
        availableCash: 100_000,
        holdings: [],
        watchlist: [],
        activityLog: [],
        onboardingCompleted: false,
        beginnerMode: true,
        riskPreference: "balanced",
        compareSelection: [],
        tutorialState: 0,
      };
      expect(assertPortfolioInvariants(state)).toBe(true);
    });
  });
});
