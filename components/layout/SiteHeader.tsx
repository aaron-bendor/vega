"use client";

/**
 * Single source of truth for marketing site navigation.
 * Use only in marketing layouts: (landing) and (vega)/vega-developer.
 * Do not use in /vega-financial/* or (app) routes — those use AppShell.
 */
import { PillNav } from "./PillNav";

type SiteHeaderVariant = "hero" | "standalone";

export function SiteHeader({ variant = "standalone" }: { variant?: SiteHeaderVariant }) {
  return <PillNav variant={variant} />;
}
