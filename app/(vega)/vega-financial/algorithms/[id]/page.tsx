import { notFound } from "next/navigation";
import { getAlgorithmVersionById } from "@/lib/db/algorithms";
import { getLatestBacktestForVersion } from "@/lib/db/backtests";
import { loadDemoAlgorithms, loadDemoRun } from "@/lib/demo/loader";
import { EquityCurve } from "@/components/charts/EquityCurve";
import { DrawdownChart } from "@/components/charts/DrawdownChart";
import { MetricsCards } from "@/components/charts/MetricsCards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MethodologyAssumptionsSection } from "@/components/vega-financial/MethodologyAssumptionsSection";
import {
  AlgorithmDetailLayout,
  METRICS_HELP_ID,
} from "@/components/vega-financial/AlgorithmDetailLayout";
import { StrategyHeroSummary } from "@/components/vega-financial/StrategyHeroSummary";
import { AllocationSummaryCard } from "@/components/vega-financial/AllocationSummaryCard";
import { AlgorithmAllocationForm } from "@/components/vega-financial/AlgorithmAllocationForm";
import { StrategyMetricStrip } from "@/components/vega-financial/StrategyMetricStrip";
import { MobileStickyAllocationBar } from "@/components/vega-financial/MobileStickyAllocationBar";
import { ReplayTutorialLink } from "@/components/vega-financial/ReplayTutorialLink";
import { RisksToKnowCard } from "@/components/vega-financial/RisksToKnowCard";
import { SuitabilityCard } from "@/components/vega-financial/SuitabilityCard";
import { AdvancedDisclosure } from "@/components/vega-financial/AdvancedDisclosure";
import {
  STRATEGY_OVERVIEW_COPY,
  METRICS_EXPLAINER_COPY,
  DEFAULT_METRICS_HELP,
} from "@/lib/vega-financial/strategy-copy";

function formatSymbol(symbol: string) {
  if (symbol === "^spx") return "S&P 500 (^spx)";
  return symbol;
}

