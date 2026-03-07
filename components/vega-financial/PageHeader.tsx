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
 * Standard page header for the investor product. Clear hierarchy:
 * one title (Maven Pro), optional subtitle. Disclaimer moved to muted bar when showDisclaimer.
 */
export function PageHeader({ title, subtitle, action, showDisclaimer = true }: PageHeaderProps) {
  return (
    <header className="min-w-0 mb-8 sm:mb-10">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="min-w-0">
          <h1 className="font-maven-pro text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-2 max-w-2xl leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
        {action && (
          <div className="shrink-0">{action}</div>
        )}
      </div>
      {showDisclaimer && (
        <p
          className="mt-3 py-2 text-[11px] text-muted-foreground/90 border-t border-border/80"
          role="status"
        >
          {INVESTOR_DISCLAIMER}
        </p>
      )}
    </header>
  );
}
