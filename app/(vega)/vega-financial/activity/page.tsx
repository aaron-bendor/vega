"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadPortfolioState, type ActivityLogEntry } from "@/lib/vega-financial/portfolio-store";
import { VegaFinancialPageScaffold } from "@/components/vega-financial/VegaFinancialPageScaffold";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Star } from "lucide-react";
import { ROUTES } from "@/lib/routes";

function formatTime(iso: string): string {
  try {
    const d = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
    return d.toLocaleDateString(undefined, { day: "numeric", month: "short", year: d.getFullYear() !== now.getFullYear() ? "numeric" : undefined });
  } catch {
    return iso;
  }
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function eventLabel(entry: ActivityLogEntry): string {
  switch (entry.type) {
    case "allocate":
      return "Bought";
    case "reduce":
      return "Sold";
    case "remove":
      return "Exited";
    default:
      return "Portfolio updated";
  }
}

function eventDescription(entry: ActivityLogEntry): string {
  switch (entry.type) {
    case "allocate":
      return `Bought ${formatCurrency(entry.amount)} of ${entry.algorithmName}`;
    case "reduce":
      return `Sold ${formatCurrency(entry.amount)} of ${entry.algorithmName}`;
    case "remove":
      return `Exited ${entry.algorithmName}`;
    default:
      return `${entry.algorithmName}`;
  }
}

/** Synthetic demo events shown when the user has no activity yet. */
const SYNTHETIC_DEMO_EVENTS: ActivityLogEntry[] = [
  {
    id: "demo-1",
    type: "allocate",
    algorithmId: "demo-1",
    algorithmName: "UK Equity Momentum",
    amount: 5000,
    at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "demo-2",
    type: "allocate",
    algorithmId: "demo-2",
    algorithmName: "Multi-Asset Diversifier",
    amount: 3000,
    at: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: "demo-3",
    type: "allocate",
    algorithmId: "demo-3",
    algorithmName: "Low Volatility Income",
    amount: 2000,
    at: new Date(Date.now() - 86400000 * 7).toISOString(),
  },
  {
    id: "demo-4",
    type: "reduce",
    algorithmId: "demo-1",
    algorithmName: "UK Equity Momentum",
    amount: 1000,
    previousAmount: 5000,
    at: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: "demo-5",
    type: "remove",
    algorithmId: "demo-4",
    algorithmName: "Tactical Rotation",
    amount: 0,
    at: new Date(Date.now() - 86400000 * 10).toISOString(),
  },
];

export default function ActivityPage() {
  const [entries, setEntries] = useState<ActivityLogEntry[]>([]);

  useEffect(() => {
    const state = loadPortfolioState();
    setEntries(state.activityLog ?? []);
  }, []);

  const rawEntries = entries.length > 0 ? entries : SYNTHETIC_DEMO_EVENTS;
  const sortedEntries = [...rawEntries].sort(
    (a, b) => new Date(b.at).getTime() - new Date(a.at).getTime()
  );
  const isEmpty = entries.length === 0;

  return (
    <VegaFinancialPageScaffold
      title="Activity"
      description="Allocations, watchlist changes, and portfolio updates."
    >
      <section aria-label="Activity timeline">
        <Card className="rounded-xl border border-border bg-card overflow-hidden">
          <CardContent className="p-0">
            {isEmpty ? (
              <div className="p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <div>
                    <h2 className="font-maven-pro text-base font-semibold text-foreground">
                      Activity timeline
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      When you allocate to a strategy, add or remove from your watchlist, or change your portfolio, those events will show up here. Explore strategies to get started.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 shrink-0">
                    <Button asChild variant="default" size="sm" className="min-h-[44px]">
                      <Link href={ROUTES.vegaFinancial.marketplace} className="inline-flex items-center gap-2">
                        <Plus className="size-4" aria-hidden />
                        Explore strategies
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm" className="min-h-[44px]">
                      <Link href={ROUTES.vegaFinancial.watchlist} className="inline-flex items-center gap-2">
                        <Star className="size-4" aria-hidden />
                        View watchlist
                      </Link>
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mb-3">Sample activity — allocate to strategies to see your own timeline.</p>
                <ul className="divide-y divide-border">
                  {sortedEntries.slice(0, 5).map((entry) => (
                    <li key={entry.id} className="px-4 py-3 sm:px-6 sm:py-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                        <div>
                          <p className="font-medium text-foreground">{eventLabel(entry)}</p>
                          <p className="text-sm text-muted-foreground">{eventDescription(entry)}</p>
                        </div>
                        <p className="text-xs text-muted-foreground shrink-0" aria-hidden>
                          {formatTime(entry.at)}
                        </p>
                      </div>
                      <Link
                        href={ROUTES.vegaFinancial.algorithm(entry.algorithmId)}
                        className="text-sm font-medium text-primary hover:underline mt-1 inline-block focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring rounded"
                      >
                        View strategy
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {sortedEntries.map((entry) => (
                  <li key={entry.id} className="px-4 py-3 sm:px-6 sm:py-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                      <div>
                        <p className="font-medium text-foreground">{eventLabel(entry)}</p>
                        <p className="text-sm text-muted-foreground">{eventDescription(entry)}</p>
                      </div>
                      <p className="text-xs text-muted-foreground shrink-0" aria-hidden>
                        {formatTime(entry.at)}
                      </p>
                    </div>
                    <Link
                      href={ROUTES.vegaFinancial.algorithm(entry.algorithmId)}
                      className="text-sm font-medium text-primary hover:underline mt-1 inline-block focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring rounded"
                    >
                      View strategy
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </section>
    </VegaFinancialPageScaffold>
  );
}
