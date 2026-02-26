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
import { RunBacktestPanel } from "@/app/(app)/algo/[id]/RunBacktestPanel";
import { InvestPanel } from "@/app/(app)/algo/[id]/InvestPanel";
import { DataStatusCard } from "@/app/(app)/algo/[id]/DataStatusCard";
import { Breadcrumb } from "@/components/layout/Breadcrumb";

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

  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-6">
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "/vega-financial" },
            { label: displayName || "Algorithm" },
          ]}
        />
      </div>

      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
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
          <div className="flex flex-wrap gap-2 mt-3">
            {displayTags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
            {displayRisk && (
              <Badge variant={riskVariant(displayRisk)}>{displayRisk}</Badge>
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
      />

      <div className="mt-8 space-y-8">
        {equityPoints.length > 0 && (
          <Card>
            <CardHeader>
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

        {equityPoints.length > 0 && (
          <Card>
            <CardHeader>
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
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Run backtest</CardTitle>
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
          {version && <InvestPanel versionId={id} />}
        </CardContent>
      </Card>
    </div>
  );
}
