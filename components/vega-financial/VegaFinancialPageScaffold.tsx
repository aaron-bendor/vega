"use client";

import type { ReactNode } from "react";
import { PageHeader } from "@/components/vega-financial/PageHeader";
import { cn } from "@/lib/utils";

export interface VegaFinancialPageScaffoldProps {
  /** Optional eyebrow or breadcrumb row above the title */
  eyebrow?: ReactNode;
  /** Page title (h1) */
  title: string;
  /** Optional description below title */
  description?: ReactNode;
  /** Optional right-side action (e.g. CTA) on desktop */
  action?: ReactNode;
  /** When true, show the standard investor disclaimer below the subtitle. Default true. */
  showDisclaimer?: boolean;
  /** Main content (primary column on desktop) */
  children: ReactNode;
  /** Optional secondary rail (4 columns on desktop, stacked on mobile) */
  secondaryRail?: ReactNode;
  /** Optional class for the outer wrapper */
  className?: string;
}

/**
 * Shared page layout for all /vega-financial/* core pages.
 * Standard spacing, 12-column grid on desktop (8 + 4), stacked on mobile.
 */
export function VegaFinancialPageScaffold({
  eyebrow,
  title,
  description,
  action,
  showDisclaimer = true,
  children,
  secondaryRail,
  className,
}: VegaFinancialPageScaffoldProps) {
  return (
    <div
      className={cn(
        "w-full max-w-[1280px] min-w-0 mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6 lg:space-y-8",
        className
      )}
    >
      {eyebrow && (
        <div className="vf-enter-fade visible min-h-[1.5rem] text-sm text-muted-foreground">
          {eyebrow}
        </div>
      )}
      <header className="vf-enter-up visible">
        <PageHeader
          title={title}
          subtitle={description}
          action={action}
          showDisclaimer={showDisclaimer}
        />
      </header>

      <div
        className={cn(
          "grid gap-6 lg:gap-8",
          secondaryRail ? "lg:grid-cols-[minmax(0,1fr)_320px]" : ""
        )}
      >
        <div className="min-w-0 space-y-6 lg:space-y-8 order-1">
          {children}
        </div>
        {secondaryRail && (
          <aside className="min-w-0 space-y-6 lg:space-y-8 order-2 lg:order-2" aria-label="Supporting information">
            {secondaryRail}
          </aside>
        )}
      </div>
    </div>
  );
}
