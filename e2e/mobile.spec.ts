import { test, expect } from "@playwright/test";

const LANDING_ROUTES = [
  "/",
  "/about-us",
  "/algorithms",
  "/faq",
  "/vega-financial",
  "/vega-developer",
] as const;

const VIEWPORTS = [
  { width: 375, height: 812, name: "375x812" },
  { width: 390, height: 844, name: "390x844" },
  { width: 768, height: 1024, name: "768x1024" },
  { width: 1280, height: 800, name: "1280x800" },
] as const;

for (const viewport of VIEWPORTS) {
  test.describe(`viewport ${viewport.name}`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    for (const route of LANDING_ROUTES) {
      test(`landing route ${route || "/"} has no horizontal overflow`, async ({
        page,
      }) => {
        await page.goto(route, { waitUntil: "networkidle" });
        await page.waitForLoadState("domcontentloaded");

        const overflow = await page.evaluate(() => {
          const doc = document.documentElement;
          const body = document.body;
          const scrollWidth = Math.max(
            doc.scrollWidth,
            body.scrollWidth,
            doc.clientWidth
          );
          const clientWidth = doc.clientWidth;
          return { scrollWidth, clientWidth, overflow: scrollWidth > clientWidth };
        });

        expect(
          overflow.overflow,
          `Horizontal overflow on ${route} at ${viewport.name}: scrollWidth=${overflow.scrollWidth} clientWidth=${overflow.clientWidth}`
        ).toBe(false);
      });

      test(`landing route ${route || "/"} loads and shows main content`, async ({
        page,
      }) => {
        await page.goto(route, { waitUntil: "networkidle" });
        await expect(page.locator("body")).toBeVisible();
        const main = page.locator("main").first();
        await expect(main).toBeVisible({ timeout: 10000 });
      });
    }
  });
}

test.describe("mobile nav", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("opens and closes mobile menu", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    const menuButton = page.getByRole("button", {
      name: /open menu/i,
    });
    await expect(menuButton).toBeVisible();
    await menuButton.click();
    await expect(
      page.getByRole("dialog", { name: /mobile navigation menu/i })
    ).toBeVisible();
    const closeButton = page.getByRole("button", { name: /close menu/i });
    await expect(closeButton).toBeVisible();
    await closeButton.click();
    await expect(
      page.getByRole("dialog", { name: /mobile navigation menu/i })
    ).not.toBeVisible();
  });

  test("mobile menu closes on Escape", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await page.getByRole("button", { name: /open menu/i }).click();
    await expect(
      page.getByRole("dialog", { name: /mobile navigation menu/i })
    ).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(
      page.getByRole("dialog", { name: /mobile navigation menu/i })
    ).not.toBeVisible();
  });
});
