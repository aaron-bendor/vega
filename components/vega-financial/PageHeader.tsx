"use client";

import type { ReactNode } from "react";
import { INVESTOR_DISCLAIMER } from "@/lib/vega-financial/investor-copy";

interface PageHeaderProps {
  title: string;
  subtitle?: ReactNode;
  /** Primary action (e.g. CTA button) shown on the right on desktop */
  action?: ReactNode;
  /** When true, show the standard investor disclaimer below the subtitle. Default true. */
  showDisclaimer?: boolean;
}

/**
 * Standard page header for the investor product. Ensures clear hierarchy:
 * one title, one optional subtitle, disclaimer row, one optional primary action.
 */
export function PageHeader({ title, subtitle, action, showDisclaimer = true }: PageHeaderProps) {
  return (
    <header className="min-w-0 mb-6 sm:mb-8">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="min-w-0">
          <h1 className="font-syne text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
              {subtitle}
            </p>
          )}
          {showDisclaimer && (
            <p className="text-xs text-muted-foreground mt-2" role="status">
              {INVESTOR_DISCLAIMER}
            </p>
          )}
        </div>
        {action && (
          <div className="shrink-0">{action}</div>
        )}
      </div>
    </header>
  );
}
