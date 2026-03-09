/**
 * Shared CTA labels and handoff copy for landing/marketing surfaces.
 * Keeps investor and developer CTAs consistent across home, about, algorithms, developer, footer.
 */

import { ROUTES } from "@/lib/routes";

export const LANDING_CTA = {
  /** Primary CTA for the investor demo (header + hero). */
  investorPrimary: "Invest",
  /** Secondary: waitlist / register interest (investor). */
  investorSecondary: "Join waitlist",
  /** Primary CTA for the developer platform. */
  developerPrimary: "Develop",
  /** Secondary: register interest (developer). */
  developerSecondary: "Register interest",
} as const;

export const LANDING_CTA_HREFS = {
  investorDemo: ROUTES.vegaFinancial.root,
  developerPlatform: ROUTES.vegaDeveloper,
  developerDemo: `${ROUTES.vegaDeveloper}/demo`,
} as const;
