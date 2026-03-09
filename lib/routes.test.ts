import { describe, it, expect } from "vitest";
import {
  ROUTES,
  VEGA_FINANCIAL_PATHS,
  INVESTOR_NAV_HREFS,
} from "./routes";

describe("routes", () => {
  it("no investor nav item points to a non-canonical route", () => {
    const canonicalSet = new Set(VEGA_FINANCIAL_PATHS);
    for (const href of INVESTOR_NAV_HREFS) {
      expect(canonicalSet.has(href), `${href} should be in VEGA_FINANCIAL_PATHS`).toBe(
        true
      );
    }
  });

  it("investor nav uses nested paths only (no legacy /marketplace, /portfolio, /algo)", () => {
    const legacyPrefixes = ["/marketplace", "/portfolio", "/algo/"];
    for (const href of INVESTOR_NAV_HREFS) {
      const isLegacy = legacyPrefixes.some((p) => href === p || href.startsWith(p + "/"));
      expect(isLegacy, `${href} should not be a legacy path`).toBe(false);
    }
  });

  it("algorithm route helper matches nested path", () => {
    expect(ROUTES.vegaFinancial.algorithm("demo-1")).toBe(
      "/vega-financial/algorithms/demo-1"
    );
  });
});
