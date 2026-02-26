"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Download, Loader2 } from "lucide-react";

interface CachedItem {
  symbol: string;
  startDate: string;
  endDate: string;
  bars: number;
  lastUpdated: string;
}

interface DataStatusCardProps {
  symbols: string[];
  startDate: string;
  endDate: string;
}

export function DataStatusCard({ symbols, startDate, endDate }: DataStatusCardProps) {
  const [cached, setCached] = useState<CachedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    fetch("/api/data/status")
      .then((r) => r.json())
      .then((d) => setCached(d.cached ?? []))
      .catch(() => setCached([]))
      .finally(() => setLoading(false));
  }, [fetching]);

  const needed = symbols.filter((sym) => {
    const hit = cached.find(
      (c) =>
        c.symbol.toLowerCase().replace(/\./g, "") === sym.toLowerCase().replace(/\./g, "") &&
        c.startDate <= startDate &&
        c.endDate >= endDate &&
        c.bars > 0
    );
    return !hit;
  });

  const isCached = needed.length === 0;

  async function handleDownload() {
    setFetching(true);
    try {
      const res = await fetch("/api/data/prefetch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symbols: symbols.length ? symbols : ["^spx"],
          startDate,
          endDate,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Prefetch failed");
      setCached((prev) => {
        const next = [...prev];
        for (const r of data.results ?? []) {
          if (r.bars > 0) {
            next.push({
              symbol: r.symbol,
              startDate,
              endDate,
              bars: r.bars,
              lastUpdated: new Date().toISOString(),
            });
          }
        }
        return next;
      });
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Download failed");
    } finally {
      setFetching(false);
    }
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-base">Data source</CardTitle>
        <p className="text-sm text-muted-foreground">
          Stooq (daily OHLC), symbol(s): {symbols.join(", ") || "^spx"}, range: {startDate} – {endDate}
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading ? (
          <p className="text-sm text-muted-foreground">Checking cache…</p>
        ) : isCached ? (
          <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-500">
            <CheckCircle2 className="size-4" />
            Cache ready. Charts will use real historical data.
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-amber-600 dark:text-amber-500">
              {needed.length > 0
                ? `Missing: ${needed.join(", ")}. Download data to see real-data plots.`
                : "Run prefetch or click below to download."}
            </p>
            <Button
              size="sm"
              onClick={handleDownload}
              disabled={fetching}
            >
              {fetching ? (
                <Loader2 className="size-4 animate-spin mr-2" />
              ) : (
                <Download className="size-4 mr-2" />
              )}
              Download data
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
