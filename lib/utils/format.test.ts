import { formatPercent, formatCurrency } from "./format";

describe("formatPercent", () => {
  it("formats decimal as percent (e.g. 0.3059 → +30.59%)", () => {
    expect(formatPercent(0.3059)).toMatch(/\+30\.59%|30\.59%/);
    expect(formatPercent(-0.05)).toMatch(/-5\.00%|−5\.00%/);
  });

  it("guards against percentage-points input (e.g. 30.59 → +30.59%, not +3059%)", () => {
    const result = formatPercent(30.59);
    expect(result).not.toContain("3059");
    expect(result).toMatch(/30\.59%|30,59%/);
  });

  it("treats values with |x| > 1.5 as percentage points", () => {
    expect(formatPercent(100)).toMatch(/100\.00%|100,00%/);
    expect(formatPercent(-50)).toMatch(/-50\.00%|−50\.00%/);
  });
});

describe("formatCurrency", () => {
  it("formats number as GBP", () => {
    expect(formatCurrency(12450)).toContain("12");
    expect(formatCurrency(12450)).toMatch(/£|GBP/);
  });
});
