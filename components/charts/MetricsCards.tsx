import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatPercent } from "@/lib/utils/format";

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
    <Card className="rounded-2xl border-primary/20 bg-primary/[0.03]">
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

interface MetricsCardsProps {
  cumulativeReturn?: number | null;
  sharpeRatio?: number | null;
  maxDrawdown?: number | null;
  annualisedVolatility?: number | null;
}

export function MetricsCards({
  cumulativeReturn,
  sharpeRatio,
  maxDrawdown,
  annualisedVolatility,
}: MetricsCardsProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-muted-foreground">Performance metrics</span>
        <a
          href="#metrics-explainer"
          className="text-xs text-primary hover:underline focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring rounded"
        >
          How scores are calculated
        </a>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cumulativeReturn != null && (
          <MetricCard
            label="Cumulative return"
            value={cumulativeReturn}
            tooltip="Total return over the backtest period (e.g. 0.15 = 15%)."
          />
        )}
        {(sharpeRatio != null || cumulativeReturn != null) && (
          <MetricCard
            label="Sharpe ratio"
            value={sharpeRatio ?? null}
            format={sharpeRatio == null ? "na" : "number"}
            tooltip="Risk-adjusted return. Higher is better. Typically above 1 is good."
          />
        )}
        {maxDrawdown != null && (
          <MetricCard
            label="Max drawdown"
            value={maxDrawdown}
            tooltip="Largest peak-to-trough decline in equity during the backtest."
          />
        )}
        {annualisedVolatility != null && (
          <MetricCard
            label="Annualised volatility"
            value={annualisedVolatility}
            tooltip="Standard deviation of returns, annualised. Higher means more variability."
          />
        )}
      </div>
      <p id="metrics-explainer" className="text-xs text-muted-foreground mt-2">
        Metrics are from the latest backtest run. Run a new backtest to refresh. Not investment advice.
      </p>
    </div>
  );
}