function trackRecordLength(startDate: string, endDate: string): string {
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const months = Math.round((end.getTime() - start.getTime()) / (30.44 * 24 * 60 * 60 * 1000));
    if (months >= 24) return `${Math.floor(months / 12)} years`;
    if (months >= 12) return "1 year";
    return `${months} months`;
  } catch {
    return "—";
  }
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
  const versionLabel = demoAlgo ? "Demo v1" : (version?.name ?? "v1");

  const returnPct = (metricMap.cumulativeReturn ?? version?.cachedReturn) ?? null;
  const maxDrawdown = (metricMap.maxDrawdown ?? version?.cachedMaxDrawdown) ?? null;
  const sharpe = (metricMap.sharpeRatio ?? version?.cachedSharpe) ?? null;
  const verified = version?.verificationStatus === "verified" || (demoAlgo?.verified === true);

  const oneLineSummary = overviewCopy?.oneLineSummary ?? displayDesc;
  const assetClass = displayTags.includes("Equity") ? "Equity" : displayTags[0];
  const strategyStyle = displayTags[0] ?? undefined;
  const trackRecord = trackRecordLength(startDate, endDate);
  const dataConfidence = equityPoints.length >= 2 ? ("High" as const) : ("Medium" as const);

  const heroLeft = (
    <StrategyHeroSummary
      name={displayName}
      verified={verified}
      oneLineSummary={oneLineSummary}
      assetClass={assetClass}
      strategyStyle={strategyStyle}
      riskLevel={displayRisk}
      suitableFor={overviewCopy?.suitableFor}
      bestRole={overviewCopy?.bestRole}
      typicalBehaviour={overviewCopy?.typicalBehaviour}
      mainDrawback={overviewCopy?.mainDrawback}
      whyConsider={overviewCopy?.whyConsider}
      trustSignals={overviewCopy?.trustSignals}
      replayTutorialSlot={<ReplayTutorialLink />}
    />
  );

  const heroRight = (version || demoAlgo) ? (
    <AllocationSummaryCard
      returnPct={returnPct ?? undefined}
      maxDrawdown={maxDrawdown ?? undefined}
      riskLevel={displayRisk ?? undefined}
      marketSimilarity="—"
      actionInsight={overviewCopy?.actionInsight ?? undefined}
    >
      <AlgorithmAllocationForm versionId={id} showAllocationHelper />
    </AllocationSummaryCard>
  ) : null;

  const metricStrip = (
    <StrategyMetricStrip
      returnPct={returnPct}
      maxDrawdown={maxDrawdown}
      riskAdjustedReturn={sharpe}
      trackRecordLength={trackRecord}
      dataConfidence={dataConfidence}
    />
  );

  const metricsHelp = overviewCopy?.metricsHelp ?? DEFAULT_METRICS_HELP;

  return (
    <AlgorithmDetailLayout
      heroLeft={heroLeft}
      heroRight={heroRight ?? <div />}
      metricStrip={metricStrip}
      mobileStickyBar={<MobileStickyAllocationBar />}
      tabPanels={{
        overview: (
          <div className="space-y-6">
            {/* Section 1: What this strategy does */}
            {overviewCopy?.whatItDoes && (
              <section>
                <h3 className="text-sm font-semibold text-foreground mb-2">What this strategy does</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
                  {overviewCopy.whatItDoes}
                </p>
              </section>
            )}

            {/* Section 2: Why investors use it (3 cards) */}
            {overviewCopy?.whereWorks && overviewCopy.whereWorks.length > 0 && (
              <section>
                <h3 className="text-sm font-semibold text-foreground mb-3">Why investors use it</h3>
                <div className="grid gap-3 sm:grid-cols-3">
                  {overviewCopy.whereWorks.slice(0, 3).map((item, i) => (
                    <div key={i} className="rounded-xl border border-border bg-card p-3">
                      <p className="text-sm text-muted-foreground">{item}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Section 3: Risks to know (3 cards) */}
            {(overviewCopy?.risksToKnow?.length ?? 0) > 0 ? (
              <section>
                <RisksToKnowCard items={overviewCopy!.risksToKnow!} />
              </section>
            ) : overviewCopy?.whereStruggles && overviewCopy.whereStruggles.length > 0 && (
              <section>
                <RisksToKnowCard
                  title="Risks to know"
                  items={overviewCopy.whereStruggles.slice(0, 3)}
                />
              </section>
            )}

            {/* Section 4: When it tends to work vs struggle */}
            {((overviewCopy?.whenWorksList?.length ?? 0) > 0 || (overviewCopy?.whenStrugglesList?.length ?? 0) > 0) ? (
              <section>
                <h3 className="text-sm font-semibold text-foreground mb-3">When it tends to work vs struggle</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-border bg-card p-4">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Tends to work in</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {(overviewCopy?.whenWorksList ?? []).map((item, i) => (
                        <li key={i}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-xl border border-border bg-card p-4">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Tends to struggle in</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {(overviewCopy?.whenStrugglesList ?? []).map((item, i) => (
                        <li key={i}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>
            ) : overviewCopy?.whereWorks && overviewCopy?.whereStruggles && (
              <section>
                <h3 className="text-sm font-semibold text-foreground mb-3">When it tends to work vs struggle</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-border bg-card p-4">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Tends to work in</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {overviewCopy.whereWorks.map((item, i) => (
                        <li key={i}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-xl border border-border bg-card p-4">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Tends to struggle in</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {overviewCopy.whereStruggles.map((item, i) => (
                        <li key={i}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>
            )}

            {/* Section 5: Who it may suit */}
            {(overviewCopy?.whoItMaySuit ?? overviewCopy?.maySuitYouIf) && (
              <section>
                <SuitabilityCard
                  text={overviewCopy?.whoItMaySuit ?? overviewCopy?.maySuitYouIf ?? ""}
                />
              </section>
            )}

            {/* Section 6: How to read the main metrics (expandable) */}
            <section id={METRICS_HELP_ID}>
              <AdvancedDisclosure summary="How to read the main metrics">
                <dl className="space-y-2 text-sm text-muted-foreground">
                  {Object.entries(metricsHelp).map(([key, text]) => (
                    <div key={key}>
                      <dt className="font-medium text-foreground capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </dt>
                      <dd className="mt-0.5">{text}</dd>
                    </div>
                  ))}
                </dl>
              </AdvancedDisclosure>
            </section>
          </div>
        ),
        performance: (
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground">
              Historical simulated results. Useful for comparison, not forecasts.
            </p>
            <MetricsCards
              cumulativeReturn={(metricMap.cumulativeReturn ?? version?.cachedReturn) ?? undefined}
              sharpeRatio={(metricMap.sharpeRatio ?? version?.cachedSharpe) ?? undefined}
              maxDrawdown={(metricMap.maxDrawdown ?? version?.cachedMaxDrawdown) ?? undefined}
              annualisedVolatility={(metricMap.annualisedVolatility ?? version?.cachedVolatility) ?? undefined}
              fallbackMessage={metricsFallbackMessage}
              explainerText={METRICS_EXPLAINER_COPY}
            />
            {equityPoints.length > 0 && (
              <>
                <Card className="rounded-xl border border-border bg-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-semibold">Performance chart</CardTitle>
                    <p className="text-xs text-muted-foreground">Cumulative return over the tested period.</p>
                  </CardHeader>
                  <CardContent>
                    <EquityCurve data={equityPoints} startDate={demoAlgo?.startDate} />
                  </CardContent>
                </Card>
                <Card className="rounded-xl border border-border bg-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-semibold">Biggest drop over time</CardTitle>
                    <p className="text-xs text-muted-foreground">
                      This shows how far the strategy fell before recovering.
                    </p>
                  </CardHeader>
                  <CardContent>
                    <DrawdownChart equityData={equityPoints} startDate={demoAlgo?.startDate} />
                  </CardContent>
                </Card>
              </>
            )}
            <p className="text-xs text-muted-foreground">
              Past simulated performance does not guarantee future results.
            </p>
          </div>
        ),
        risk: (
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground">
              Key risk metrics in plain English.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {maxDrawdown != null && (
                <Card className="rounded-xl border border-border bg-card">
                  <CardContent className="pt-4">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Biggest drop</p>
                    <p className="text-lg font-semibold">{((maxDrawdown as number) * 100).toFixed(1)}%</p>
                    <p className="text-xs text-muted-foreground mt-1">Largest peak-to-trough decline in the tested period.</p>
                  </CardContent>
                </Card>
              )}
              {displayRisk && (
                <Card className="rounded-xl border border-border bg-card">
                  <CardContent className="pt-4">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Risk level</p>
                    <p className="text-lg font-semibold">{displayRisk}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {displayRisk === "High"
                        ? "This strategy has had larger swings in value."
                        : displayRisk === "Low"
                          ? "This strategy has had steadier performance than most."
                          : "Moderate price movement over time."}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
            {equityPoints.length > 0 && (
              <Card className="rounded-xl border border-border bg-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold">Drawdown chart</CardTitle>
                  <p className="text-xs text-muted-foreground">
                    This shows how far the strategy fell before recovering.
                  </p>
                </CardHeader>
                <CardContent>
                  <DrawdownChart equityData={equityPoints} startDate={demoAlgo?.startDate} />
                </CardContent>
              </Card>
            )}
            <div className="rounded-xl border border-border bg-muted/20 p-4">
              <p className="text-sm text-muted-foreground leading-snug">
                This is not a low-risk strategy. Its value can fall meaningfully over short periods, especially when market trends reverse quickly.
              </p>
            </div>
          </div>
        ),
        developer: (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Strategy provider and review status.
            </p>
            <Card className="rounded-xl border border-border bg-card">
              <CardContent className="pt-4 space-y-4">
                <div>
                  <p className="text-sm font-medium text-foreground">Review status</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {version?.verificationStatus === "verified"
                      ? "Reviewed before publication. Monitored for risk and data quality."
                      : "Simulated demo strategy. Methodology summary available."}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">What was reviewed</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Methodology and assumptions are reviewed before publication. Advanced diagnostics are available in the Advanced tab.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        ),
        howItWorks: (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              High-level logic, data sources and limitations. No proprietary detail.
            </p>
            {(version || demoAlgo) && (
              <>
                <div className="rounded-xl border border-border bg-card p-4">
                  <h3 className="text-sm font-semibold text-foreground mb-2">Strategy logic summary</h3>
                  <p className="text-sm text-muted-foreground leading-snug">
                    The strategy looks for assets with persistent relative strength and adjusts the lookback window based on recent conditions. Exact code and trade-level details are hidden to protect proprietary logic.
                  </p>
                </div>
                <MethodologyAssumptionsSection
                  dataSource="Stooq daily OHLC"
                  symbol={formatSymbol(symbols[0] ?? "^spx")}
                  testedPeriod={`${startDate} to ${endDate}`}
                  version={versionLabel}
                  note="Historical data helps compare strategies. Simulated results are not forecasts."
                />
              </>
            )}
          </div>
        ),
        advanced: (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Technical metrics and backtest settings for experienced users.
            </p>
            <AdvancedDisclosure summary="How scores are calculated">
              <p className="mb-3">{METRICS_EXPLAINER_COPY}</p>
              <dl className="space-y-2 text-muted-foreground text-sm">
                <div>
                  <dt className="font-medium text-foreground">Risk-adjusted return (Sharpe)</dt>
                  <dd className="text-xs mt-0.5">Return per unit of risk.</dd>
                </div>
                <div>
                  <dt className="font-medium text-foreground">Max drawdown</dt>
                  <dd className="text-xs mt-0.5">Largest peak-to-trough decline.</dd>
                </div>
                <div>
                  <dt className="font-medium text-foreground">Volatility</dt>
                  <dd className="text-xs mt-0.5">How widely returns swung over time.</dd>
                </div>
              </dl>
            </AdvancedDisclosure>
          </div>
        ),
      }}
    />
  );
}
