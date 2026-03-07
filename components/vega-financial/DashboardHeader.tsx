"use client";

import { INVESTOR_DISCLAIMER, PAGE_SUBTITLES } from "@/lib/vega-financial/investor-copy";

export function DashboardHeader() {
  return (
    <header className="min-w-0 mb-6 sm:mb-8" aria-label="Dashboard header">
      <div className="flex flex-col gap-3 sm:gap-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="min-w-0 max-w-2xl">
            <h1 className="font-maven-pro text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground tracking-tight">
              Dashboard
            </h1>
            <p className="text-sm text-muted-foreground mt-1.5 max-w-xl">
              {PAGE_SUBTITLES.dashboard}
            </p>
          </div>
        </div>
        <div className="flex justify-end">
          <span
            className="text-[11px] sm:text-xs text-muted-foreground/80"
            title={INVESTOR_DISCLAIMER}
            aria-label={INVESTOR_DISCLAIMER}
          >
            {INVESTOR_DISCLAIMER}
          </span>
        </div>
      </div>
    </header>
  );
}
