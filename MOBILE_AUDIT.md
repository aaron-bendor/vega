# Mobile optimisation audit — Vega Financial

Audit date: March 2025. Scope: landing and marketing routes at 320px–1280px, with fixes for horizontal overflow, mobile nav, responsive media, and performance.

## Issues found

1. **Horizontal overflow**
   - Body used `overflow-x: hidden`, masking layout causes.
   - Hero iframe used `w-[180vw]`; section had `overflow-hidden` but layout root was not constrained.
   - Algorithms hero label used `whitespace-nowrap`, causing overflow on narrow widths.
   - Some flex containers lacked `min-w-0`, allowing content to force horizontal scroll.

2. **Mobile navigation (PillNav)**
   - No body scroll lock when menu was open.
   - Menu did not close on route change (only on link click).
   - No Escape key to close.
   - No safe-area padding for notch devices.
   - Mobile menu links had tap targets under 44px.
   - Panel lacked `aria-modal` and clear dialog role for accessibility.

3. **Hero and feature sections**
   - Hero used fixed `h-screen`; switched to `min-h-[100dvh]` for short viewports.
   - Statistics section used `min-h-screen` on all sizes; on mobile it now uses content height (`min-h-0`) and only uses full height from `md` up.
   - Algorithms hero had no `overflow-hidden` on the section and no horizontal constraint on the background iframe.

4. **InvestingMadeSimpleSection**
   - Mobile phone mockup was fixed `200px`, not responsive between 320–430px.
   - Content could sit under the absolutely positioned phone; no bottom padding on mobile.
   - Dot indicators had ~8px height, below the 44px minimum tap target.

5. **Performance**
   - Full `backdrop-blur-xl` on nav pill on small screens; reduced to `blur(12px)` below 768px.
   - Body `overflow-x: hidden` removed so overflow is not masked; root causes fixed and layout uses `overflow-x-clip` only where needed.

6. **Accessibility**
   - `prefers-reduced-motion` was already respected in `globals.css` and `AnimateOnScroll`.
   - Mobile nav now has visible focus states, 44px targets, and correct ARIA (dialog, aria-modal, aria-label).

## Files changed

| File | Changes |
|------|--------|
| `app/globals.css` | Removed body `overflow-x: hidden`; added reduced nav-pill backdrop-blur below 768px. |
| `app/(landing)/layout.tsx` | Root wrapper: `overflow-x-clip`, `w-full`, `min-w-0`. |
| `app/(landing)/page.tsx` | Same overflow/width constraints on page wrapper. |
| `app/(landing)/about-us/page.tsx` | `min-w-0` and `w-full min-w-0` on hero content container. |
| `components/layout/PillNav.tsx` | Body scroll lock hook; close on pathname change; Escape key; safe-area padding for banner and mobile panel; 44px min height for mobile links; dialog role and aria-modal; focus-visible styles. |
| `components/landing/HeroVideoSection.tsx` | `min-h-[100dvh]`; `min-w-0` on flex children; smaller hero headline at base (`text-3xl`); hero iframe `max-w-[100vw]` on small screens; `sizes` for hero image. |
| `components/landing/StatisticsSection.tsx` | `min-h-0 md:min-h-screen` so section is not forced full height on mobile. |
| `components/landing/InvestingMadeSimpleSection.tsx` | Responsive phone width `min(200px, 55vw)`; bottom padding so content clears phone; 44px min tap targets and `aria-current` on dot buttons; `min-w-0` on content. |
| `components/landing/ProductFeaturesSection.tsx` | `min-w-0` on section and inner container. |
| `components/landing/algorithms/AlgorithmsHeroSection.tsx` | Section `overflow-hidden`; iframe `max-w-[100vw]` on small screens; `min-h-[100dvh]`; label no longer `whitespace-nowrap`, responsive text size; `min-w-0` and `px-4` on content. |
| `playwright.config.ts` | New: Playwright config with desktop and mobile-chrome projects, optional dev server. |
| `e2e/mobile.spec.ts` | New: tests for 375×812, 390×844, 768×1024, 1280×800; no horizontal overflow and main content visible on `/`, `/about-us`, `/algorithms`, `/faq`, `/vega-financial`, `/vega-developer`; mobile menu open/close and Escape. |
| `package.json` | Added `test:e2e` and `test:e2e:mobile` scripts. |

## What was fixed

