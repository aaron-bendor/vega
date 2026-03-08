"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadPortfolioState } from "@/lib/vega-financial/portfolio-store";
import { PageHeader } from "@/components/vega-financial/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

type WatchlistItem = { id: string; name: string; shortDesc: string; riskLevel: string; role?: string };

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

  return (
    <div className="w-full max-w-6xl min-w-0 mx-auto px-4 py-6 sm:p-6 lg:p-8 space-y-8">
      <PageHeader
        title="Watchlist"
        subtitle="Save strategies here to compare them later or review before allocating."
      />

      {loading ? (
        <Card className="rounded-xl border border-border bg-card">
          <CardContent className="py-10 px-6 text-center text-muted-foreground text-sm">
            Loading…
          </CardContent>
        </Card>
      ) : items.length === 0 ? (
        <Card className="rounded-xl border border-border bg-card overflow-hidden">
          <CardContent className="py-14 px-6 text-center">
            <div className="size-14 rounded-full bg-muted border border-border flex items-center justify-center mx-auto mb-4">
              <Star className="size-7 text-primary/50" aria-hidden />
            </div>
            <h2 className="font-maven-pro text-lg font-semibold text-foreground mb-2">No strategies on your watchlist</h2>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
              Save strategies here to compare them later or review before allocating.
            </p>
            <Link
              href="/vega-financial/marketplace"
              className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium hover:bg-primary/90 focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring"
            >
              Explore strategies
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Card key={item.id} className="rounded-xl border border-border bg-card overflow-hidden">
              <CardContent className="p-4 flex flex-col gap-3">
                <div>
                  <h3 className="font-maven-pro font-semibold text-foreground">
                    <Link href={`/vega-financial/algorithms/${item.id}`} className="hover:underline">
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
                    <Button variant="default" size="sm" className="w-full sm:w-auto">
                      View details
                    </Button>
                  </Link>
                  <Link href={`/vega-financial/marketplace?compare=${item.id}`}>
                    <Button variant="outline" size="sm" className="w-full sm:w-auto">
                      Compare
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
