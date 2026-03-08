"use client";

import { PAGE_SUBTITLES, DEMO_STAGES } from "@/lib/vega-financial/investor-copy";

const DISCLAIMER_ITEMS = ["Paper trading only", "University prototype", "Not investment advice"];

export function DashboardHeader() {
  return (
    <header className="min-w-0 mb-6 sm:mb-8" aria-label="Portfolio header">
      <div className="flex flex-col gap-3">
        <div className="min-w-0 max-w-2xl">
          <h1 className="font-maven-pro text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground tracking-tight">
            Your portfolio
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5 max-w-xl">
            {PAGE_SUBTITLES.dashboard}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {DEMO_STAGES.understand} → {DEMO_STAGES.explore} → {DEMO_STAGES.personalise}
          </p>
        </div>
        <div
          className="flex flex-wrap items-center gap-x-4 gap-y-1 py-2 px-3 rounded-lg bg-muted/60 border border-border/80 text-[11px] sm:text-xs text-muted-foreground"
          role="status"
          aria-label="Disclaimer"
        >
          {DISCLAIMER_ITEMS.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>
    </header>
  );
}
