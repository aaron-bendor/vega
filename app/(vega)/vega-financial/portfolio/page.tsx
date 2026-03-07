export const dynamic = "force-dynamic";
import { getInvestmentsForUser } from "@/lib/db/portfolio";
import { withDbOrThrow } from "@/lib/db/safe";
import { getLatestBacktestForVersion } from "@/lib/db/backtests";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Wallet } from "lucide-react";
import { formatCurrency, formatPercent } from "@/lib/utils/format";
import { PageHeader } from "@/components/vega-financial/PageHeader";
import { SummaryMetricCard } from "@/components/vega-financial/SummaryMetricCard";
import { DashboardPortfolioChart } from "@/components/vega-financial/DashboardPortfolioChart";
import { PAGE_SUBTITLES, EMPTY_STATES } from "@/lib/vega-financial/investor-copy";

const DEMO_CASH = 100000;

export default async function VegaFinancialPortfolioPage() {
  const { data: investments, dbAvailable } = await withDbOrThrow(
    () => getInvestmentsForUser(),
    []
  );

  const holdingsWithValue = await Promise.all(
    investments.map(async (inv) => {
      const backtest = await getLatestBacktestForVersion(inv.versionId);
      const lastEquity = backtest?.equityPoints.at(-1)?.value;
      const pricePerUnit = lastEquity && lastEquity > 0 ? lastEquity : 10000;
      const currentValue = inv.units * pricePerUnit;
      return { ...inv, currentValue, pricePerUnit };
    })
  );

  const totalValue = holdingsWithValue.reduce((sum, h) => sum + h.currentValue, 0);
  const totalInvested = holdingsWithValue.reduce((sum, h) => sum + h.amount, 0);
  const totalReturnPct = totalInvested > 0 ? ((totalValue - totalInvested) / totalInvested) * 100 : 0;
  const equity = totalValue + Math.max(0, DEMO_CASH - totalInvested);

  return (
    <div className="w-full max-w-6xl min-w-0 mx-auto px-4 py-6 sm:p-6 lg:p-8 space-y-8">
      <PageHeader
        title="Portfolio"
        subtitle={PAGE_SUBTITLES.portfolio}
      />

      {!dbAvailable && (
        <Card className="rounded-xl border border-border bg-card">
          <CardContent className="py-6 px-4">
            <p className="font-medium text-foreground mb-1">Portfolio data is temporarily unavailable</p>
            <p className="text-sm text-muted-foreground mb-4">You can still explore algorithms.</p>
            <Link
              href="/vega-financial/marketplace"
              className="text-sm font-medium text-primary hover:underline"
            >
              Explore algorithms
            </Link>
          </CardContent>
        </Card>
      )}

      {holdingsWithValue.length === 0 ? (
        <>
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <SummaryMetricCard label="Portfolio value" value={formatCurrency(DEMO_CASH)} />
            <SummaryMetricCard label="Total invested" value={formatCurrency(0)} />
            <SummaryMetricCard label="Total return" value="—" />
            <SummaryMetricCard label="Cash available" value={formatCurrency(DEMO_CASH)} />
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
        </>
      ) : (
        <>
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-4" aria-label="Portfolio summary">
            <SummaryMetricCard label="Portfolio value" value={formatCurrency(equity)} />
            <SummaryMetricCard label="Total invested" value={formatCurrency(totalInvested)} />
            <SummaryMetricCard
              label="Total return"
              value={formatPercent(totalReturnPct / 100)}
              variant={totalReturnPct >= 0 ? "positive" : "negative"}
            />
            <SummaryMetricCard
              label="Cash available"
              value={formatCurrency(Math.max(0, DEMO_CASH - totalInvested))}
            />
          </section>

          <section aria-labelledby="portfolio-chart-heading">
            <h2 id="portfolio-chart-heading" className="sr-only">Portfolio performance</h2>
            <DashboardPortfolioChart
              currentValue={equity}
              startValue={DEMO_CASH}
            />
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
                      <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Algorithm</th>
                      <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground">Value</th>
                      <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground">Return</th>
                      <th className="w-24" />
                    </tr>
                  </thead>
                  <tbody>
                    {holdingsWithValue.map((h) => {
                      const pnlPct = h.amount > 0 ? ((h.currentValue - h.amount) / h.amount) * 100 : 0;
                      return (
                        <tr key={h.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                          <td className="py-3 px-4">
                            <Link href={`/vega-financial/algorithms/${h.versionId}`} className="font-medium text-foreground hover:underline">
                              {h.version.name}
                            </Link>
                          </td>
                          <td className="py-3 px-4 text-right tabular-nums">{formatCurrency(h.currentValue)}</td>
                          <td className={`py-3 px-4 text-right tabular-nums ${pnlPct >= 0 ? "text-brand-green" : "text-brand-red"}`}>
                            {pnlPct >= 0 ? "+" : ""}{formatPercent(pnlPct / 100)}
                          </td>
                          <td className="py-3 px-4">
                            <Link href={`/vega-financial/algorithms/${h.versionId}`} className="text-sm font-medium text-primary hover:underline">
                              View
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
        </>
      )}
    </div>
  );
}
