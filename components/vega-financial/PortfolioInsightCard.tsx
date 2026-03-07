"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import type { MockAccount } from "@/lib/mock/portfolio";

interface PortfolioInsightCardProps {
  account: MockAccount;
  className?: string;
}

/**
 * One of two half-width insight cards: portfolio insight with CTA Review allocation.
 */
export function PortfolioInsightCard({ account, className }: PortfolioInsightCardProps) {
  const hasHoldings = account.holdings.length > 0;
  const totalAllocated = account.holdings.reduce((s, h) => s + h.currentValue, 0);

  let body: string;
  if (!hasHoldings) {
    body = "Your portfolio is empty. Add a strategy to get started.";
  } else if (account.holdings.length === 1) {
    body = "Adding a lower-correlation strategy could improve diversification.";
  } else {
    const topHolding = account.holdings.reduce((a, b) =>
      a.currentValue > b.currentValue ? a : b
    );
    const riskLevels = account.holdings.map((h) => h.riskScore ?? 5);
    const avgRisk = riskLevels.reduce((s, r) => s + r, 0) / riskLevels.length;
    if (avgRisk >= 5 && avgRisk <= 6) {
      body = "Your portfolio is tilted towards medium-risk strategies.";
    } else if (topHolding && totalAllocated > 0 && topHolding.currentValue / totalAllocated > 0.4) {
      body = `Most of your gains are coming from ${topHolding.name}.`;
    } else {
      body = "Adding a lower-correlation strategy could improve diversification.";
    }
  }

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-4 flex flex-col gap-3",
        className
      )}
    >
      <h3 className="text-sm font-semibold text-foreground">Portfolio insight</h3>
      <p className="text-sm text-muted-foreground leading-snug">{body}</p>
      <Link
        href="/vega-financial/portfolio"
        className="text-sm font-medium text-primary hover:underline focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring rounded self-start"
      >
        Review allocation
      </Link>
    </div>
  );
}