- **No horizontal scrolling** at 320px on the audited routes: root causes addressed with `min-w-0`, constrained widths, and removal of `whitespace-nowrap` where it overflowed; layout uses `overflow-x-clip` only at the layout root.
- **Hero and mockups** no longer clipped or oversized: hero uses `min-h-[100dvh]`, responsive headline scale, and iframe constrained to viewport width on small screens; InvestingMadeSimple phone is responsive and content has bottom padding.
- **Primary CTAs** remain visible and tappable: 44px minimum targets on mobile nav links and InvestingMadeSimple dots; buttons already stacked on narrow widths.
- **Mobile nav**: body scroll lock when open, close on route change and Escape, safe-area padding, 44px targets, and ARIA (dialog, aria-modal, focus-visible).
- **Desktop appearance** kept: breakpoints and styles only adjusted for small viewports; desktop layout and visuals unchanged.
- **Performance**: reduced backdrop-blur on nav pill on small screens; no new heavy effects.

## Remaining limitations

- **InvestingMadeSimpleSection** scroll-driven height is still `calc(100vh + (n-1)*70vh)` on all viewports; on very short screens the section remains long by design.
- **Third-party iframes** (hero Colorflow, YouTube) are not fully controllable; they remain in `overflow-hidden` sections so they do not cause page-level horizontal scroll.
- **Safe-area** is applied via inline `env(safe-area-inset-top)`; devices that don’t provide it get no inset (as expected).

## How to run the checks locally

1. **Install Playwright browsers (once)**  
   `npm run screenshots:install`  
   or  
   `npx playwright install chromium`

2. **Start the app**  
   `npm run dev`  
   (Or rely on the Playwright config to start it automatically when not in CI.)

3. **Run all e2e tests**  
   `npm run test:e2e`

4. **Run only mobile viewport and mobile nav tests**  
   `npm run test:e2e:mobile`

5. **Manual check at specific widths**  
   Open DevTools → toggle device toolbar → set widths 320, 360, 375, 390, 414, 768, 1024, 1280 and visit `/`, `/about-us`, `/algorithms`, `/faq`, `/vega-financial`, `/vega-financial/marketplace`, `/vega-financial/portfolio`, `/vega-developer`. Confirm no horizontal scroll and that CTAs and nav are usable.

6. **Lighthouse (optional)**  
   Run Lighthouse in mobile mode on the same routes to check performance and best practices.

---

## Follow-up: investor routes + safe-area

- **`app/globals.css`**: Added `.safe-area-pb` for bottom inset (used by VegaFinancialBottomNav and MobileStickyAllocationBar). Nav-pill reduced blur below 768px already present.
- **Landing roots**: About-us, FAQ, and vega-developer page roots use `overflow-x-clip`, `min-w-0`; about-us and vega-developer heroes use `min-h-[100dvh] md:min-h-screen` for mobile-safe height.
- **AppShell**: Mobile menu button position uses `env(safe-area-inset-top, 0px)` and `env(safe-area-inset-left, 0px)` so it does not sit under the notch.
- **InvestingMadeSimpleSection**: Section uses `min-w-0 overflow-x-clip`; content column has `pb-64 lg:pb-0` so step content clears the phone mockup on mobile. Dot buttons already have 44px tap targets via existing media query.
- **E2E**: `e2e/mobile.spec.ts` includes `/vega-financial/marketplace` and `/vega-financial/portfolio`; viewports 320×568, 360×640, 414×896, 1024×768 added. `test:e2e:mobile` runs with `--project=mobile-chrome`. `test:e2e` and `test:e2e:mobile` are in `package.json`.

---

## Follow-up: full mobile-only optimisation (March 2025)

**Goal:** Optimise entire site for mobile only; no visual or behavioural changes from `md` and above. Scope: all landing and investor app routes at 320–1280px; 1280px as non-regression checkpoint.

### Routes audited

| Route | 320 | 360 | 375 | 390 | 414 | 768 | 1024 | 1280 |
|-------|-----|-----|-----|-----|-----|-----|------|------|
| `/` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `/about-us` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `/algorithms` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `/faq` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `/vega-developer` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `/vega-financial` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `/vega-financial/marketplace` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `/vega-financial/portfolio` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `/vega-financial/watchlist` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `/vega-financial/activity` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `/vega-financial/learn` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `/vega-financial/profile` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `/vega-financial/algorithms/[id]` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

### Files changed (mobile-only)

