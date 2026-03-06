"use client";

interface MethodologyAssumptionsSectionProps {
  dataSource: string;
  symbol: string;
  testedPeriod: string;
  version: string;
  note?: string;
}

export function MethodologyAssumptionsSection({
  dataSource,
  symbol,
  testedPeriod,
  version,
  note,
}: MethodologyAssumptionsSectionProps) {
  return (
    <details className="group rounded-2xl border border-border bg-card overflow-hidden">
      <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-medium text-foreground hover:bg-muted/50 focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset [&::-webkit-details-marker]:hidden">
        Methodology and assumptions
        <span className="inline-block size-4 shrink-0 transition-transform group-open:rotate-180 text-muted-foreground" aria-hidden>
          ▾
        </span>
      </summary>
      <div className="border-t border-border px-4 pb-4 pt-2">
        <dl className="space-y-2 text-sm">
          <div>
            <dt className="font-medium text-foreground">Data source</dt>
            <dd className="text-muted-foreground">{dataSource}</dd>
          </div>
          <div>
            <dt className="font-medium text-foreground">Symbol</dt>
            <dd className="text-muted-foreground">{symbol}</dd>
          </div>
          <div>
            <dt className="font-medium text-foreground">Tested period</dt>
            <dd className="text-muted-foreground">{testedPeriod}</dd>
          </div>
          <div>
            <dt className="font-medium text-foreground">Version</dt>
            <dd className="text-muted-foreground">{version}</dd>
          </div>
        </dl>
        {note && (
          <p className="mt-3 text-xs text-muted-foreground leading-relaxed">{note}</p>
        )}
      </div>
    </details>
  );
}
