"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils/format";
import { EMPTY_STATES } from "@/lib/vega-financial/investor-copy";
import { loadPortfolioState, subscribePortfolioUpdate } from "@/lib/vega-financial/portfolio-store";

interface ActivityEntry {
  algorithmName: string;
  type: string;
  amount: number;
  algorithmId: string;
  at?: string;
}

export function DashboardRecentActivity() {
  const [activity, setActivity] = useState<ActivityEntry[]>([]);

  const refresh = useCallback(() => {
    const state = loadPortfolioState();
    const recent = state.activityLog.slice(-5).reverse();
    setActivity(
      recent.map((e) => ({
        algorithmName: e.algorithmName,
        type: e.type === "allocate" ? "Demo allocation made" : e.type,
        amount: e.amount,
        algorithmId: e.algorithmId,
        at: e.at,
      }))
    );
  }, []);

  useEffect(() => {
    refresh();
    const unsub = subscribePortfolioUpdate(refresh);
    return unsub;
  }, [refresh]);

  if (activity.length === 0) {
    return (
      <section aria-labelledby="recent-activity-heading">
        <div className="mb-4">
          <h2 id="recent-activity-heading" className="font-syne text-lg font-semibold text-foreground">
            Recent activity
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Deposits, allocations, and portfolio changes
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6 sm:p-8 text-center">
          <h3 className="text-sm font-semibold text-foreground">
            {EMPTY_STATES.noActivity.headline}
          </h3>
          <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
            {EMPTY_STATES.noActivity.body}
          </p>
          <Link
            href="/vega-financial/marketplace"
            className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-medium h-10 px-4 mt-4 min-h-[44px] hover:bg-primary/90 focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring"
          >
            {EMPTY_STATES.noActivity.cta}
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section aria-labelledby="recent-activity-heading">
      <div className="mb-4">
        <h2 id="recent-activity-heading" className="font-syne text-lg font-semibold text-foreground">
          Recent activity
        </h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Deposits, allocations, and portfolio changes
        </p>
      </div>
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <ul className="divide-y divide-border">
          {activity.map((entry, i) => (
            <li
              key={i}
              className="flex flex-wrap items-center gap-x-2 gap-y-1 py-3 px-4 hover:bg-muted/20 transition-colors min-h-[44px] sm:min-h-0"
            >
              {entry.at && (
                <span className="text-xs text-muted-foreground tabular-nums w-[90px] shrink-0">
                  {formatActivityDate(entry.at)}
                </span>
              )}
              <span className="text-sm text-muted-foreground capitalize shrink-0">{entry.type}</span>
              <Link
                href={`/vega-financial/algorithms/${entry.algorithmId}`}
                className="font-medium text-foreground hover:underline text-sm"
              >
                {entry.algorithmName}
              </Link>
              <span className="text-sm text-muted-foreground tabular-nums ml-auto">
                {formatCurrency(entry.amount)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function formatActivityDate(iso: string): string {
  try {
    const d = new Date(iso);
    const now = new Date();
    const sameDay = d.toDateString() === now.toDateString();
    if (sameDay) {
      return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
    }
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  } catch {
    return "";
  }
}