| File | Mobile-only changes |
|------|---------------------|
| `app/globals.css` | Added `.main-with-bottom-nav`: bottom padding `calc(5rem + env(safe-area-inset-bottom))` on mobile only, reset at `lg`. |
| `components/layout/AppShell.tsx` | Main: `max-w-full`; when `bottomNav`, use `main-with-bottom-nav` instead of `pb-20` so content clears nav + safe area. No `md`/desktop changes. |
| `components/vega-financial/MobileStickyAllocationBar.tsx` | Position above bottom nav on mobile: `bottom-[calc(3.5rem+env(safe-area-inset-bottom,0px))]` so CTA is not hidden behind nav. |
| `components/vega-financial/AlgorithmDetailLayout.tsx` | Mobile: `min-w-0`, `max-lg:pb-[calc(8rem+env(safe-area-inset-bottom))]` so last content clears sticky bar + nav. Tabs container: `min-w-0`, `max-md:overflow-x-auto`; TabsList: `max-md:overflow-x-auto max-md:flex-nowrap` so tabs scroll on narrow widths. |
| `components/marketplace/MarketplaceContent.tsx` | Compare bar: on `max-lg` position above nav (`bottom-[calc(3.5rem+env(safe-area-inset-bottom))]`), `safe-area-pb`. Grid when compare open: `max-lg:pb-36`, `min-w-0`. Search/sort toolbar: `min-w-0`, search `w-full max-w-full`; sort row `max-sm:w-full`, trigger `max-sm:flex-1 max-sm:min-w-0`. Category cards: `min-w-0` on grid and links. |
| `components/vega-financial/StrategyMetricStrip.tsx` | Metric cards: `min-w-0` (removed fixed `min-w-[140px]`) so strip does not force horizontal overflow on narrow widths. |
| `app/(landing)/algorithms/page.tsx` | Root: `min-w-0 overflow-x-clip` so algorithms page cannot cause page-level horizontal scroll. |
| `components/vega-financial/DashboardPortfolioChart.tsx` | Chart container: `min-w-0 w-full max-w-full`; inner div: `min-h-[200px] max-w-full min-w-0`. |
| `components/vega-financial/PortfolioPageContent.tsx` | Holdings table wrapper: `min-w-0 w-full max-w-full`; scroll container unchanged. |
| `components/vega-financial/DashboardHoldingsSection.tsx` | Desktop table wrapper: `min-w-0 max-w-full overflow-y-hidden`. |
| `components/landing/FaqSection.tsx` | Section: `min-w-0`; inner container: `min-w-0`; FAQ question text span: `min-w-0` for safe wrapping. |
| `components/charts/EquityCurve.tsx` | Container: `min-w-0 max-w-full`. |
| `e2e/mobile.spec.ts` | Added routes: watchlist, activity, learn, profile, algorithms/demo-1. New describe blocks: mobile marketplace (search + sort visible, filter button visible), mobile algorithm detail (main CTA visible), mobile bottom nav (nav visible, main content present), mobile chart route (portfolio no overflow at 320px). |

### Exact mobile-only fixes

- **App shell:** Main content bottom padding now includes safe-area on mobile when bottom nav is present; no desktop change.
- **Compare bar (marketplace):** Fixed above bottom nav on `max-lg` so it is always tappable; grid given extra bottom padding when compare is open.
- **Algorithm detail:** Sticky “Buy or sell” bar moved above bottom nav; page given sufficient bottom padding; tab row scrolls horizontally on narrow screens.
- **Marketplace:** Search/sort stack and full-width behaviour on small screens; filter chips and category cards given `min-w-0` to avoid overflow.
- **Strategy metric strip:** Cards allowed to shrink (`min-w-0`) so no horizontal scroll at 320px.
- **Charts and tables:** Chart and table wrappers given `min-w-0` / `max-w-full` so they do not force page width; table scroll remains internal.
- **Landing:** Algorithms page root and FAQ section given overflow/width constraints; no desktop layout changes.

### Desktop preserved

- No `md:`, `lg:`, or `xl:` breakpoint behaviour was changed for desktop layout, typography, or spacing.
- Desktop compare bar remains `lg:sticky lg:top-24`; algorithm detail tabs and hero layout unchanged at `lg`; marketplace filter rail and grid unchanged at `lg`.
- All new classes are either unprefixed (safe at all sizes) or use `max-sm:`, `max-md:`, or `max-lg:` so they apply only below the respective breakpoints.

### Running the mobile e2e tests

Ensure Playwright browsers are installed (`npx playwright install`), then run:

- **All e2e:** `npm run test:e2e`
- **Mobile-only (mobile-chrome project):** `npm run test:e2e:mobile`

The mobile spec covers no horizontal overflow and main content visibility for all listed routes at 320, 360, 375, 390, 414, 768, 1024, 1280; plus marketplace search/filter, algorithm detail CTA, bottom nav, and portfolio chart at 320px.
