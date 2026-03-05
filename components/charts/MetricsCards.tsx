import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatPercent } from "@/lib/utils/format";

interface MetricCardProps {
  label: string;
  value: number | null;
  format?: "percent" | "number" | "na";
}

function MetricCard({ label, value, format = "percent" }: MetricCardProps) {
  const display =
    value == null || format === "na"
      ? "N/A"
      : format === "percent"
        ? formatPercent(value)
        : value.toFixed(2);
  return (
    <Card className="rounded-2xl border-primary/20 bg-primary/[0.03]">
      <CardHeader className="pb-1">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
      </CardHeader>
      <CardContent>
        <span className="text-xl font-semibold text-foreground">{display}</span>
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
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cumulativeReturn != null && (
        <MetricCard label="Cumulative return" value={cumulativeReturn} />
      )}
      {(sharpeRatio != null || cumulativeReturn != null) && (
        <MetricCard
          label="Sharpe ratio"
          value={sharpeRatio ?? null}
          format={sharpeRatio == null ? "na" : "number"}
        />
      )}
      {maxDrawdown != null && (
        <MetricCard label="Max drawdown" value={maxDrawdown} />
      )}
      {annualisedVolatility != null && (
        <MetricCard label="Annualised volatility" value={annualisedVolatility} />
      )}
    </div>
  );
}
