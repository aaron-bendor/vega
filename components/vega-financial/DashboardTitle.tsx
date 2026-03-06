"use client";

import { Badge } from "@/components/ui/badge";

export function DashboardTitle() {
  return (
    <header className="min-w-0 mb-6 sm:mb-8">
      <div className="flex flex-wrap items-baseline gap-2 sm:gap-3 mb-2">
        <h1 className="font-syne text-2xl sm:text-3xl font-bold text-foreground">
          Your demo portfolio
        </h1>
        <Badge variant="secondary" className="text-xs font-normal shrink-0">
          Simulated only
        </Badge>
      </div>
      <p className="text-sm text-muted-foreground max-w-xl mb-4">
        Track your paper allocations, review your holdings, and decide what to
        adjust next.
      </p>
    </header>
  );
}
