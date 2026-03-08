"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadPortfolioState } from "@/lib/vega-financial/portfolio-store";
import { VegaFinancialPageScaffold } from "@/components/vega-financial/VegaFinancialPageScaffold";
import { WatchlistPageSkeleton } from "@/components/vega-financial/WatchlistPageSkeleton";
import { EmptyStateCard } from "@/components/vega-financial/EmptyStateCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, ArrowRight } from "lucide-react";

type WatchlistItem = { id: string; name: string; shortDesc: string; riskLevel: string; role?: string };

const SUGGESTED_LINKS = [
  { label: "Low risk starters", href: "/vega-financial/marketplace?risk=Low", desc: "Strategies with lower volatility." },
  { label: "Diversifiers", href: "/vega-financial/marketplace?tag=Mean%20Reversion", desc: "May help balance your portfolio." },
];

export default function WatchlistPage() {
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const state = loadPortfolioState();
    const ids = state.watchlist ?? [];
    if (ids.length === 0) {
      setItems([]);
      setLoading(false);
      return;
    }
    fetch(`/api/vega-financial/watchlist-versions?ids=${encodeURIComponent(ids.join(","))}`)
      .then((res) => res.json())
      .then((data: WatchlistItem[]) => setItems(Array.isArray(data) ? data : []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <WatchlistPageSkeleton />;
  }

  return (
    <VegaFinancialPageScaffold
      title="Watchlist"
      description="Save strategies here to compare them later or review before allocating."
    >
      {items.length === 0 ? (
        <EmptyStateCard
          icon={<Star className="size-7" aria-hidden />}
          headline="No strategies on your watchlist"
          description="Save strategies here to compare them later or review before allocating."
          primaryAction={
            <Link
              href="/vega-financial/marketplace"
              className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium hover:bg-primary-hover focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring min-h-[44px]"
            >
              Explore strategies
            </Link>
          }
          secondaryAction={
            <Link
              href="/vega-financial/marketplace?risk=Low"
              className="inline-flex items-center justify-center rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground hover:bg-accent focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring min-h-[44px]"
            >
              View low risk starters
            </Link>
          }
          preview={
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SUGGESTED_LINKS.map(({ label, href, desc }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center justify-between gap-2 rounded-lg border border-border bg-muted/30 px-4 py-3 text-left hover:border-primary/30 hover:bg-accent/50 transition-colors focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring group"
                >
                  <div className="min-w-0">
                    <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                      {label}
                    </span>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{desc}</p>
                  </div>
                  <ArrowRight className="size-4 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" aria-hidden />
                </Link>
              ))}
            </div>
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
