"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatPercent } from "@/lib/utils/format";
import { HOW_SCORES_CALCULATED } from "@/lib/vega-financial/strategy-copy";

interface MetricCardProps {
  label: string;
  value: number | null;
  format?: "percent" | "number" | "na";
  tooltip?: string;
}

function MetricCard({ label, value, format = "percent", tooltip }: MetricCardProps) {
  const display =
    value == null || format === "na"
      ? "N/A"
      : format === "percent"
        ? formatPercent(value)
        : value.toFixed(2);
  return (
    <Card className="rounded-2xl border-primary/20 bg-primary/[0.03] transition-colors duration-200">
      <CardHeader className="pb-1">
        <span className="text-xs font-medium text-muted-foreground inline-flex items-center gap-1">
          {label}
          {tooltip && (
            <span
              className="inline-flex size-3.5 rounded-full bg-muted items-center justify-center text-[10px] text-muted-foreground cursor-help border border-[rgba(51,51,51,0.12)]"
              title={tooltip}
              aria-label={`Definition: ${tooltip}`}
            >
              i
            </span>
          )}
        </span>
      </CardHeader>
      <CardContent>
        <span className="text-xl font-semibold text-foreground tabular-nums">{display}</span>
      </CardContent>
    </Card>
  );
}

function ScoresHelpTrigger() {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setOpen(true), 150);
  };
  const hide = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
    setOpen(false);
  };

  useEffect(() => () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); }, []);

  return (
    <div className="relative inline-flex">
      <span
        role="img"
        aria-label="How scores are calculated"
        className="inline-flex size-5 rounded-full bg-muted items-center justify-center text-[11px] text-muted-foreground cursor-help border border-[rgba(51,51,51,0.12)] hover:bg-muted/80"
        onMouseEnter={show}
        onMouseLeave={hide}
      >
        ?
      </span>
      {open && (
        <div
          className="absolute right-0 top-full z-50 mt-1.5 w-[min(320px,85vw)] rounded-lg border border-[rgba(51,51,51,0.12)] bg-popover p-4 text-popover-foreground shadow-md"
          onMouseEnter={show}
          onMouseLeave={hide}
        >
          <p className="font-syne text-sm font-semibold text-foreground mb-2">
            How scores are calculated
          </p>
          <p className="text-xs leading-relaxed text-muted-foreground mb-3">
            {HOW_SCORES_CALCULATED.intro}
          </p>
          <dl className="space-y-2 text-xs text-muted-foreground">
            <div>
              <dt className="font-medium text-foreground">Market correlation</dt>
              <dd className="leading-relaxed mt-0.5">{HOW_SCORES_CALCULATED.marketCorrelation}</dd>
            </div>
            <div>
              <dt className="font-medium text-foreground">Risk stability</dt>
              <dd className="leading-relaxed mt-0.5">{HOW_SCORES_CALCULATED.riskStability}</dd>
            </div>
            <div>
              <dt className="font-medium text-foreground">Risk-adjusted</dt>
              <dd className="leading-relaxed mt-0.5">{HOW_SCORES_CALCULATED.riskAdjusted}</dd>
            </div>
            <div>
              <dt className="font-medium text-foreground">Performance</dt>
              <dd className="leading-relaxed mt-0.5">{HOW_SCORES_CALCULATED.performance}</dd>
            </div>
          </dl>
          <p className="text-xs font-medium text-foreground pt-2 mt-2 border-t border-[rgba(51,51,51,0.12)]">
            {HOW_SCORES_CALCULATED.importantNote}
          </p>
        </div>
      )}
    </div>
  );
}

const TOOLTIPS = {
  cumulativeReturn:
    "Total change in value over the selected period. Higher returns are attractive, but they should always be read alongside drawdown and volatility.",
  sharpeRatio:
    "A simple measure of return earned per unit of risk. Higher is generally better, but it depends on the assumptions used in the backtest.",
  maxDrawdown:
    "The largest peak-to-trough fall over the tested period. This helps show how painful a strategy could feel during a bad stretch.",
  annualisedVolatility:
    "How widely returns tended to swing over time. Higher volatility usually means a less stable ride.",
};

interface MetricsCardsProps {
  cumulativeReturn?: number | null;
  sharpeRatio?: number | null;
  maxDrawdown?: number | null;
  annualisedVolatility?: number | null;
  /** When no metrics available, show this message instead of empty grid. */
  fallbackMessage?: string;
  /** Override explainer paragraph (e.g. from strategy copy). */
  explainerText?: string;
}

export function MetricsCards({
  cumulativeReturn,
  sharpeRatio,
  maxDrawdown,
  annualisedVolatility,
  fallbackMessage,
  explainerText,
}: MetricsCardsProps) {
  const hasAnyMetric =
    cumulativeReturn != null ||
    sharpeRatio != null ||
    maxDrawdown != null ||
    annualisedVolatility != null;
  const defaultExplainer =
    "Metrics are from the latest backtest run. Run a new backtest to refresh. Not investment advice.";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-muted-foreground">Performance metrics</span>
        <ScoresHelpTrigger />
      </div>
      {hasAnyMetric ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {cumulativeReturn != null && (
              <MetricCard
                label="Cumulative return"
                value={cumulativeReturn}
                tooltip={TOOLTIPS.cumulativeReturn}
              />
            )}
            {(sharpeRatio != null || cumulativeReturn != null) && (
              <MetricCard
                label="Sharpe ratio"
                value={sharpeRatio ?? null}
                format={sharpeRatio == null ? "na" : "number"}
                tooltip={TOOLTIPS.sharpeRatio}
              />
            )}
            {maxDrawdown != null && (
              <MetricCard
                label="Max drawdown"
                value={maxDrawdown}
                tooltip={TOOLTIPS.maxDrawdown}
              />
            )}
            {annualisedVolatility != null && (
              <MetricCard
                label="Annualised volatility"
                value={annualisedVolatility}
                tooltip={TOOLTIPS.annualisedVolatility}
              />
            )}
          </div>
          <p id="metrics-explainer" className="text-xs text-muted-foreground mt-2">
            {explainerText ?? defaultExplainer}
          </p>
        </>
      ) : (
        <div className="rounded-2xl border border-primary/20 bg-primary/[0.03] px-4 py-5">
          <p className="text-sm text-muted-foreground">
            {fallbackMessage ?? "No backtest metrics yet. Run a backtest to see results."}
          </p>
          <p id="metrics-explainer" className="text-xs text-muted-foreground mt-2">
            {explainerText ?? defaultExplainer}
          </p>
        </div>
      )}
    </div>
  );
}
