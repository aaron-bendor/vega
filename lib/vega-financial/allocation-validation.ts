/**
 * Validation for demo allocation amount. Shared for form and tests.
 */

export function validateAllocationAmount(
  amount: number,
  availableCash: number,
  versionId: string
): { valid: true } | { valid: false; message: string } {
  const trimmed = Number(amount);
  if (Number.isNaN(trimmed) || trimmed !== amount) {
    return { valid: false, message: "Enter a valid amount." };
  }
  if (trimmed <= 0) {
    return { valid: false, message: "Amount must be greater than £0." };
  }
  if (trimmed > availableCash) {
    return { valid: false, message: "Allocation exceeds available demo cash." };
  }
  if (!versionId || typeof versionId !== "string" || versionId.trim() === "") {
    return { valid: false, message: "This strategy could not be loaded. Please return to Explore and try again." };
  }
  return { valid: true };
}

/**
 * Validation for demo sell amount. Shared for form and tests.
 */
export function validateSellAmount(
  amount: number,
  currentHoldingValue: number,
  versionId: string
): { valid: true } | { valid: false; message: string } {
  const trimmed = Number(amount);
  if (Number.isNaN(trimmed) || trimmed !== amount) {
    return { valid: false, message: "Enter a valid amount." };
  }
  if (trimmed <= 0) {
    return { valid: false, message: "Amount must be greater than £0." };
  }
  if (currentHoldingValue <= 0) {
    return { valid: false, message: "You do not hold this strategy in your demo portfolio." };
  }
  if (trimmed > currentHoldingValue) {
    return { valid: false, message: "Sell amount cannot exceed your current holding." };
  }
  if (!versionId || typeof versionId !== "string" || versionId.trim() === "") {
    return { valid: false, message: "This strategy could not be loaded. Please return to Explore and try again." };
  }
  return { valid: true };
}
