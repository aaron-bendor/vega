"use client";

import Link from "next/link";
import { formatCurrency, formatPercent } from "@/lib/utils/format";
import type { MockAccount } from "@/lib/mock/portfolio";
import { Card, CardContent } from "@/components/ui/card";
import { AllocationDonut } from "@/components/vega-financial/AllocationDonut";
import { RiskBadge } from "@/components/vega-financial/RiskBadge";
import { Button } from "@/components/ui/button";
import { useCountUp } from "@/hooks/useCountUp";
import { ArrowRight, TrendingUp, TrendingDown, DollarSign, PiggyBank } from "lucide-react";

interface PortfolioOverviewProps {
  account: MockAccount;
}

export function PortfolioOverview({ account }: PortfolioOverviewProps) {
  const hasHoldings = account.holdings.length > 0;
  const equityDisplay = useCountUp(account.equity, { duration: 900, enabled: hasHoldings });
  const cashDisplay = useCountUp(account.availableCash, { duration: 900, enabled: hasHoldings });
  const allocatedDisplay = useCountUp(account.allocated, { duration: 900, enabled: hasHoldings });
  const pnlDisplay = useCountUp(Math.abs(account.unrealizedPnl), { duration: 800, enabled: hasHoldings });

  if (!hasHoldings) {
    return (
      <Card className="rounded-2xl border border-border bg-card min-w-0 overflow-hidden transition-colors duration-200" data-tour="vf-overview">
        <CardContent className="py-8 sm:py-12 px-4 sm:px-6 text-center">
          <div className="size-14 rounded-full bg-muted border border-border flex items-center justify-center mx-auto mb-5 transition-transform duration-300 hover:scale-105 motion-reduce:hover:scale-100">
            <PiggyBank className="size-7 text-primary/60" aria-hidden />
          </div>
          <h3 className="font-maven-pro font-semibold mb-2 text-foreground text-base sm:text-lg">No paper allocations yet</h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto break-words">
            Start by exploring two or three strategies with different styles. A simple first
            portfolio usually works better when it is diversified across approaches rather than
            concentrated in one idea.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Button asChild>
              <Link href="/vega-financial/marketplace" className="gap-2 justify-center w-full sm:w-auto min-h-[44px] inline-flex items-center">
                Explore strategies <ArrowRight className="arrow-icon size-4 shrink-0" aria-hidden />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/vega-financial/marketplace?risk=Low" className="gap-2 justify-center w-full sm:w-auto min-h-[44px] inline-flex items-center">
                Start with lower-risk ideas
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const allocationData = account.holdings.map((h) => ({
    name: h.name,
    value: h.weight,
  }));

  return (
    <Card className="rounded-2xl border border-border bg-card min-w-0 overflow-hidden transition-colors duration-200" data-tour="vf-overview">
      <div className="p-4 sm:p-5 min-w-0">
        {/* Top row: metrics — 2 cols mobile, 4 cols desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 min-w-0">
          <div className="min-w-0 transition-opacity duration-300">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="size-3.5 shrink-0 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground truncate">Equity</span>
            </div>
            <span className="text-base sm:text-xl font-semibold text-foreground tabular-nums break-all">
              {formatCurrency(equityDisplay)}
            </span>
          </div>
          <div className="min-w-0 transition-opacity duration-300">
            <div className="flex items-center gap-2 mb-1">
              <PiggyBank className="size-3.5 shrink-0 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground truncate">Available cash</span>
            </div>
            <span className="text-base sm:text-xl font-semibold text-foreground tabular-nums break-all">
              {formatCurrency(cashDisplay)}
            </span>
          </div>
          <div className="min-w-0 transition-opacity duration-300">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="size-3.5 shrink-0 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground truncate">Allocated</span>
            </div>
            <span className="text-base sm:text-xl font-semibold text-foreground tabular-nums break-all">
              {formatCurrency(allocatedDisplay)}
            </span>
          </div>
          <div className="min-w-0 transition-opacity duration-300">
            <div className="flex items-center gap-2 mb-1">
              {account.unrealizedPnl >= 0 ? (
                <TrendingUp className="size-3.5 shrink-0 text-brand-green" />
              ) : (
                <TrendingDown className="size-3.5 shrink-0 text-brand-red" />
              )}
              <span className="text-xs font-medium text-muted-foreground truncate">Unrealised PnL</span>
            </div>
            <span
              className={`text-base sm:text-xl font-semibold tabular-nums break-all ${account.unrealizedPnl >= 0 ? "text-brand-green" : "text-brand-red"}`}
            >
              {account.unrealizedPnl >= 0 ? "+" : "−"}
              {formatCurrency(pnlDisplay)}
            </span>
            <span
              className={`text-xs ml-1 block sm:inline ${account.unrealizedPnl >= 0 ? "text-brand-green" : "text-brand-red"}`}
            >
              ({formatPercent(account.unrealizedPnlPct / 100)})
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[rgba(51,51,51,0.12)] my-4 sm:my-5" />

        {/* Single column mobile; two-column desktop: allocation + holdings */}
        <div className="grid gap-6 lg:grid-cols-3 min-w-0">
          <div className="min-w-0">
            <p className="text-xs font-medium text-muted-foreground mb-3">Allocation</p>
            <AllocationDonut data={allocationData} />
          </div>
          <div className="lg:col-span-2 min-w-0" data-tour="vf-holdings">
            <p className="text-xs font-medium text-muted-foreground mb-3">Holdings</p>

            {/* Mobile: stacked holding cards */}
            <ul className="flex flex-col gap-3 md:hidden list-none p-0 m-0">
              {account.holdings.map((h) => (
                <li key={h.id}>
                  <Link
                    href={`/vega-financial/algorithms/${h.algorithmId}`}
                    className="block rounded-xl border border-[rgba(51,51,51,0.12)] bg-[rgba(51,51,51,0.02)] p-4 hover:bg-[rgba(51,51,51,0.04)] transition-colors min-h-[44px]"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="font-medium text-sm text-foreground break-words min-w-0">
                        {h.name}
                      </span>
                      {h.riskScore != null ? (
                        <RiskBadge score={h.riskScore} variant="compact" />
                      ) : (
                        <span className="text-xs text-muted-foreground shrink-0">—</span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                      <span className="text-muted-foreground">Value</span>
                      <span className="font-medium tabular-nums text-foreground">
                        {formatCurrency(h.currentValue)}
                      </span>
                      <span className="text-muted-foreground">Weight</span>
                      <span className="tabular-nums text-foreground">{h.weight.toFixed(1)}%</span>
                      <span className="text-muted-foreground">Return</span>
                      <span
                        className={`tabular-nums ${h.returnPct >= 0 ? "text-brand-green" : "text-brand-red"}`}
                      >
                        {h.returnPct >= 0 ? (
                          <span className="inline-flex items-center gap-0.5">
                            <TrendingUp className="size-3" aria-hidden />
                            {formatPercent(h.returnPct / 100)}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-0.5">
                            <TrendingDown className="size-3" aria-hidden />
                            {formatPercent(h.returnPct / 100)}
                          </span>
                        )}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Desktop: table */}
            <div className="hidden md:block min-w-0">
              <div className="overflow-x-auto -mx-1">
                <table className="w-full min-w-0 text-sm">
                  <thead>
                    <tr className="border-b border-[rgba(51,51,51,0.12)]">
                      <th className="pb-2 text-left text-xs font-medium text-muted-foreground min-w-0">
                        Algorithm
                      </th>
                      <th className="pb-2 text-center text-xs font-medium text-muted-foreground w-20 shrink-0">
                        Risk
                      </th>
                      <th className="pb-2 text-right text-xs font-medium text-muted-foreground shrink-0">
                        Value
                      </th>
                      <th className="pb-2 text-right text-xs font-medium text-muted-foreground shrink-0">
                        Weight
                      </th>
                      <th className="pb-2 text-right text-xs font-medium text-muted-foreground shrink-0">
                        Return
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {account.holdings.map((h) => (
                      <tr
                        key={h.id}
                        className="border-b border-[rgba(51,51,51,0.12)] last:border-0 hover:bg-[rgba(51,51,51,0.03)] h-11 transition-colors"
                      >
                        <td className="min-w-0">
                          <Link
                            href={`/vega-financial/algorithms/${h.algorithmId}`}
                            className="font-medium hover:underline text-foreground truncate block max-w-full"
                            title={h.name}
                          >
                            {h.name}
                          </Link>
                        </td>
                        <td className="text-center shrink-0">
                          {h.riskScore != null ? (
                            <RiskBadge score={h.riskScore} variant="compact" />
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="text-right font-medium tabular-nums shrink-0">
                          {formatCurrency(h.currentValue)}
                        </td>
                        <td className="text-right text-muted-foreground tabular-nums shrink-0">
                          {h.weight.toFixed(1)}%
                        </td>
                        <td className="text-right shrink-0">
                          <span
                            className={`inline-flex items-center gap-1 tabular-nums ${h.returnPct >= 0 ? "text-brand-green" : "text-brand-red"}`}
                          >
                            {h.returnPct >= 0 ? (
                              <TrendingUp className="size-3" />
                            ) : (
                              <TrendingDown className="size-3" />
                            )}
                            {formatPercent(h.returnPct / 100)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
