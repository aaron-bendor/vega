"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { loadPortfolioState } from "@/lib/vega-financial/portfolio-store";
import { formatCurrency } from "@/lib/utils/format";

export function DashboardRecentActivity() {
  const [activity, setActivity] = useState<{ algorithmName: string; type: string; amount: number; algorithmId: string }[]>([]);

  useEffect(() => {
    const state = loadPortfolioState();
    const recent = state.activityLog.slice(-5).reverse();
    setActivity(
      recent.map((e) => ({
        algorithmName: e.algorithmName,
        type: e.type,
        amount: e.amount,
        algorithmId: e.algorithmId,
      }))
    );
  }, []);

  if (activity.length === 0) return null;

  return (
    <Card className="rounded-2xl border border-border bg-card min-w-0">
      <CardContent className="py-4 sm:py-5 px-4 sm:px-5">
        <h3 className="text-sm font-medium text-foreground mb-3">
          Recent activity
        </h3>
        <ul className="space-y-2 text-sm">
          {activity.map((entry, i) => (
            <li key={i} className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <span className="text-muted-foreground capitalize">{entry.type}</span>
              <Link
                href={`/vega-financial/algorithms/${entry.algorithmId}`}
                className="font-medium text-foreground hover:underline"
              >
                {entry.algorithmName}
              </Link>
              <span className="text-muted-foreground">
                {formatCurrency(entry.amount)}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
