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
 * Visible reconciliation block: five numbers and two invariant equations.
 * Gives users a built-in audit trail so the ledger maths are transparent.
 */
export function PortfolioReconciliationBlock({
  availableCash,
  holdingsValue,
  totalEquity,
  invested,
  unrealisedPnl,
  className,
}: PortfolioReconciliationBlockProps) {
  const equityCheck = Math.abs(totalEquity - (availableCash + holdingsValue)) < 0.02;
  const pnlCheck = Math.abs(unrealisedPnl - (holdingsValue - invested)) < 0.02;

  return (
    <section
      className={cn(
        "rounded-xl border border-border bg-muted/30 p-4 sm:p-5 text-sm",
        className
      )}
      aria-labelledby="reconciliation-heading"
    >
      <h2 id="reconciliation-heading" className="font-medium text-foreground mb-3">
        Ledger reconciliation
      </h2>
      <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-x-4 gap-y-2 mb-4">
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
      <div className="space-y-1 text-muted-foreground border-t border-border pt-3">
        <p className="tabular-nums" aria-label="Equity equation">
          Available cash + Holdings value = Total equity →{" "}
          <span className={equityCheck ? "text-brand-green" : "text-destructive"}>
            {formatCurrency(availableCash)} + {formatCurrency(holdingsValue)} = {formatCurrency(totalEquity)}
            {equityCheck ? " ✓" : " (mismatch)"}
          </span>
        </p>
        <p className="tabular-nums" aria-label="PnL equation">
          Holdings value − Invested amount = Unrealised PnL →{" "}
          <span className={pnlCheck ? "text-brand-green" : "text-destructive"}>
            {formatCurrency(holdingsValue)} − {formatCurrency(invested)} = {formatCurrency(unrealisedPnl)}
            {pnlCheck ? " ✓" : " (mismatch)"}
          </span>
        </p>
      </div>
    </section>
  );
}
