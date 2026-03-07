"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadPortfolioState, type ActivityLogEntry } from "@/lib/vega-financial/portfolio-store";
import { PageHeader } from "@/components/vega-financial/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Activity } from "lucide-react";

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

function eventLabel(entry: ActivityLogEntry): string {
  switch (entry.type) {
    case "allocate":
      return "Demo allocation made";
    case "reduce":
      return "Demo allocation reduced";
    case "remove":
      return "Removed from portfolio";
    default:
      return "Portfolio updated";
  }
}

function eventDescription(entry: ActivityLogEntry): string {
  switch (entry.type) {
    case "allocate":
      return `Allocated ${entry.amount} to ${entry.algorithmName}`;
    case "reduce":
      return `Reduced allocation to ${entry.algorithmName}`;
    case "remove":
      return `Removed ${entry.algorithmName} from portfolio`;
    default:
      return `${entry.algorithmName}`;
  }
}

export default function ActivityPage() {
  const [entries, setEntries] = useState<ActivityLogEntry[]>([]);

  useEffect(() => {
    const state = loadPortfolioState();
    setEntries(state.activityLog ?? []);
  }, []);

  const sortedEntries = [...entries].sort(
    (a, b) => new Date(b.at).getTime() - new Date(a.at).getTime()
  );

  return (
    <div className="w-full max-w-6xl min-w-0 mx-auto px-4 py-6 sm:p-6 lg:p-8 space-y-8">
      <PageHeader
        title="Activity"
        subtitle="Allocations, watchlist changes, and portfolio updates."
      />

      {sortedEntries.length === 0 ? (
        <Card className="rounded-xl border border-border bg-card overflow-hidden">
          <CardContent className="py-14 px-6 text-center">
            <div className="size-14 rounded-full bg-muted border border-border flex items-center justify-center mx-auto mb-4">
              <Activity className="size-7 text-primary/50" aria-hidden />
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-2">No activity yet</h2>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Allocations, watchlist changes, and portfolio updates will appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="rounded-xl border border-border bg-card overflow-hidden">
          <CardContent className="p-0">
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
                    href={`/vega-financial/algorithms/${entry.algorithmId}`}
                    className="text-sm font-medium text-primary hover:underline mt-1 inline-block"
                  >
                    View strategy
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
