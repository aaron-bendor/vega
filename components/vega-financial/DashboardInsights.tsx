"use client";

import { Card, CardContent } from "@/components/ui/card";
import type { MockAccount } from "@/lib/mock/portfolio";
import { Lightbulb } from "lucide-react";

interface DashboardInsightsProps {
  account: MockAccount;
}

export function DashboardInsights({ account }: DashboardInsightsProps) {
  const hasHoldings = account.holdings.length > 0;
  const count = account.holdings.length;

  const tips: string[] = [];
  if (!hasHoldings) {
    tips.push("Explore two or three strategies with different styles to build a diversified paper portfolio.");
  } else if (count === 1) {
    tips.push("Consider adding another strategy to spread risk across different approaches.");
  } else if (account.unrealizedPnlPct < -5) {
    tips.push("Paper performance is down. Review strategy fit and risk before changing anything.");
  } else {
    tips.push("Review your allocation mix and risk levels when you add or change strategies.");
  }

  return (
    <Card className="rounded-2xl border border-border bg-card min-w-0">
      <CardContent className="py-4 sm:py-5 px-4 sm:px-5">
        <div className="flex gap-3">
          <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Lightbulb className="size-4 text-primary" aria-hidden />
          </div>
          <div>
            <h3 className="font-maven-pro text-sm font-medium text-foreground mb-1">Insight</h3>
            <p className="text-sm text-muted-foreground">{tips[0]}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
