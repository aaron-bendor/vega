import { describe, it, expect } from "vitest";
import {
  TOUR_STEPS,
  getStep,
  getStepCount,
} from "./config";

describe("tour config", () => {
  it("includes a Compare step in the tutorial flow", () => {
    const compareStep = TOUR_STEPS.find(
      (s) => s.route === "/vega-financial/compare" && s.selector.includes("vf-compare")
    );
    expect(compareStep).toBeDefined();
    expect(compareStep?.body).toMatch(/Compare/i);
    expect(compareStep?.body).toMatch(/strategies/i);
  });

  it("getStepCount reflects total steps including Compare", () => {
    expect(getStepCount()).toBe(TOUR_STEPS.length);
    expect(getStepCount()).toBeGreaterThanOrEqual(8);
  });

  it("getStep returns Compare step at correct index", () => {
    const step5 = getStep(5);
    expect(step5?.route).toBe("/vega-financial/compare");
    expect(step5?.selector).toBe("[data-tour=\"vf-compare\"]");
  });

  it("final step has no selector (completion step)", () => {
    const lastIndex = getStepCount() - 1;
    const lastStep = getStep(lastIndex);
    expect(lastStep?.selector).toBe("");
    expect(lastStep?.body).toMatch(/replay|Settings/i);
  });
});
