"use client";

/**
 * Single source of truth for marketing site navigation and top banner.
 * Used in (landing), (vega)/vega-developer, and (vega)/vega-financial so the
 * same top banner/nav appears when moving from landing to algorithm pages.
 * Do not use in (app) routes — those use AppShell.
 */
import { PillNav } from "./PillNav";

type SiteHeaderVariant = "hero" | "standalone" | "investor" | "investorApp";

export function SiteHeader({ variant = "standalone" }: { variant?: SiteHeaderVariant }) {
  return <PillNav variant={variant} />;
}
