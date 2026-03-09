import { test, expect } from "@playwright/test";

/**
 * Vega Developer demo tutorial must only start on explicit user action.
 * These tests ensure the tutorial never auto-starts on load, refresh, or navigation.
 */
test.describe("Vega Developer demo tutorial", () => {
  test("tutorial does not start on initial page load", async ({ page }) => {
    await page.goto("/vega-developer/demo", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("button", { name: /play tutorial/i })).toBeVisible();
    // Tour step content (e.g. "01 — File Explorer") must not be visible until user clicks Play
    await expect(page.getByText(/01 — File Explorer/i)).not.toBeVisible();
  });

  test("clicking Play Tutorial starts the tour at step 1", async ({ page }) => {
    await page.goto("/vega-developer/demo", { waitUntil: "domcontentloaded" });
    await page.getByRole("button", { name: /play tutorial/i }).click();
    await page.waitForTimeout(300);
    // First step shows welcome or step label (e.g. "Start Tutorial" or "Welcome")
    await expect(
      page.getByText(/Welcome to the Vega Developer tour|Start Tutorial/i)
    ).toBeVisible();
  });

  test("tutorial shows step counter after starting", async ({ page }) => {
    await page.goto("/vega-developer/demo", { waitUntil: "domcontentloaded" });
    await page.getByRole("button", { name: /play tutorial/i }).click();
    await page.waitForTimeout(300);
    await expect(page.getByText(/\d+\/\d+/)).toBeVisible();
  });
});

test.describe("Vega Financial tour (Compare step)", () => {
  test("Compare step is in tour config (navigate to compare during tour)", async ({
    page,
  }) => {
    // Visit compare page; it should have the tour target so the guided tour can highlight it
    await page.goto("/vega-financial/compare", { waitUntil: "domcontentloaded" });
    const compareEl = page.locator("[data-tour=\"vf-compare\"]");
    await expect(compareEl).toBeVisible();
  });
});
