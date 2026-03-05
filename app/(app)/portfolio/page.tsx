export const dynamic = "force-dynamic";
import { getInvestmentsForUser } from "@/lib/db/portfolio";
import { withDbOrThrow } from "@/lib/db/safe";
import { getLatestBacktestForVersion } from "@/lib/db/backtests";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { formatCurrency, formatPercent } from "@/lib/utils/format";

const isProduction = process.env.NODE_ENV === "production";

export default async function PortfolioPage() {
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Paper Portfolio</h1>
      {!dbAvailable && (
        <Card className="mb-6 border-amber-200 bg-amber-50/50 dark:border-amber-900/30 dark:bg-amber-950/20">
          <CardContent className="py-6">
            <p className="text-foreground font-medium mb-2">
              {isProduction
                ? "Paper portfolio is unavailable right now."
                : "Database not configured."}
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
              href="/marketplace"
              className="text-primary font-medium hover:underline focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring rounded"
            >
              Browse marketplace
            </Link>
          </CardContent>
        </Card>
      )}
      <p className="text-muted-foreground mb-8">Simulated holdings. Not investment advice.</p>

      {holdingsWithValue.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">
              No holdings yet. Browse the marketplace and add algorithms to your paper portfolio.
            </p>
            <Link href="/vega-financial" className="text-primary font-medium hover:underline">
              Explore algorithms
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Total value</CardTitle>
              </CardHeader>
              <CardContent>
                <span className="text-2xl font-bold">{formatCurrency(totalValue)}</span>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Total invested</CardTitle>
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

          <h2 className="text-lg font-semibold mb-4">Holdings</h2>
          <div className="space-y-4">
            {holdingsWithValue.map((holding) => (
              <Card key={holding.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>
                        <Link href={`/algo/${holding.versionId}`} className="hover:underline">
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
  );
}
