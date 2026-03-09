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

// ─────────────────────────────────────────────────────────────────────────────
// /algorithms page: hero balance, explainer touch, no overflow
// ─────────────────────────────────────────────────────────────────────────────
const ALGORITHMS_VIEWPORTS = [
  { width: 320, height: 568, name: "320x568" },
  { width: 375, height: 812, name: "375x812" },
  { width: 390, height: 844, name: "390x844" },
  { width: 844, height: 390, name: "844x390" },
] as const;

test.describe("/algorithms mobile", () => {
  for (const vp of ALGORITHMS_VIEWPORTS) {
    test.describe(`viewport ${vp.name}`, () => {
      test.use({ viewport: { width: vp.width, height: vp.height } });

      test("has no horizontal overflow", async ({ page }) => {
        await page.goto("/algorithms", { waitUntil: "networkidle" });
        const overflow = await page.evaluate(() => {
          const doc = document.documentElement;
          const body = document.body;
          const scrollWidth = Math.max(doc.scrollWidth, body.scrollWidth, doc.clientWidth);
          const clientWidth = doc.clientWidth;
          return { scrollWidth, clientWidth, overflow: scrollWidth > clientWidth };
        });
        expect(overflow.overflow, `Horizontal overflow at ${vp.name}`).toBe(false);
      });

      test("hero content is visible and not clipped", async ({ page }) => {
        await page.goto("/algorithms", { waitUntil: "networkidle" });
        const hero = page.locator('section[aria-label="Algorithms hero"]');
        await expect(hero).toBeVisible();
        const heading = page.getByRole("heading", { name: /engine behind.*modern markets/i });
        await expect(heading).toBeVisible();
      });

      test("explainer step controls and play/reset are visible", async ({ page }) => {
        await page.goto("/algorithms", { waitUntil: "networkidle" });
        await page.locator('canvas[aria-label*="Gold/silver ratio chart"]').waitFor({ state: "visible", timeout: 10000 });
        const resetBtn = page.getByRole("button", { name: /reset chart/i });
        await expect(resetBtn).toBeVisible();
        const playBtn = page.getByRole("button", { name: /play animation|pause animation|replay/i });
        await expect(playBtn).toBeVisible();
        const step1 = page.getByRole("button", { name: /Step 1.*Watching/i });
        await expect(step1).toBeVisible();
      });

      test("explainer responds to tap (step button) and chart is tappable", async ({ page }) => {
        await page.goto("/algorithms", { waitUntil: "networkidle" });
        await page.locator('canvas[aria-label*="Gold/silver ratio chart"]').waitFor({ state: "visible", timeout: 10000 });
        const step2 = page.getByRole("button", { name: /Step 2.*Signal/i });
        await step2.click();
        await expect(page.getByRole("button", { name: /Step 2.*Signal/i }).first()).toHaveAttribute("aria-current", "step");
      });

      test("explainer canvas accepts pointer drag (scrub)", async ({ page }) => {
        await page.goto("/algorithms", { waitUntil: "networkidle" });
        const canvas = page.locator('canvas[aria-label*="Gold/silver ratio chart"]');
        await canvas.waitFor({ state: "visible", timeout: 10000 });
        const box = await canvas.boundingBox();
        if (!box) return;
        const fromX = box.x + box.width * 0.2;
        const toX = box.x + box.width * 0.7;
        const y = box.y + box.height / 2;
        await page.mouse.move(fromX, y);
        await page.mouse.down();
        await page.mouse.move(toX, y, { steps: 5 });
        await page.mouse.up();
        await expect(canvas).toBeVisible();
      });

      test("comparison section (Algorithms vs Human) is visible and stacks on narrow width", async ({ page }) => {
        await page.goto("/algorithms", { waitUntil: "networkidle" });
        const comparisonHeading = page.getByRole("heading", { name: /why algorithms.*outperform/i });
        await expect(comparisonHeading).toBeVisible();
        const algorithmsCard = page.getByRole("heading", { name: /^Algorithms$/i });
        await expect(algorithmsCard).toBeVisible();
        const humanCard = page.getByRole("heading", { name: /human trader/i });
        await expect(humanCard).toBeVisible();
      });

      test("CTA section buttons are visible and within viewport", async ({ page }) => {
        await page.goto("/algorithms", { waitUntil: "networkidle" });
        const ctaHeading = page.getByRole("heading", { name: /ready to invest/i });
        await expect(ctaHeading).toBeVisible();
        const investLink = page.getByRole("link", { name: /invest/i }).first();
        await expect(investLink).toBeVisible();
        const developLink = page.getByRole("link", { name: /develop/i }).first();
        await expect(developLink).toBeVisible();
      });
    });
  }
});

