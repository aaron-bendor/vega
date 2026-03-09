"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadPortfolioState } from "@/lib/vega-financial/portfolio-store";
import { VegaFinancialPageScaffold } from "@/components/vega-financial/VegaFinancialPageScaffold";
import { EmptyStateCard } from "@/components/vega-financial/EmptyStateCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Star } from "lucide-react";

type WatchlistItem = { id: string; name: string; shortDesc: string; riskLevel: string; role?: string };

export default function WatchlistPage() {
  const [items, setItems] = useState<WatchlistItem[] | null>(null);

  useEffect(() => {
    const state = loadPortfolioState();
    const ids = state.watchlist ?? [];
    if (ids.length === 0) {
      setItems([]);
      return;
    }
    fetch(`/api/vega-financial/watchlist-versions?ids=${encodeURIComponent(ids.join(","))}`)
      .then((res) => res.json())
      .then((data: WatchlistItem[]) => setItems(Array.isArray(data) ? data : []))
      .catch(() => setItems([]));
  }, []);

  return (
    <VegaFinancialPageScaffold
      title="Watchlist"
      description="Save strategies here to compare them later or review before allocating."
    >
      {items === null ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="rounded-xl border border-border overflow-hidden">
              <CardContent className="p-4 sm:p-5 lg:p-6 flex flex-col gap-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
                <Skeleton className="h-9 w-24 mt-2 rounded-lg" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyStateCard
          icon={<Star className="size-7" aria-hidden />}
          headline="No strategies saved yet"
          description="Save strategies here to compare them later or review before allocating."
          primaryAction={
            <Link
              href="/vega-financial/marketplace"
              className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium hover:bg-primary-hover focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring min-h-[44px]"
            >
              Browse strategies
            </Link>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Card key={item.id} className="rounded-xl border border-border bg-card overflow-hidden vf-section-shift">
              <CardContent className="p-4 sm:p-5 lg:p-6 flex flex-col gap-3">
                <div>
                  <h3 className="font-maven-pro font-semibold text-foreground">
                    <Link href={`/vega-financial/algorithms/${item.id}`} className="hover:underline focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring rounded">
                      {item.name}
                    </Link>
                  </h3>
                  <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">{item.shortDesc}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                    {item.riskLevel} risk
                  </span>
                  {item.role && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      {item.role}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mt-auto pt-2">
                  <Link href={`/vega-financial/algorithms/${item.id}`}>
                    <Button variant="default" size="sm" className="w-full sm:w-auto min-h-[44px]">
                      View details
                    </Button>
                  </Link>
                  <Link href={`/vega-financial/marketplace?compare=${item.id}`}>
                    <Button variant="outline" size="sm" className="w-full sm:w-auto min-h-[44px]">
                      Compare
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </VegaFinancialPageScaffold>
  );
}
