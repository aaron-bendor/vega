import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  loadPortfolioState,
  savePortfolioState,
  seedFromMockAccountIfEmpty,
  performDemoAllocation,
  performDemoSell,
  getTotalInvested,
  getTotalCurrentValue,
  type PortfolioState,
  type PaperHolding,
} from "../portfolio-store";

function makeMockStorage(): Record<string, string> {
  const store: Record<string, string> = {};
  return {
    getItem(key: string) {
      return store[key] ?? null;
    },
    setItem(key: string, value: string) {
      store[key] = value;
    },
    removeItem(key: string) {
      delete store[key];
    },
    get length() {
      return Object.keys(store).length;
    },
    key() {
      return null;
    },
    clear() {
      for (const k of Object.keys(store)) delete store[k];
    },
  };
}

describe("portfolio-store (demo allocation)", () => {
  let mockStorage: ReturnType<typeof makeMockStorage>;

  beforeEach(() => {
    mockStorage = makeMockStorage();
    vi.stubGlobal("window", {
      localStorage: mockStorage,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    });
    vi.stubGlobal("localStorage", mockStorage);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe("performDemoAllocation", () => {
    it("allocates a valid amount to a new strategy and updates state", () => {
      const state: PortfolioState = {
        startingCash: 100_000,
        availableCash: 50_000,
        holdings: [],
        watchlist: [],
        activityLog: [],
        onboardingCompleted: false,
        beginnerMode: true,
        riskPreference: "balanced",
        compareSelection: [],
        tutorialState: 0,
      };
      savePortfolioState(state);

      const result = performDemoAllocation("strat-1", 10_000, "Test Strategy");

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.newState.availableCash).toBe(40_000);
        expect(result.newState.holdings).toHaveLength(1);
        expect(result.newState.holdings[0].algorithmId).toBe("strat-1");
        expect(result.newState.holdings[0].allocated).toBe(10_000);
        expect(result.newState.holdings[0].currentValue).toBe(10_000);
        expect(result.newState.activityLog).toHaveLength(1);
        expect(result.newState.activityLog[0].type).toBe("allocate");
        expect(result.newState.activityLog[0].amount).toBe(10_000);
        expect(result.newState.activityLog[0].algorithmName).toBe("Test Strategy");
      }
    });

    it("increases existing holding instead of creating duplicate", () => {
      const existing: PaperHolding = {
        id: "h1",
        algorithmId: "strat-1",
        name: "Test Strategy",
        allocated: 5_000,
        currentValue: 5_000,
        weight: 10,
        returnPct: 0,
        tags: [],
        addedAt: new Date().toISOString(),
      };
      const state: PortfolioState = {
        startingCash: 100_000,
        availableCash: 45_000,
        holdings: [existing],
        watchlist: [],
        activityLog: [],
        onboardingCompleted: false,
        beginnerMode: true,
        riskPreference: "balanced",
        compareSelection: [],
        tutorialState: 0,
      };
      savePortfolioState(state);

      const result = performDemoAllocation("strat-1", 10_000, "Test Strategy");

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.newState.holdings).toHaveLength(1);
        expect(result.newState.holdings[0].allocated).toBe(15_000);
        expect(result.newState.holdings[0].currentValue).toBe(15_000);
        expect(result.newState.availableCash).toBe(35_000);
        expect(result.newState.activityLog).toHaveLength(1);
      }
    });

    it("returns error when amount exceeds available cash", () => {
      const state: PortfolioState = {
        startingCash: 100_000,
        availableCash: 5_000,
        holdings: [],
        watchlist: [],
        activityLog: [],
        onboardingCompleted: false,
        beginnerMode: true,
        riskPreference: "balanced",
        compareSelection: [],
        tutorialState: 0,
      };
      savePortfolioState(state);

      const result = performDemoAllocation("strat-1", 10_000, "Test");

      expect(result.success).toBe(false);
      expect((result as { error: string }).error).toBe("Allocation exceeds available demo cash.");
    });
  });

  describe("performDemoSell", () => {
    it("rejects when no holding exists for strategy", () => {
      const state: PortfolioState = {
        startingCash: 100_000,
        availableCash: 50_000,
        holdings: [],
        watchlist: [],
        activityLog: [],
        onboardingCompleted: false,
        beginnerMode: true,
        riskPreference: "balanced",
        compareSelection: [],
        tutorialState: 0,
      };
      savePortfolioState(state);

      const result = performDemoSell("strat-1", 1_000, "Test Strategy");

      expect(result.success).toBe(false);
      expect((result as { error: string }).error).toBe("You do not hold this strategy in your demo portfolio.");
    });

    it("rejects when amount exceeds current holding", () => {
      const existing: PaperHolding = {
        id: "h1",
        algorithmId: "strat-1",
        name: "Test Strategy",
        allocated: 5_000,
        currentValue: 5_000,
        weight: 10,
        returnPct: 0,
        tags: [],
        addedAt: new Date().toISOString(),
      };
      const state: PortfolioState = {
        startingCash: 100_000,
        availableCash: 45_000,
        holdings: [existing],
        watchlist: [],
        activityLog: [],
        onboardingCompleted: false,
        beginnerMode: true,
        riskPreference: "balanced",
        compareSelection: [],
        tutorialState: 0,
      };
      savePortfolioState(state);

      const result = performDemoSell("strat-1", 6_000, "Test Strategy");

      expect(result.success).toBe(false);
      expect((result as { error: string }).error).toBe("Sell amount cannot exceed your current holding.");
    });

    it("rejects when amount <= 0", () => {
      const existing: PaperHolding = {
        id: "h1",
        algorithmId: "strat-1",
        name: "Test Strategy",
        allocated: 5_000,
        currentValue: 5_000,
        weight: 10,
        returnPct: 0,
        tags: [],
        addedAt: new Date().toISOString(),
      };
      const state: PortfolioState = {
        startingCash: 100_000,
        availableCash: 45_000,
        holdings: [existing],
        watchlist: [],
        activityLog: [],
        onboardingCompleted: false,
        beginnerMode: true,
        riskPreference: "balanced",
        compareSelection: [],
        tutorialState: 0,
      };
      savePortfolioState(state);

      expect(performDemoSell("strat-1", 0, "Test").success).toBe(false);
      expect(performDemoSell("strat-1", -100, "Test").success).toBe(false);
    });

    it("partial sell reduces holding and uses reduce activity type", () => {
      const existing: PaperHolding = {
        id: "h1",
        algorithmId: "strat-1",
        name: "Test Strategy",
        allocated: 10_000,
        currentValue: 12_000,
        weight: 20,
        returnPct: 20,
        tags: [],
        addedAt: new Date().toISOString(),
      };
      const state: PortfolioState = {
        startingCash: 100_000,
        availableCash: 40_000,
        holdings: [existing],
        watchlist: [],
        activityLog: [],
        onboardingCompleted: false,
        beginnerMode: true,
        riskPreference: "balanced",
        compareSelection: [],
        tutorialState: 0,
      };
      savePortfolioState(state);

      const result = performDemoSell("strat-1", 4_000, "Test Strategy");

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.newState.holdings).toHaveLength(1);
        expect(result.newState.holdings[0].currentValue).toBe(8_000);
        expect(result.newState.holdings[0].allocated).toBeCloseTo(10_000 * (1 - 4000 / 12000), 1);
        expect(result.newState.availableCash).toBe(44_000);
        expect(result.newState.activityLog).toHaveLength(1);
        expect(result.newState.activityLog[0].type).toBe("reduce");
        expect(result.newState.activityLog[0].amount).toBe(4_000);
      }
    });

    it("full sell removes holding and uses remove activity type", () => {
      const existing: PaperHolding = {
        id: "h1",
        algorithmId: "strat-1",
        name: "Test Strategy",
        allocated: 5_000,
        currentValue: 5_000,
        weight: 10,
        returnPct: 0,
        tags: [],
        addedAt: new Date().toISOString(),
      };
      const state: PortfolioState = {
        startingCash: 100_000,
        availableCash: 45_000,
        holdings: [existing],
        watchlist: [],
        activityLog: [],
        onboardingCompleted: false,
        beginnerMode: true,
        riskPreference: "balanced",
        compareSelection: [],
        tutorialState: 0,
      };
      savePortfolioState(state);

      const result = performDemoSell("strat-1", 5_000, "Test Strategy");

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.newState.holdings).toHaveLength(0);
        expect(result.newState.availableCash).toBe(50_000);
        expect(result.newState.activityLog).toHaveLength(1);
        expect(result.newState.activityLog[0].type).toBe("remove");
        expect(result.newState.activityLog[0].amount).toBe(5_000);
      }
    });
  });

  describe("getTotalInvested", () => {
    it("sums allocated of all holdings", () => {
      const holdings: PaperHolding[] = [
        { id: "1", algorithmId: "a", name: "A", allocated: 1000, currentValue: 1100, weight: 50, returnPct: 10, tags: [], addedAt: "" },
        { id: "2", algorithmId: "b", name: "B", allocated: 2000, currentValue: 1900, weight: 50, returnPct: -5, tags: [], addedAt: "" },
      ];
      expect(getTotalInvested(holdings)).toBe(3000);
    });
  });

  describe("getTotalCurrentValue", () => {
    it("sums currentValue of all holdings", () => {
      const holdings: PaperHolding[] = [
        { id: "1", algorithmId: "a", name: "A", allocated: 1000, currentValue: 1100, weight: 50, returnPct: 10, tags: [], addedAt: "" },
        { id: "2", algorithmId: "b", name: "B", allocated: 2000, currentValue: 1900, weight: 50, returnPct: -5, tags: [], addedAt: "" },
      ];
      expect(getTotalCurrentValue(holdings)).toBe(3000);
    });
  });

  describe("seedFromMockAccountIfEmpty", () => {
    it("does not overwrite when store already has data", () => {
      const state: PortfolioState = {
        startingCash: 100_000,
        availableCash: 80_000,
        holdings: [],
        watchlist: [],
        activityLog: [],
        onboardingCompleted: false,
        beginnerMode: true,
        riskPreference: "balanced",
        compareSelection: [],
        tutorialState: 0,
      };
      savePortfolioState(state);
      seedFromMockAccountIfEmpty();
      const loaded = loadPortfolioState();
      expect(loaded.availableCash).toBe(80_000);
    });

    it("creates reconciled state: startingCash = availableCash + sum(allocated), equity = availableCash + sum(currentValue)", () => {
      mockStorage.clear();
      seedFromMockAccountIfEmpty();
      const loaded = loadPortfolioState();
      const invested = getTotalInvested(loaded.holdings);
      const totalValue = getTotalCurrentValue(loaded.holdings);
      expect(loaded.startingCash).toBe(loaded.availableCash + invested);
      expect(loaded.availableCash + totalValue).toBe(12_450 + 16_850 + 15_749 + 19_853);
    });
  });
});
