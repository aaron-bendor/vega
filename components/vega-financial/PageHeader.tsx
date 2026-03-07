"use client";

import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: ReactNode;
  /** Primary action (e.g. CTA button) shown on the right on desktop */
  action?: ReactNode;
}

/**
 * Standard page header for the investor product. Ensures clear hierarchy:
 * one title, one optional subtitle, one optional primary action.
 */
export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
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
        </div>
        {action && (
          <div className="shrink-0">{action}</div>
        )}
      </div>
    </header>
  );
}
