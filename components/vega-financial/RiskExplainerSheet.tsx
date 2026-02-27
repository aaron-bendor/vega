"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { RiskBadge } from "./RiskBadge";

interface RiskExplainerSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  riskScore: number;
  var95MonthlyPct?: number;
  standardised?: boolean;
}

export function RiskExplainerSheet({
  open,
  onOpenChange,
  riskScore,
  var95MonthlyPct,
  standardised = false,
}: RiskExplainerSheetProps) {
  const varPct = var95MonthlyPct != null ? (var95MonthlyPct * 100).toFixed(1) : null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-2xl max-h-[85vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            Risk explained
            <RiskBadge
              score={riskScore}
              var95MonthlyPct={var95MonthlyPct}
              standardised={standardised}
              variant="compact"
            />
          </SheetTitle>
        </SheetHeader>
        <div className="space-y-6 pt-4 text-sm text-foreground">
          <p className="text-muted-foreground">
            The risk score (1–10) gives you a quick read: lower is calmer, higher is more volatile.
            It is based on how much the strategy’s value has moved in the past.
          </p>

          <div>
            <h4 className="font-semibold mb-2">95% monthly VaR (Value at Risk)</h4>
            <p className="text-muted-foreground">
              {varPct != null ? (
                <>
                  In normal market conditions, there is a 95% chance that this strategy’s
                  <strong className="text-foreground"> maximum loss in a single month </strong>
                  will not exceed <strong className="text-foreground">{varPct}%</strong> of the
                  portfolio value. In other words, in about 1 month out of 20 you could see a
                  larger loss. This is a simulated, backtest-based estimate—not a guarantee.
                </>
              ) : (
                <>
                  VaR (Value at Risk) estimates the maximum loss you might see in a single month
                  with a given level of confidence. We use a 95% monthly VaR: in about 19 months
                  out of 20, losses should stay within this bound. Actual results can differ.
                </>
              )}
            </p>
          </div>

          {standardised && (
            <div>
              <h4 className="font-semibold mb-2">Standardised risk</h4>
              <p className="text-muted-foreground">
                This strategy is wrapped by the platform’s risk engine so that investor-facing
                risk is held to a target. That makes it comparable with other standardised
                offerings—similar to an “investable” version of the underlying strategy.
              </p>
            </div>
          )}

          <p className="text-xs text-muted-foreground border-t border-[rgba(51,51,51,0.12)] pt-4">
            University prototype. Simulated data. Not investment advice. Past performance does
            not guarantee future results.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
