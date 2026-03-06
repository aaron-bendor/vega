import { notFound } from "next/navigation";
import { getAlgorithmVersionById } from "@/lib/db/algorithms";
import { getLatestBacktestForVersion } from "@/lib/db/backtests";
import { loadDemoAlgorithms, loadDemoRun } from "@/lib/demo/loader";
import { EquityCurve } from "@/components/charts/EquityCurve";
import { DrawdownChart } from "@/components/charts/DrawdownChart";
import { MetricsCards } from "@/components/charts/MetricsCards";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";
import { InvestableAttributesStrip } from "@/components/vega-financial/InvestableAttributesStrip";
import { InvestPanel } from "@/app/(app)/algo/[id]/InvestPanel";
import { MethodologyAssumptionsSection } from "@/components/vega-financial/MethodologyAssumptionsSection";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import {
  STRATEGY_OVERVIEW_COPY,
  METRICS_EXPLAINER_COPY,
  ALLOCATION_NOTE_COPY,
} from "@/lib/vega-financial/strategy-copy";

function riskVariant(level: string): "success" | "warning" | "destructive" {
  if (level === "Low") return "success";
  if (level === "High") return "destructive";
  return "warning";
}

function formatSymbol(symbol: string) {
  if (symbol === "^spx") return "S&P 500 (^spx)";
  return symbol;
}

