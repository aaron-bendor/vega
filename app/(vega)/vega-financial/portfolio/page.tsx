export const dynamic = "force-dynamic";
import { getInvestmentsForUser } from "@/lib/db/portfolio";
import { withDbOrThrow } from "@/lib/db/safe";
import { getLatestBacktestForVersion } from "@/lib/db/backtests";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Wallet } from "lucide-react";
import { formatCurrency, formatPercent } from "@/lib/utils/format";

const isProduction = process.env.NODE_ENV === "production";

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

  return (
    <div className="w-full max-w-5xl min-w-0 mx-auto px-4 py-6 sm:p-6 lg:p-8 space-y-6">
      <div className="min-w-0">
        <h1 className="font-syne text-2xl md:text-3xl font-bold mb-2 text-foreground">
          Paper portfolio
        </h1>
        {!dbAvailable && (
          <Card className="mb-6 rounded-2xl border-primary/20 bg-primary/[0.03] transition-colors duration-200">
            <CardContent className="py-8 px-6">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="size-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <span className="text-primary/70 text-lg font-semibold" aria-hidden>!</span>
                </div>
                <div>
                  <p className="text-foreground font-semibold mb-1">
                    {isProduction
                      ? "Paper portfolio is unavailable right now"
                      : "Portfolio requires database"}
                  </p>
                  {isProduction ? (
                    <p className="text-muted-foreground text-sm mb-4">
                      You can still browse the marketplace and explore algorithms.
                    </p>
                  ) : (
                    <p className="text-muted-foreground text-sm mb-4">
                      Set <code className="rounded bg-[rgba(51,51,51,0.06)] px-1">DATABASE_URL</code> in{" "}
                      <code className="rounded bg-[rgba(51,51,51,0.06)] px-1">.env</code>, run migrations and seed to use the portfolio.
                    </p>
                  )}
                  <Link
                    href="/vega-financial/marketplace"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded transition-colors duration-150"
                  >
                    Browse marketplace
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        <p className="text-muted-foreground mb-8">Simulated holdings. Not investment advice.</p>

        {holdingsWithValue.length === 0 ? (
          <Card className="rounded-2xl border-primary/20 bg-primary/[0.03] transition-colors duration-200">
            <CardContent className="py-12 px-6 text-center">
              <div className="size-14 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center mx-auto mb-4">
                <Wallet className="size-7 text-primary/50" aria-hidden />
              </div>
              <p className="text-muted-foreground mb-2 font-medium text-foreground">No holdings yet</p>
              <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
                Browse the marketplace and add algorithms to your paper portfolio.
              </p>
              <Link
                href="/vega-financial/marketplace"
                className="inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors duration-200 focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Explore algorithms
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 mb-8">
              <Card className="rounded-2xl border-primary/20 bg-primary/[0.03]">
                <CardHeader>
                  <CardTitle className="font-syne text-base font-semibold">Total value</CardTitle>
                </CardHeader>
                <CardContent>
                  <span className="text-2xl font-bold">{formatCurrency(totalValue)}</span>
                </CardContent>
              </Card>
              <Card className="rounded-2xl border-primary/20 bg-primary/[0.03]">
                <CardHeader>
                  <CardTitle className="font-syne text-base font-semibold">Total invested</CardTitle>
                </CardHeader>
                <CardContent>
                  <span className="text-2xl font-bold">{formatCurrency(totalInvested)}</span>
                  {totalInvested > 0 && (
                    <span className="text-muted-foreground text-sm ml-2">
                      ({formatPercent((totalValue - totalInvested) / totalInvested)})
                    </span>
                  )}
                </CardContent>
              </Card>
            </div>

            <h2 className="font-syne text-lg font-semibold mb-4 text-foreground">Holdings</h2>
            <div className="space-y-4">
              {holdingsWithValue.map((holding) => (
                <Card key={holding.id} className="rounded-2xl border-primary/20 bg-primary/[0.03]">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="font-syne text-base font-semibold">
                          <Link href={`/vega-financial/algorithms/${holding.versionId}`} className="hover:underline">
                            {holding.version.name}
                          </Link>
                        </CardTitle>
                        <div className="flex gap-2 mt-2">
                          {holding.version.tags.map(({ tag }) => (
                            <Badge key={tag.id} variant="secondary" className="text-xs">
                              {tag.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold">{formatCurrency(holding.currentValue)}</span>
                        <p className="text-sm text-muted-foreground">{holding.units.toFixed(4)} units</p>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
