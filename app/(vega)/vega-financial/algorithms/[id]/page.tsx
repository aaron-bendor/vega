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
import { RiskBadge } from "@/components/vega-financial/RiskBadge";
import { InvestableAttributesStrip } from "@/components/vega-financial/InvestableAttributesStrip";
import { RunBacktestPanel } from "@/app/(app)/algo/[id]/RunBacktestPanel";
import { InvestPanel } from "@/app/(app)/algo/[id]/InvestPanel";
import { DataStatusCard } from "@/app/(app)/algo/[id]/DataStatusCard";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import {
  STRATEGY_OVERVIEW_COPY,
  METRICS_EXPLAINER_COPY,
  METHODOLOGY_NOTE_COPY,
  ALLOCATION_NOTE_COPY,
} from "@/lib/vega-financial/strategy-copy";

function riskVariant(level: string) {
  if (level === "Low") return "success" as const;
  if (level === "High") return "destructive" as const;
  return "outline" as const;
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
  const riskScore = demoAlgo?.riskScore ?? (displayRisk === "Low" ? 3 : displayRisk === "High" ? 8 : 5);
  const var95MonthlyPct = demoAlgo?.var95MonthlyPct;
  const standardised = demoAlgo?.standardised;
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

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <Breadcrumb
          items={[
            { label: "Vega Financial", href: "/vega-financial" },
            { label: displayName || "Algorithm" },
          ]}
        />
      </div>

      <div
        className="flex flex-wrap items-start justify-between gap-4 mb-8"
        style={{ viewTransitionName: `algo-card-${id}` }}
        data-tour="algo-title"
      >
        <div>
          <h1 className="font-syne text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
            {displayName}
            {version?.verificationStatus === "verified" && (
              <ShieldCheck className="size-6 text-primary" />
            )}
            {demoAlgo && (
              <span className="text-xs font-normal text-muted-foreground">(Demo)</span>
            )}
          </h1>
          {displayDesc && (
            <p className="text-muted-foreground mt-1 text-sm">{displayDesc}</p>
          )}
          <div className="flex flex-wrap items-center gap-2 mt-3" data-tour="algo-scores">
            <RiskBadge
              score={riskScore}
              var95MonthlyPct={var95MonthlyPct}
              standardised={standardised}
              variant="default"
            />
            {displayTags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
            {displayRisk && (
              <Badge variant={riskVariant(displayRisk)}>{displayRisk}</Badge>
            )}
            {demoAlgo?.attributes && (
              <InvestableAttributesStrip attributes={demoAlgo.attributes} variant="default" className="w-full mt-2" />
            )}
          </div>
        </div>
      </div>

      {(version || demoAlgo) && (
        <DataStatusCard
          symbols={(version?.symbols as string[] | null) ?? demoAlgo?.symbols ?? ["^spx"]}
          startDate={(version?.startDate as string) ?? demoAlgo?.startDate ?? "2019-01-01"}
          endDate={(version?.endDate as string) ?? demoAlgo?.endDate ?? "2024-12-31"}
        />
      )}

      {overviewCopy && (
        <Card className="rounded-2xl border-primary/20 bg-primary/[0.03]">
          <CardHeader>
            <CardTitle className="font-syne text-base font-semibold">Overview</CardTitle>
            <p className="text-xs text-muted-foreground">
              What this strategy is trying to do, when it tends to work, and where it may struggle.
            </p>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <p className="text-muted-foreground leading-relaxed">{overviewCopy.overview}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="font-medium text-foreground text-xs mb-1">Why this exists</p>
                <p className="text-muted-foreground text-xs leading-relaxed">{overviewCopy.whyExists}</p>
              </div>
              <div>
                <p className="font-medium text-foreground text-xs mb-1">When it tends to work</p>
                <p className="text-muted-foreground text-xs leading-relaxed">{overviewCopy.whenWorks}</p>
              </div>
              <div>
                <p className="font-medium text-foreground text-xs mb-1">When it struggles</p>
                <p className="text-muted-foreground text-xs leading-relaxed">{overviewCopy.whenStruggles}</p>
              </div>
              <div>
                <p className="font-medium text-foreground text-xs mb-1">Who it may fit</p>
                <p className="text-muted-foreground text-xs leading-relaxed">{overviewCopy.whoFits}</p>
              </div>
              <div>
                <p className="font-medium text-foreground text-xs mb-1">Who it may not fit</p>
                <p className="text-muted-foreground text-xs leading-relaxed">{overviewCopy.whoNotFit}</p>
              </div>
              <div>
                <p className="font-medium text-foreground text-xs mb-1">Suggested role in portfolio</p>
                <p className="text-muted-foreground text-xs leading-relaxed">{overviewCopy.suggestedRole}</p>
              </div>
              <div>
                <p className="font-medium text-foreground text-xs mb-1">Suggested allocation range</p>
                <p className="text-muted-foreground text-xs leading-relaxed">{overviewCopy.suggestedAllocationRange}</p>
              </div>
            </div>
            {overviewCopy.extraNote && (
              <div className="rounded-lg border border-amber-200 bg-amber-50/80 dark:border-amber-800 dark:bg-amber-950/30 px-3 py-2 text-xs text-muted-foreground leading-relaxed">
                {overviewCopy.extraNote}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div data-tour="algo-metrics" className="mt-8">
        <h3 className="font-syne text-base font-semibold text-foreground mb-2">Performance</h3>
        <p className="text-xs text-muted-foreground mb-3">
          Historical simulated results from the latest backtest. These figures are useful for
          comparison, but they are not forecasts.
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

      <div className="mt-8 space-y-8">
        {equityPoints.length > 0 && (
          <Card className="rounded-2xl border-primary/20 bg-primary/[0.03]">
            <CardHeader>
              <CardTitle className="font-syne text-base font-semibold">Equity curve</CardTitle>
              <p className="text-xs text-muted-foreground">
                Simulated backtest performance. Not investment advice.
              </p>
            </CardHeader>
            <CardContent>
              <EquityCurve data={equityPoints} startDate={demoAlgo?.startDate} />
            </CardContent>
          </Card>
        )}

        {equityPoints.length > 0 && (
          <Card className="rounded-2xl border-primary/20 bg-primary/[0.03]">
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

      <Card className="mt-8 rounded-2xl border-primary/20 bg-primary/[0.03]" data-tour="algo-backtest-form">
        <CardHeader>
          <CardTitle className="font-syne text-base font-semibold">Run backtest</CardTitle>
          <p className="text-xs text-muted-foreground">
            Configure and run a backtest against this algorithm version.
            Simulated performance only.
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
          {(version || demoAlgo) && (
            <>
              <div className="mt-6 pt-6 border-t border-[rgba(51,51,51,0.12)]">
                <h4 className="font-syne text-sm font-semibold text-foreground mb-1">Allocation</h4>
                <p className="text-xs text-muted-foreground mb-3">
                  How this strategy might fit into a broader portfolio and what a paper allocation would change.
                </p>
                <p className="text-xs text-muted-foreground mb-4">{ALLOCATION_NOTE_COPY}</p>
                <InvestPanel versionId={id} />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {(version || demoAlgo) && (
        <Card className="mt-6 rounded-2xl border-primary/20 bg-primary/[0.03]">
          <CardHeader>
            <CardTitle className="font-syne text-base font-semibold">Methodology</CardTitle>
            <p className="text-xs text-muted-foreground">
              How this backtest was run, what data was used, and what assumptions sit behind the results.
            </p>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">{METHODOLOGY_NOTE_COPY}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
