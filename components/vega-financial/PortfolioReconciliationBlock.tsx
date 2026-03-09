"use client";

import { formatCurrency } from "@/lib/utils/format";
import { cn } from "@/lib/utils";

export interface PortfolioReconciliationBlockProps {
  availableCash: number;
  holdingsValue: number;
  totalEquity: number;
  invested: number;
  unrealisedPnl: number;
  className?: string;
}

/**
 * Visible reconciliation block: five numbers (available cash, holdings value,
 * total equity, invested amount, unrealised PnL). No equation display.
 */
export function PortfolioReconciliationBlock({
  availableCash,
  holdingsValue,
  totalEquity,
  invested,
  unrealisedPnl,
  className,
}: PortfolioReconciliationBlockProps) {
  return (
    <section
      className={cn(
        "rounded-xl border border-border bg-muted/30 p-4 sm:p-5 text-sm",
        className
      )}
      aria-labelledby="reconciliation-heading"
    >
      <h2 id="reconciliation-heading" className="font-maven-pro font-medium text-foreground mb-3">
        Cash and holdings check
      </h2>
      <p className="text-xs text-muted-foreground mb-3">
        Checks that your cash balance, holdings, and transactions all match.
      </p>
      <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-x-4 gap-y-2">
        <div>
          <dt className="text-muted-foreground">Available cash</dt>
          <dd className="font-medium tabular-nums text-foreground">{formatCurrency(availableCash)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Holdings value</dt>
          <dd className="font-medium tabular-nums text-foreground">{formatCurrency(holdingsValue)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Total equity</dt>
          <dd className="font-medium tabular-nums text-foreground">{formatCurrency(totalEquity)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Invested amount</dt>
          <dd className="font-medium tabular-nums text-foreground">{formatCurrency(invested)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Unrealised PnL</dt>
          <dd
            className={cn(
              "font-medium tabular-nums",
              unrealisedPnl >= 0 ? "text-brand-green" : "text-brand-red"
            )}
          >
            {formatCurrency(unrealisedPnl)}
          </dd>
        </div>
      </dl>
    </section>
  );
}