export default async function AlgorithmDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
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
  const equityPoints =
    backtest?.equityPoints ?? demoRun?.equityPoints ?? [];
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
  const displayTags = version?.tags?.map((t) => t.tag.name) ?? demoAlgo?.tags ?? [];
  const displayRisk = version?.riskLevel ?? demoAlgo?.riskLevel ?? null;
  const overviewCopy = id ? STRATEGY_OVERVIEW_COPY[id] : null;
  const hasAnyMetric =
    (metricMap.cumulativeReturn ?? version?.cachedReturn) != null ||
    (metricMap.sharpeRatio ?? version?.cachedSharpe) != null ||
    (metricMap.maxDrawdown ?? version?.cachedMaxDrawdown) != null ||
    (metricMap.annualisedVolatility ?? version?.cachedVolatility) != null;
  const metricsFallbackMessage =
    !hasAnyMetric && overviewCopy?.metricsUnavailableNote
      ? overviewCopy.metricsUnavailableNote
      : undefined;

  const symbols = (version?.symbols as string[] | null) ?? demoAlgo?.symbols ?? ["^spx"];
  const startDate = (version?.startDate as string) ?? demoAlgo?.startDate ?? "2019-01-01";
  const endDate = (version?.endDate as string) ?? demoAlgo?.endDate ?? "2024-12-31";
  const trackRecordMonths = demoAlgo?.attributes?.experience ?? 18;
  const versionLabel = demoAlgo ? "Demo v1" : (version?.name ?? "v1");

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto bg-background">
      <div className="mb-6">
        <Breadcrumb
          items={[
            { label: "Vega Financial", href: "/vega-financial" },
            { label: displayName || "Algorithm" },
          ]}
        />
      </div>

      <p className="text-xs text-muted-foreground mb-6" role="status">
        Simulated strategy page. Paper allocation only.
      </p>

      <header
        className="flex flex-wrap items-start justify-between gap-4 mb-8"
        style={{ viewTransitionName: `algo-card-${id}` }}
        data-tour="algo-title"
      >
        <div className="min-w-0">
          <h1 className="font-syne text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2 flex-wrap">
            {displayName}
            {version?.verificationStatus === "verified" && (
              <ShieldCheck className="size-6 text-primary shrink-0" />
            )}
          </h1>
          {displayDesc && (
            <p className="text-muted-foreground mt-1 text-sm">{displayDesc}</p>
          )}
          <p className="text-xs text-muted-foreground mt-2">
            Built for comparing strategy behaviour in a demo portfolio.
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-3" data-tour="algo-scores">
            <Badge variant="secondary">Simulated</Badge>
            {displayRisk && (
              <Badge variant={riskVariant(displayRisk)}>{displayRisk} risk</Badge>
            )}
            {displayTags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
            <Badge variant="outline">{trackRecordMonths} mo track record</Badge>
            {demoAlgo?.attributes && (
              <InvestableAttributesStrip attributes={demoAlgo.attributes} variant="default" className="w-full mt-2" />
            )}
          </div>
        </div>
      </header>

      {overviewCopy && "whatItDoes" in overviewCopy && (
        <section className="space-y-6 mb-8" aria-labelledby="strategy-overview-heading">
          <h2 id="strategy-overview-heading" className="font-syne text-lg font-semibold text-foreground">
            Strategy overview
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="rounded-2xl border border-border bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="font-syne text-sm font-semibold">What this strategy does</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">{overviewCopy.whatItDoes}</p>
              </CardContent>
            </Card>
            <Card className="rounded-2xl border border-border bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="font-syne text-sm font-semibold">Where it tends to work</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                  {overviewCopy.whereWorks.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="rounded-2xl border border-border bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="font-syne text-sm font-semibold">Where it can struggle</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                  {overviewCopy.whereStruggles.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="rounded-2xl border border-border bg-card sm:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="font-syne text-sm font-semibold">Portfolio fit</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p><span className="font-medium text-foreground">Best used as:</span> {overviewCopy.bestUsedAs}</p>
                <p><span className="font-medium text-foreground">Suggested size:</span> {overviewCopy.suggestedSize}</p>
                <p><span className="font-medium text-foreground">May suit you if:</span> {overviewCopy.maySuitYouIf}</p>
                <p><span className="font-medium text-foreground">May not suit you if:</span> {overviewCopy.mayNotSuitYouIf}</p>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      <div data-tour="algo-metrics" className="mb-8">
        <h3 className="font-syne text-base font-semibold text-foreground mb-2">Performance</h3>
        <p className="text-xs text-muted-foreground mb-3">
          Historical simulated results from the latest backtest. Useful for comparison, not forecasts.
        </p>
        <MetricsCards
          cumulativeReturn={
            (metricMap.cumulativeReturn ?? version?.cachedReturn) ?? undefined
          }
          sharpeRatio={
            (metricMap.sharpeRatio ?? version?.cachedSharpe) ?? undefined
          }
          maxDrawdown={
            (metricMap.maxDrawdown ?? version?.cachedMaxDrawdown) ?? undefined
          }
          annualisedVolatility={
            (metricMap.annualisedVolatility ?? version?.cachedVolatility) ?? undefined
          }
          fallbackMessage={metricsFallbackMessage}
          explainerText={METRICS_EXPLAINER_COPY}
        />
      </div>

      <div className="space-y-8 mb-8">
        {equityPoints.length > 0 && (
          <Card className="rounded-2xl border border-border bg-card">
            <CardHeader>
              <CardTitle className="font-syne text-base font-semibold">Equity curve</CardTitle>
              <p className="text-xs text-muted-foreground">
                Historical simulated results for this strategy version. Useful for comparison, not a forecast.
              </p>
            </CardHeader>
            <CardContent>
              <EquityCurve data={equityPoints} startDate={demoAlgo?.startDate} />
            </CardContent>
          </Card>
        )}

        {equityPoints.length > 0 && (
          <Card className="rounded-2xl border border-border bg-card">
            <CardHeader>
              <CardTitle className="font-syne text-base font-semibold">Drawdown</CardTitle>
              <p className="text-xs text-muted-foreground">
                Peak-to-trough decline over the backtest period.
              </p>
            </CardHeader>
            <CardContent>
              <DrawdownChart equityData={equityPoints} startDate={demoAlgo?.startDate} />
            </CardContent>
          </Card>
        )}
      </div>

      {(version || demoAlgo) && (
        <Card className="mb-8 rounded-2xl border border-border bg-card" data-tour="algo-add-paper">
          <CardHeader>
            <CardTitle className="font-syne text-base font-semibold">Paper allocation</CardTitle>
            <p className="text-sm text-muted-foreground">
              Try this strategy in your demo portfolio.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <InvestPanel versionId={id} />
            <p className="text-xs text-muted-foreground">{ALLOCATION_NOTE_COPY}</p>
          </CardContent>
        </Card>
      )}

      {(version || demoAlgo) && (
        <div className="space-y-4">
          <MethodologyAssumptionsSection
            dataSource="Stooq daily OHLC"
            symbol={formatSymbol(symbols[0] ?? "^spx")}
            testedPeriod={`${startDate} to ${endDate}`}
            version={versionLabel}
            note="Historical data helps compare strategies, but simulated results are not forecasts."
          />
        </div>
      )}
    </div>
  );
}
