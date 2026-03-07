import { describe, it, expect } from "vitest";
import { validateAllocationAmount } from "../allocation-validation";

describe("validateAllocationAmount", () => {
  const versionId = "demo-1";
  const availableCash = 10_000;

  it("accepts a valid amount within available cash", () => {
    expect(validateAllocationAmount(5000, availableCash, versionId)).toEqual({ valid: true });
    expect(validateAllocationAmount(10000, availableCash, versionId)).toEqual({ valid: true });
  });

  it("rejects amount greater than available cash", () => {
    const result = validateAllocationAmount(15000, availableCash, versionId);
    expect(result.valid).toBe(false);
    expect((result as { message: string }).message).toBe("Allocation exceeds available demo cash.");
  });

  it("rejects zero amount", () => {
    const result = validateAllocationAmount(0, availableCash, versionId);
    expect(result.valid).toBe(false);
    expect((result as { message: string }).message).toBe("Amount must be greater than £0.");
  });

  it("rejects negative amount", () => {
    const result = validateAllocationAmount(-1000, availableCash, versionId);
    expect(result.valid).toBe(false);
    expect((result as { message: string }).message).toBe("Amount must be greater than £0.");
  });

  it("rejects NaN / non-numeric", () => {
    const result = validateAllocationAmount(Number.NaN, availableCash, versionId);
    expect(result.valid).toBe(false);
    expect((result as { message: string }).message).toBe("Enter a valid amount.");
  });

  it("rejects missing or blank strategy id", () => {
    const empty = validateAllocationAmount(1000, availableCash, "");
    expect(empty.valid).toBe(false);
    expect((empty as { message: string }).message).toContain("strategy could not be loaded");

    const blank = validateAllocationAmount(1000, availableCash, "   ");
    expect(blank.valid).toBe(false);
  });

  it("rejects invalid versionId type when empty", () => {
    const result = validateAllocationAmount(1000, availableCash, "");
    expect(result.valid).toBe(false);
  });
});