test.describe("/algorithms visual snapshots", () => {
  for (const vp of [
    { width: 320, height: 568 },
    { width: 375, height: 812 },
    { width: 390, height: 844 },
    { width: 844, height: 390 },
  ]) {
    test(`algorithms page at ${vp.width}x${vp.height}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/algorithms", { waitUntil: "networkidle" });
      await expect(page).toHaveScreenshot(`algorithms-${vp.width}x${vp.height}.png`, { fullPage: false });
    });
  }
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

// ─────────────────────────────────────────────────────────────────────────────
// Home header and investing section (mobile-only regressions)
// ─────────────────────────────────────────────────────────────────────────────
test.describe("Home mobile header and investing section", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("header has no horizontal overflow", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    const overflow = await page.evaluate(() => {
      const doc = document.documentElement;
      const body = document.body;
      const scrollWidth = Math.max(doc.scrollWidth, body.scrollWidth, doc.clientWidth);
      const clientWidth = doc.clientWidth;
      return { scrollWidth, clientWidth, overflow: scrollWidth > clientWidth };
    });
    expect(overflow.overflow).toBe(false);
  });

  test("Invest button is visible in header CTA on mobile", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    const investBtn = page.getByRole("button", { name: /invest/i });
    await expect(investBtn).toBeVisible();
  });

  test("Develop link is not visible in header CTA on mobile", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    const headerCta = page.locator("header, [role='banner']").first();
    const developLink = headerCta.getByRole("link", { name: /develop/i });
    await expect(developLink).not.toBeVisible();
  });

  test("investing section: text block bottom is above phone top with positive gap", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    const section = page.locator("#investing-made-simple");
    await expect(section).toBeVisible({ timeout: 10000 });
    const hasNoOverlap = await page.evaluate(() => {
      const sectionEl = document.getElementById("investing-made-simple");
      if (!sectionEl) return false;
      const phone = sectionEl.querySelector("[aria-roledescription='carousel']");
      if (!phone) return true;
      const contentBlock = phone.previousElementSibling;
      if (!contentBlock) return true;
      const phoneRect = phone.getBoundingClientRect();
      const contentRect = contentBlock.getBoundingClientRect();
      return contentRect.bottom + 24 <= phoneRect.top;
    });
    expect(hasNoOverlap).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Algorithms page: Play button and controls within viewport on mobile
// ─────────────────────────────────────────────────────────────────────────────
test.describe("Algorithms page mobile controls", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("has no horizontal overflow", async ({ page }) => {
    await page.goto("/algorithms", { waitUntil: "networkidle" });
    const overflow = await page.evaluate(() => {
      const doc = document.documentElement;
      const body = document.body;
      const scrollWidth = Math.max(doc.scrollWidth, body.scrollWidth, doc.clientWidth);
      const clientWidth = doc.clientWidth;
      return scrollWidth <= clientWidth;
    });
    expect(overflow).toBe(true);
  });

  test("Play button right edge is within viewport width", async ({ page }) => {
    await page.goto("/algorithms", { waitUntil: "networkidle" });
    const playBtn = page.getByRole("button", { name: /play animation|pause animation|replay/i }).first();
    await expect(playBtn).toBeVisible({ timeout: 10000 });
    const box = await playBtn.boundingBox();
    expect(box).not.toBeNull();
    const viewportWidth = page.viewportSize()?.width ?? 375;
    expect(box!.x + box!.width).toBeLessThanOrEqual(viewportWidth + 1);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Vega developer demo (mobile: fallback card only, no interactive tour)
// ─────────────────────────────────────────────────────────────────────────────
test.describe("Vega developer demo mobile", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("has no horizontal overflow", async ({ page }) => {
    await page.goto("/vega-developer/demo", { waitUntil: "networkidle" });
    const overflow = await page.evaluate(() => {
      const doc = document.documentElement;
      const body = document.body;
      const scrollWidth = Math.max(doc.scrollWidth, body.scrollWidth, doc.clientWidth);
      const clientWidth = doc.clientWidth;
      return scrollWidth <= clientWidth;
    });
    expect(overflow).toBe(true);
  });

  test("shows desktop-only fallback card with back and waitlist links", async ({ page }) => {
    await page.goto("/vega-developer/demo", { waitUntil: "networkidle" });
    await expect(page.getByRole("heading", { name: /Vega Developer works best on a laptop/i })).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole("link", { name: /Back to overview/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Join waitlist/i })).toBeVisible();
    // Tour controls must not be visible on mobile
    await expect(page.getByRole("button", { name: /next|back/i }).first()).not.toBeVisible();
  });
});
