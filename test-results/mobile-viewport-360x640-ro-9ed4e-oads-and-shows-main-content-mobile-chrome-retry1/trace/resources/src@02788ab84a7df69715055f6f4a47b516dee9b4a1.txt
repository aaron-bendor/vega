import { test, expect } from "@playwright/test";

const PRIORITY_ROUTES = [
  "/",
  "/about-us",
  "/algorithms",
  "/faq",
  "/vega-financial",
  "/vega-financial/marketplace",
  "/vega-financial/portfolio",
  "/vega-financial/watchlist",
  "/vega-financial/activity",
  "/vega-financial/learn",
  "/vega-financial/profile",
  "/vega-financial/algorithms/demo-1",
  "/vega-developer",
] as const;

const VIEWPORTS = [
  { width: 320, height: 568, name: "320x568" },
  { width: 360, height: 640, name: "360x640" },
  { width: 375, height: 812, name: "375x812" },
  { width: 390, height: 844, name: "390x844" },
  { width: 414, height: 896, name: "414x896" },
  { width: 768, height: 1024, name: "768x1024" },
  { width: 1024, height: 768, name: "1024x768" },
  { width: 1280, height: 800, name: "1280x800" },
] as const;

for (const viewport of VIEWPORTS) {
  test.describe(`viewport ${viewport.name}`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    for (const route of PRIORITY_ROUTES) {
      test(`route ${route || "/"} has no horizontal overflow`, async ({
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

      test(`route ${route || "/"} loads and shows main content`, async ({
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

test.describe("mobile marketplace", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("search input and sort are visible and usable", async ({ page }) => {
    await page.goto("/vega-financial/marketplace", { waitUntil: "networkidle" });
    await expect(page.getByRole("searchbox", { name: /search strategies/i })).toBeVisible();
    await expect(page.getByText("Sort by")).toBeVisible();
    await expect(page.getByRole("combobox")).toBeVisible();
  });

  test("filter UI is visible on mobile", async ({ page }) => {
    await page.goto("/vega-financial/marketplace", { waitUntil: "networkidle" });
    await expect(page.getByRole("button", { name: /more filters|open filters/i })).toBeVisible();
  });
});

test.describe("mobile algorithm detail", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("main CTA (Buy or sell) is visible on mobile", async ({ page }) => {
    await page.goto("/vega-financial/algorithms/demo-1", { waitUntil: "networkidle" });
    const cta = page.getByRole("button", { name: /buy or sell/i });
    await expect(cta).toBeVisible({ timeout: 10000 });
  });
});

test.describe("mobile bottom nav", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("bottom nav is visible on investor routes and does not cover main content", async ({ page }) => {
    await page.goto("/vega-financial", { waitUntil: "networkidle" });
    const nav = page.getByRole("navigation", { name: /app navigation/i });
    await expect(nav).toBeVisible();
    await expect(nav.getByRole("link", { name: /dashboard/i })).toBeVisible();
    await expect(nav.getByRole("link", { name: /strategies/i })).toBeVisible();
    await expect(nav.getByRole("link", { name: /portfolio/i })).toBeVisible();
    const main = page.locator("main").first();
    await expect(main).toBeVisible();
  });
});

test.describe("mobile chart route", () => {
  test.use({ viewport: { width: 320, height: 568 } });

  test("portfolio page renders without horizontal overflow", async ({ page }) => {
    await page.goto("/vega-financial/portfolio", { waitUntil: "networkidle" });
    const overflow = await page.evaluate(() => {
      const doc = document.documentElement;
      const body = document.body;
      const scrollWidth = Math.max(doc.scrollWidth, body.scrollWidth, doc.clientWidth);
      const clientWidth = doc.clientWidth;
      return scrollWidth <= clientWidth;
    });
    expect(overflow).toBe(true);
  });
});

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
