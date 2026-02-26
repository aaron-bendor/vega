import { notFound } from "next/navigation";
import { getAlgorithmVersionById } from "@/lib/db/algorithms";
import { getLatestBacktestForVersion } from "@/lib/db/backtests";
import { loadDemoAlgorithms, loadDemoRun } from "@/lib/demo/loader";
import { EquityCurve } from "@/components/charts/EquityCurve";
import { DrawdownChart } from "@/components/charts/DrawdownChart";
import { MetricsCards } from "@/components/charts/MetricsCards";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShieldCheck, Calendar, DollarSign, TrendingUp } from "lucide-react";
import { RunBacktestPanel } from "./RunBacktestPanel";
import { InvestPanel } from "./InvestPanel";
import { DataStatusCard } from "./DataStatusCard";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { MOCK_ACCOUNT } from "@/lib/mock/portfolio";
import { formatCurrency, formatPercent } from "@/lib/utils/format";

function riskVariant(level: string) {
  if (level === "Low") return "success" as const;
  if (level === "High") return "destructive" as const;
  return "outline" as const;
}

export default async function AlgorithmDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  let version: Awaited<ReturnType<typeof getAlgorithmVersionById>> = null;
  let demoAlgo: ReturnType<typeof loadDemoAlgorithms>[0] | null = null;

  try {
    version = await getAlgorithmVersionById(id);
  } catch {
    version = null;
  }
  if (!version) {
    demoAlgo = loadDemoAlgorithms().find((a) => a.id === id) ?? null;
  }
  if (!version && !demoAlgo) notFound();

  const backtest = version
    ? await getLatestBacktestForVersion(id).catch(() => null)
    : null;
  const demoRun = !version && demoAlgo ? loadDemoRun(id) : null;
  const equityPoints = backtest?.equityPoints ?? demoRun?.equityPoints ?? [];
  const metrics = backtest?.metrics ?? [];
  const metricMap = demoRun?.metrics
    ? {
        cumulativeReturn: demoRun.metrics.cumulativeReturn,
        sharpeRatio: demoRun.metrics.sharpeRatio,
        maxDrawdown: demoRun.metrics.maxDrawdown,
        annualisedVolatility: demoRun.metrics.annualisedVolatility,
      }
    : Object.fromEntries(metrics.map((m) => [m.key, m.value]));

  const displayName = version?.name ?? demoAlgo?.name ?? "";
  const displayDesc = version?.shortDesc ?? demoAlgo?.shortDesc ?? "";
  const displayLongDesc = version?.description ?? demoAlgo?.description ?? "";
  const displayTags = version?.tags?.map((t) => t.tag.name) ?? demoAlgo?.tags ?? [];
  const displayRisk = version?.riskLevel ?? demoAlgo?.riskLevel ?? null;
  const verified = version?.verificationStatus === "verified" || demoAlgo?.verified === true;

  const holding = MOCK_ACCOUNT.holdings.find((h) => h.algorithmId === id);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <Breadcrumb
          items={[
            { label: "Vega Financial", href: "/vega-financial" },
            { label: "Marketplace", href: "/marketplace" },
            { label: displayName || "Algorithm" },
          ]}
        />
      </div>

      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-foreground">{displayName}</h1>
            {verified && <ShieldCheck className="size-5 text-primary" aria-label="Verified" />}
          </div>
          {displayDesc && (
            <p className="text-muted-foreground text-sm">{displayDesc}</p>
          )}
          <div className="flex flex-wrap gap-2">
            {displayTags.map((tag) => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
            {displayRisk && (
              <Badge variant={riskVariant(displayRisk)}>
                {displayRisk} risk
              </Badge>
            )}
          </div>
        </div>

        {(metricMap.cumulativeReturn != null || metricMap.sharpeRatio != null) && (
          <div className="flex gap-6 text-sm">
            {metricMap.cumulativeReturn != null && (
              <div className="text-center">
                <p className="text-muted-foreground text-xs">Return</p>
                <p className="font-semibold text-foreground">{formatPercent(metricMap.cumulativeReturn)}</p>
              </div>
            )}
            {metricMap.sharpeRatio != null && (
              <div className="text-center">
                <p className="text-muted-foreground text-xs">Sharpe</p>
                <p className="font-semibold text-foreground">{(metricMap.sharpeRatio as number).toFixed(2)}</p>
              </div>
            )}
            {metricMap.maxDrawdown != null && (
              <div className="text-center">
                <p className="text-muted-foreground text-xs">Max DD</p>
                <p className="font-semibold text-foreground">{formatPercent(metricMap.maxDrawdown as number)}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {holding && (
        <Card className="mb-6 border-primary/20 bg-primary/5">
          <CardContent className="py-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <TrendingUp className="size-4 text-primary" />
                You are invested in this algorithm
              </div>
              <div className="flex gap-6 text-sm">
                <div>
                  <span className="text-muted-foreground">Allocated:</span>{" "}
                  <span className="font-medium text-foreground">{formatCurrency(holding.allocated)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Current:</span>{" "}
                  <span className="font-medium text-foreground">{formatCurrency(holding.currentValue)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Weight:</span>{" "}
                  <span className="font-medium text-foreground">{holding.weight.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="risk">Risk</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <MetricsCards
            cumulativeReturn={(metricMap.cumulativeReturn ?? version?.cachedReturn) ?? undefined}
            sharpeRatio={(metricMap.sharpeRatio ?? version?.cachedSharpe) ?? undefined}
            maxDrawdown={(metricMap.maxDrawdown ?? version?.cachedMaxDrawdown) ?? undefined}
            annualisedVolatility={(metricMap.annualisedVolatility ?? version?.cachedVolatility) ?? undefined}
          />

          {equityPoints.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Equity curve</CardTitle>
                <p className="text-xs text-muted-foreground">
                  Simulated backtest performance. Not investment advice.
                </p>
              </CardHeader>
              <CardContent>
                <EquityCurve data={equityPoints} startDate={demoAlgo?.startDate} />
              </CardContent>
            </Card>
          )}

          {(version || demoAlgo) && (
            <DataStatusCard
              symbols={(version?.symbols as string[] | null) ?? demoAlgo?.symbols ?? ["^spx"]}
              startDate={(version?.startDate as string) ?? demoAlgo?.startDate ?? "2019-01-01"}
              endDate={(version?.endDate as string) ?? demoAlgo?.endDate ?? "2024-12-31"}
            />
          )}
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <MetricsCards
            cumulativeReturn={(metricMap.cumulativeReturn ?? version?.cachedReturn) ?? undefined}
            sharpeRatio={(metricMap.sharpeRatio ?? version?.cachedSharpe) ?? undefined}
            maxDrawdown={(metricMap.maxDrawdown ?? version?.cachedMaxDrawdown) ?? undefined}
            annualisedVolatility={(metricMap.annualisedVolatility ?? version?.cachedVolatility) ?? undefined}
          />

          {equityPoints.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Equity curve</CardTitle>
              </CardHeader>
              <CardContent>
                <EquityCurve data={equityPoints} startDate={demoAlgo?.startDate} />
              </CardContent>
            </Card>
          )}

          {equityPoints.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Drawdown</CardTitle>
                <p className="text-xs text-muted-foreground">
                  Peak-to-trough decline over the backtest period.
                </p>
              </CardHeader>
              <CardContent>
                <DrawdownChart equityData={equityPoints} startDate={demoAlgo?.startDate} />
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Run backtest</CardTitle>
              <p className="text-xs text-muted-foreground">
                Configure and run a backtest. Simulated performance only.
              </p>
            </CardHeader>
            <CardContent>
              <RunBacktestPanel
                versionId={version ? id : undefined}
                templateId={(version?.strategyTemplateId as string) ?? demoAlgo?.templateId}
                defaultParams={demoAlgo?.defaultParams}
                symbols={(version?.symbols as string[] | undefined) ?? demoAlgo?.symbols}
                startDate={(version?.startDate as string | undefined) ?? demoAlgo?.startDate}
                endDate={(version?.endDate as string | undefined) ?? demoAlgo?.endDate}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk" className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground">Risk level</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant={displayRisk ? riskVariant(displayRisk) : "outline"} className="text-sm">
                  {displayRisk ?? "Not classified"}
                </Badge>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground">Max drawdown</CardTitle>
              </CardHeader>
              <CardContent>
                <span className="text-xl font-semibold text-foreground">
                  {metricMap.maxDrawdown != null
                    ? formatPercent(metricMap.maxDrawdown as number)
                    : "N/A"}
                </span>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground">Annualised volatility</CardTitle>
              </CardHeader>
              <CardContent>
                <span className="text-xl font-semibold text-foreground">
                  {metricMap.annualisedVolatility != null
                    ? formatPercent(metricMap.annualisedVolatility as number)
                    : "N/A"}
                </span>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground">Sharpe ratio</CardTitle>
              </CardHeader>
              <CardContent>
                <span className="text-xl font-semibold text-foreground">
                  {metricMap.sharpeRatio != null
                    ? (metricMap.sharpeRatio as number).toFixed(2)
                    : "N/A"}
                </span>
              </CardContent>
            </Card>
          </div>

          {equityPoints.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Drawdown chart</CardTitle>
              </CardHeader>
              <CardContent>
                <DrawdownChart equityData={equityPoints} startDate={demoAlgo?.startDate} />
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="about" className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">About this algorithm</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {displayLongDesc || displayDesc || "No description available."}
              </p>

              <div className="grid gap-3 sm:grid-cols-2 text-sm">
                {demoAlgo?.inceptionDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="size-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Inception:</span>
                    <span className="text-foreground">{demoAlgo.inceptionDate}</span>
                  </div>
                )}
                {demoAlgo?.minInvestment != null && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="size-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Min investment:</span>
                    <span className="text-foreground">{formatCurrency(demoAlgo.minInvestment)}</span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-[rgba(51,51,51,0.12)] text-xs text-muted-foreground">
                This is a simulated algorithm for demonstration purposes only.
                No real money is involved. Past performance does not indicate
                future results.
              </div>
            </CardContent>
          </Card>

          {version && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Invest</CardTitle>
                <p className="text-xs text-muted-foreground">
                  Add this algorithm to your paper portfolio.
                </p>
              </CardHeader>
              <CardContent>
                <InvestPanel versionId={id} />
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
