"use client";

import Link from "next/link";
import { formatCurrency, formatPercent } from "@/lib/utils/format";
import type { MockAccount } from "@/lib/mock/portfolio";
import { Card, CardContent } from "@/components/ui/card";
import { AllocationDonut } from "@/components/vega-financial/AllocationDonut";
import { RiskBadge } from "@/components/vega-financial/RiskBadge";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, TrendingDown, DollarSign, PiggyBank } from "lucide-react";

interface PortfolioOverviewProps {
  account: MockAccount;
}

export function PortfolioOverview({ account }: PortfolioOverviewProps) {
  if (account.holdings.length === 0) {
    return (
      <Card className="rounded-2xl border-primary/20 bg-primary/[0.03]" data-tour="vf-overview">
        <CardContent className="py-12 text-center">
          <div className="size-12 rounded-full bg-[rgba(51,51,51,0.04)] flex items-center justify-center mx-auto mb-4">
            <PiggyBank className="size-6 text-muted-foreground" />
          </div>
          <h3 className="font-semibold mb-2 text-foreground">No holdings yet</h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
            Explore the marketplace and add algorithms to your paper portfolio
            to see your positions here.
          </p>
          <Button asChild>
            <Link href="#marketplace" className="gap-2">
              Explore algorithms <ArrowRight className="size-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const allocationData = account.holdings.map((h) => ({
    name: h.name,
    value: h.weight,
  }));

  return (
    <Card className="rounded-2xl border-primary/20 bg-primary/[0.03]" data-tour="vf-overview">
      <div className="p-5">
        {/* Top row: metrics (no inner borders) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="size-3.5 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">Equity</span>
            </div>
            <span className="text-xl font-semibold text-foreground tabular-nums">
              {formatCurrency(account.equity)}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <PiggyBank className="size-3.5 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">Available cash</span>
            </div>
            <span className="text-xl font-semibold text-foreground tabular-nums">
              {formatCurrency(account.availableCash)}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="size-3.5 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">Allocated</span>
            </div>
            <span className="text-xl font-semibold text-foreground tabular-nums">
              {formatCurrency(account.allocated)}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              {account.unrealizedPnl >= 0 ? (
                <TrendingUp className="size-3.5 text-brand-green" />
              ) : (
                <TrendingDown className="size-3.5 text-brand-red" />
              )}
              <span className="text-xs font-medium text-muted-foreground">Unrealised PnL</span>
            </div>
            <span
              className={`text-xl font-semibold tabular-nums ${account.unrealizedPnl >= 0 ? "text-brand-green" : "text-brand-red"}`}
            >
              {account.unrealizedPnl >= 0 ? "+" : ""}
              {formatCurrency(account.unrealizedPnl)}
            </span>
            <span
              className={`text-xs ml-1 ${account.unrealizedPnl >= 0 ? "text-brand-green" : "text-brand-red"}`}
            >
              ({formatPercent(account.unrealizedPnlPct / 100)})
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[rgba(51,51,51,0.12)] my-5" />

        {/* Two-column: allocation + holdings */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-3">Allocation</p>
            <AllocationDonut data={allocationData} />
          </div>
          <div className="lg:col-span-2" data-tour="vf-holdings">
            <p className="text-xs font-medium text-muted-foreground mb-3">Holdings</p>
            <div className="overflow-x-auto -mx-1">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[rgba(51,51,51,0.12)]">
                    <th className="pb-2 text-left text-xs font-medium text-muted-foreground">
                      Algorithm
                    </th>
                    <th className="pb-2 text-center text-xs font-medium text-muted-foreground w-20">
                      Risk
                    </th>
                    <th className="pb-2 text-right text-xs font-medium text-muted-foreground">
                      Value
                    </th>
                    <th className="pb-2 text-right text-xs font-medium text-muted-foreground hidden sm:table-cell">
                      Weight
                    </th>
                    <th className="pb-2 text-right text-xs font-medium text-muted-foreground hidden sm:table-cell">
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
                      <td>
                        <Link
                          href={`/vega-financial/algorithms/${h.algorithmId}`}
                          className="font-medium hover:underline text-foreground truncate block max-w-[180px]"
                          title={h.name}
                        >
                          {h.name}
                        </Link>
                      </td>
                      <td className="text-center">
                        {h.riskScore != null ? (
                          <RiskBadge score={h.riskScore} variant="compact" />
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="text-right font-medium tabular-nums">
                        {formatCurrency(h.currentValue)}
                      </td>
                      <td className="text-right text-muted-foreground tabular-nums hidden sm:table-cell">
                        {h.weight.toFixed(1)}%
                      </td>
                      <td className="text-right hidden sm:table-cell">
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
    </Card>
  );
}
