"use client";

import Link from "next/link";
import { formatCurrency, formatPercent } from "@/lib/utils/format";
import type { MockAccount } from "@/lib/mock/portfolio";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AllocationDonut } from "@/components/vega-financial/AllocationDonut";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, TrendingDown, DollarSign, PiggyBank } from "lucide-react";

interface PortfolioOverviewProps {
  account: MockAccount;
}

export function PortfolioOverview({ account }: PortfolioOverviewProps) {
  if (account.holdings.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-12 text-center">
          <div className="size-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <PiggyBank className="size-6 text-muted-foreground" />
          </div>
          <h3 className="font-medium mb-2">No holdings yet</h3>
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

  const allocationData = account.holdings.map((h, i) => ({
    name: h.name,
    value: h.weight,
    color: [
      "hsl(var(--chart-1))",
      "hsl(var(--chart-2))",
      "hsl(var(--chart-3))",
      "hsl(var(--chart-4))",
    ][i] ?? "hsl(var(--chart-5))",
  }));

  return (
    <div className="space-y-4">
      {/* Key metrics */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="size-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground font-medium">Equity</span>
            </div>
            <span className="text-xl font-bold">{formatCurrency(account.equity)}</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-2 mb-1">
              <PiggyBank className="size-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground font-medium">Available cash</span>
            </div>
            <span className="text-xl font-bold">{formatCurrency(account.availableCash)}</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="size-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground font-medium">Allocated</span>
            </div>
            <span className="text-xl font-bold">{formatCurrency(account.allocated)}</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-2 mb-1">
              {account.unrealizedPnl >= 0
                ? <TrendingUp className="size-3.5 text-green-600" />
                : <TrendingDown className="size-3.5 text-destructive" />}
              <span className="text-xs text-muted-foreground font-medium">Unrealised PnL</span>
            </div>
            <span className={`text-xl font-bold ${account.unrealizedPnl >= 0 ? "text-green-600" : "text-destructive"}`}>
              {account.unrealizedPnl >= 0 ? "+" : ""}
              {formatCurrency(account.unrealizedPnl)}
            </span>
            <span className={`text-xs ml-1 ${account.unrealizedPnl >= 0 ? "text-green-600" : "text-destructive"}`}>
              ({formatPercent(account.unrealizedPnlPct / 100)})
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Allocation + Holdings */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Allocation</CardTitle>
          </CardHeader>
          <CardContent>
            <AllocationDonut data={allocationData} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Holdings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-2 font-medium text-muted-foreground">Algorithm</th>
                    <th className="pb-2 font-medium text-muted-foreground text-right">Value</th>
                    <th className="pb-2 font-medium text-muted-foreground text-right hidden sm:table-cell">Weight</th>
                    <th className="pb-2 font-medium text-muted-foreground text-right hidden sm:table-cell">Return</th>
                  </tr>
                </thead>
                <tbody>
                  {account.holdings.map((h) => (
                    <tr key={h.id} className="border-b last:border-0">
                      <td className="py-3">
                        <Link
                          href={`/algo/${h.algorithmId}`}
                          className="font-medium hover:underline"
                        >
                          {h.name}
                        </Link>
                        <div className="flex gap-1 mt-1">
                          {h.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-[10px]">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 text-right font-medium">
                        {formatCurrency(h.currentValue)}
                      </td>
                      <td className="py-3 text-right text-muted-foreground hidden sm:table-cell">
                        {h.weight.toFixed(1)}%
                      </td>
                      <td className={`py-3 text-right font-medium hidden sm:table-cell ${h.returnPct >= 0 ? "text-green-600" : "text-destructive"}`}>
                        {h.returnPct >= 0 ? "+" : ""}{formatPercent(h.returnPct / 100)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
