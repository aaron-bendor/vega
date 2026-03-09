import { describe, it, expect } from "vitest";
import { getStepForIndex, getStepSnapshot } from "./goldSilverStepLogic";

describe("GoldSilverExplainer step/progress helpers", () => {
  describe("getStepForIndex", () => {
    it("returns 0 (Watching) for indices 0–50", () => {
      expect(getStepForIndex(0)).toBe(0);
      expect(getStepForIndex(25)).toBe(0);
      expect(getStepForIndex(50)).toBe(0);
    });
    it("returns 1 (Signal) for index 51", () => {
      expect(getStepForIndex(51)).toBe(1);
    });
    it("returns 2 (Trade) for indices 52–87", () => {
      expect(getStepForIndex(52)).toBe(2);
      expect(getStepForIndex(70)).toBe(2);
      expect(getStepForIndex(87)).toBe(2);
    });
    it("returns 3 (Profit) for indices 88–119", () => {
      expect(getStepForIndex(88)).toBe(3);
      expect(getStepForIndex(119)).toBe(3);
    });
  });

  describe("getStepSnapshot", () => {
    it("returns initial snapshot for step 0", () => {
      const s = getStepSnapshot(0);
      expect(s.revealedTo).toBe(50);
      expect(s.currentStep).toBe(0);
      expect(s.showTradeAnno).toBe(false);
    });
    it("returns signal snapshot for step 1 (index 51, no trade anno yet)", () => {
      const s = getStepSnapshot(1);
      expect(s.revealedTo).toBe(51);
      expect(s.currentStep).toBe(1);
      expect(s.showTradeAnno).toBe(false);
    });
    it("returns trade snapshot for step 2", () => {
      const s = getStepSnapshot(2);
      expect(s.revealedTo).toBe(87);
      expect(s.currentStep).toBe(2);
      expect(s.showTradeAnno).toBe(true);
    });
    it("returns profit snapshot for step 3", () => {
      const s = getStepSnapshot(3);
      expect(s.revealedTo).toBe(119);
      expect(s.currentStep).toBe(3);
      expect(s.showTradeAnno).toBe(true);
    });
    it("returns safe initial snapshot for out-of-range step", () => {
      const s = getStepSnapshot(-1);
      expect(s.revealedTo).toBe(0);
      expect(s.currentStep).toBe(0);
      expect(s.showTradeAnno).toBe(false);
      const s2 = getStepSnapshot(4);
      expect(s2.revealedTo).toBe(0);
      expect(s2.currentStep).toBe(0);
      expect(s2.showTradeAnno).toBe(false);
    });
  });
});
