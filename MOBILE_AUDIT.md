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
   Open DevTools → toggle device toolbar → set widths 320, 360, 375, 390, 414, 768, 1024, 1280 and visit `/`, `/about-us`, `/algorithms`, `/faq`, `/vega-financial`, `/vega-developer`. Confirm no horizontal scroll and that CTAs and nav are usable.

6. **Lighthouse (optional)**  
   Run Lighthouse in mobile mode on the same routes to check performance and best practices.
