"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Wallet } from "lucide-react";
import { formatCurrency, formatPercent, UNAVAILABLE_IN_DEMO } from "@/lib/utils/format";
import { PageHeader } from "@/components/vega-financial/PageHeader";
import { SummaryMetricCard } from "@/components/vega-financial/SummaryMetricCard";
import { DashboardPortfolioChart } from "@/components/vega-financial/DashboardPortfolioChart";
import { PAGE_SUBTITLES, EMPTY_STATES } from "@/lib/vega-financial/investor-copy";
import {
  loadPortfolioState,
  seedFromMockAccountIfEmpty,
  subscribePortfolioUpdate,
} from "@/lib/vega-financial/portfolio-store";


export function PortfolioPageContent() {
  const [mounted, setMounted] = useState(false);
  const [availableCash, setAvailableCash] = useState(0);
  const [holdings, setHoldings] = useState<Array<{
    id: string;
    versionId: string;
    name: string;
    amount: number;
    currentValue: number;
    weight: number;
    tags: string[];
  }>>([]);

  const refresh = useCallback(() => {
    if (typeof window === "undefined") return;
    seedFromMockAccountIfEmpty();
    const state = loadPortfolioState();
    setAvailableCash(state.availableCash);
    setHoldings(
      state.holdings.map((h) => ({
        id: h.id,
        versionId: h.algorithmId,
        name: h.name,
        amount: h.allocated,
        currentValue: h.currentValue,
        weight: h.weight,
        tags: h.tags ?? [],
      }))
    );
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    refresh();
    const unsub = subscribePortfolioUpdate(refresh);
    return unsub;
  }, [mounted, refresh]);

  if (!mounted) {
    return (
      <div className="w-full max-w-6xl min-w-0 mx-auto px-4 py-6 sm:p-6 lg:p-8 space-y-8">
        <PageHeader title="Portfolio" subtitle={PAGE_SUBTITLES.portfolio} />
        <div className="animate-pulse rounded-xl bg-muted/50 h-32 w-full" aria-hidden />
      </div>
    );
  }

  const totalValue = holdings.reduce((sum, h) => sum + h.currentValue, 0);
  const totalInvested = holdings.reduce((sum, h) => sum + h.amount, 0);
  const totalReturnPct = totalInvested > 0 ? ((totalValue - totalInvested) / totalInvested) * 100 : 0;
  const equity = availableCash + totalValue;

  if (holdings.length === 0) {
    return (
      <div className="w-full max-w-6xl min-w-0 mx-auto px-4 py-6 sm:p-6 lg:p-8 space-y-8">
        <PageHeader title="Portfolio" subtitle={PAGE_SUBTITLES.portfolio} />
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <SummaryMetricCard label="Portfolio value" value={formatCurrency(availableCash)} />
          <SummaryMetricCard label="Total invested" value={formatCurrency(0)} />
          <SummaryMetricCard label="Total return" value={UNAVAILABLE_IN_DEMO} />
          <SummaryMetricCard label="Cash available" value={formatCurrency(availableCash)} />
        </section>
        <Card className="rounded-xl border border-border bg-card overflow-hidden">
          <CardContent className="py-14 px-6 text-center">
            <div className="size-14 rounded-full bg-muted border border-border flex items-center justify-center mx-auto mb-4">
              <Wallet className="size-7 text-primary/50" aria-hidden />
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              {EMPTY_STATES.noHoldings.headline}
            </h2>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
              {EMPTY_STATES.noHoldings.body}
            </p>
            <Link
              href="/vega-financial/marketplace"
              className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium hover:bg-primary/90 focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring"
            >
              {EMPTY_STATES.noHoldings.cta}
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl min-w-0 mx-auto px-4 py-6 sm:p-6 lg:p-8 space-y-8">
      <PageHeader title="Portfolio" subtitle={PAGE_SUBTITLES.portfolio} />

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4" aria-label="Portfolio summary">
        <SummaryMetricCard label="Total portfolio value" value={formatCurrency(equity)} />
        <SummaryMetricCard label="Invested" value={formatCurrency(totalInvested)} />
        <SummaryMetricCard
          label="Total return"
          value={formatPercent(totalReturnPct / 100)}
          variant={totalReturnPct >= 0 ? "positive" : "negative"}
        />
        <SummaryMetricCard label="Cash available" value={formatCurrency(availableCash)} />
      </section>

      <section aria-labelledby="portfolio-chart-heading">
        <h2 id="portfolio-chart-heading" className="sr-only">
          Portfolio performance
        </h2>
        <DashboardPortfolioChart currentValue={equity} />
      </section>

      <section aria-labelledby="holdings-heading">
        <h2 id="holdings-heading" className="font-syne text-lg font-semibold text-foreground mb-4">
          Holdings
        </h2>
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[400px] text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Strategy</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground">Allocated</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground">Current value</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground">Weight</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground">Return</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Risk</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Role</th>
                  <th className="w-24" />
                </tr>
              </thead>
              <tbody>
                {holdings.map((h) => {
                  const pnlPct = h.amount > 0 ? ((h.currentValue - h.amount) / h.amount) * 100 : 0;
                  const weightStr = totalValue > 0 ? ((h.currentValue / totalValue) * 100).toFixed(0) : "0";
                  return (
                    <tr key={h.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                      <td className="py-3 px-4">
                        <Link
                          href={`/vega-financial/algorithms/${h.versionId}`}
                          className="font-medium text-foreground hover:underline"
                        >
                          {h.name}
                        </Link>
                      </td>
                      <td className="py-3 px-4 text-right tabular-nums">{formatCurrency(h.amount)}</td>
                      <td className="py-3 px-4 text-right tabular-nums">{formatCurrency(h.currentValue)}</td>
                      <td className="py-3 px-4 text-right tabular-nums">{weightStr}%</td>
                      <td
                        className={`py-3 px-4 text-right tabular-nums ${pnlPct >= 0 ? "text-brand-green" : "text-brand-red"}`}
                      >
                        {formatPercent(pnlPct / 100)}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground text-xs">
                        Unavailable in current demo
                      </td>
                      <td className="py-3 px-4">
                        {h.tags?.length ? (
                          <span className="inline-flex items-center rounded-md border border-border bg-muted/40 px-2 py-0.5 text-xs font-medium text-foreground">
                            {h.tags[0]}
                          </span>
                        ) : (
                          <span className="text-muted-foreground text-xs">Unavailable in current demo</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <Link
                          href={`/vega-financial/algorithms/${h.versionId}`}
                          className="text-sm font-medium text-primary hover:underline"
                        >
                          View details
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section aria-labelledby="allocation-heading">
        <h2 id="allocation-heading" className="font-syne text-lg font-semibold text-foreground mb-4">
          Allocation breakdown
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="rounded-xl border border-border bg-card">
            <CardContent className="pt-4">
              <p className="text-xs font-medium text-muted-foreground mb-2">By strategy</p>
              <ul className="text-sm space-y-1">
                {holdings.map((h) => {
                  const pct = totalValue > 0 ? ((h.currentValue / totalValue) * 100).toFixed(0) : "0";
                  return (
                    <li key={h.id} className="flex justify-between gap-2">
                      <span className="truncate">{h.name}</span>
                      <span className="tabular-nums shrink-0">{pct}%</span>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>
          <Card className="rounded-xl border border-border bg-card">
            <CardContent className="pt-4">
              <p className="text-xs font-medium text-muted-foreground mb-2">Role mix</p>
              <p className="text-sm text-foreground">Growth and diversifier allocation shown in holdings.</p>
            </CardContent>
          </Card>
          <Card className="rounded-xl border border-border bg-card">
            <CardContent className="pt-4">
              <p className="text-xs font-medium text-muted-foreground mb-2">Risk mix</p>
              <p className="text-sm text-foreground">See risk level per strategy in the holdings table.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section aria-labelledby="diversification-heading">
        <h2 id="diversification-heading" className="font-syne text-lg font-semibold text-foreground mb-4">
          Diversification insights
        </h2>
        <Card className="rounded-xl border border-border bg-card">
          <CardContent className="pt-4">
            {holdings.length > 0 && (() => {
              const largest = holdings.reduce((a, b) => (a.currentValue > b.currentValue ? a : b));
              const largestPct = totalValue > 0 ? (largest.currentValue / totalValue) * 100 : 0;
              const isConcentrated = largestPct > 40;
              return (
                <>
                  <p className="text-sm font-medium text-foreground mb-1">Largest concentration</p>
                  <p className="text-sm text-muted-foreground mb-3">
                    {largest.name} at {largestPct.toFixed(0)}% of portfolio value.
                  </p>
                  <p className="text-sm text-foreground">
                    {isConcentrated
                      ? "Your portfolio is concentrated in one strategy. Consider adding a lower-correlation strategy or rebalancing to improve diversification."
                      : "Your portfolio is moderately balanced across strategies. You could add a diversifier to further reduce concentration risk."}
                  </p>
                </>
              );
            })()}
          </CardContent>
        </Card>
      </section>

      <section aria-labelledby="rebalancing-heading">
        <h2 id="rebalancing-heading" className="font-syne text-lg font-semibold text-foreground mb-4">
          Rebalancing ideas
        </h2>
        <ul className="space-y-2">
          {holdings.length > 1 && (() => {
            const largest = holdings.reduce((a, b) => (a.currentValue > b.currentValue ? a : b));
            const pct = totalValue > 0 ? (largest.currentValue / totalValue) * 100 : 0;
            if (pct > 35) {
              return (
                <>
                  <li className="text-sm text-muted-foreground">
                    Reduce concentration in {largest.name}
                  </li>
                  <li className="text-sm text-muted-foreground">
                    Add a lower-risk diversifier
                  </li>
                  <li className="text-sm text-muted-foreground">
                    Review overlap across growth strategies
                  </li>
                </>
              );
            }
            return (
              <>
                <li className="text-sm text-muted-foreground">Add a lower-risk diversifier</li>
                <li className="text-sm text-muted-foreground">Review overlap across growth strategies</li>
              </>
            );
          })()}
          {holdings.length <= 1 && (
            <li className="text-sm text-muted-foreground">
              Add a second strategy to see rebalancing ideas.
            </li>
          )}
        </ul>
      </section>
    </div>
  );
}
