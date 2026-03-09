import Link from "next/link";
import { getCompareStrategies } from "@/lib/vega-financial/compare-data";
import { ComparePanel } from "@/components/marketplace/ComparePanel";
import { VegaFinancialPageScaffold } from "@/components/vega-financial/VegaFinancialPageScaffold";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

function EmptyState({
  message,
  showClearAll,
}: {
  message: string;
  showClearAll?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-8 text-center max-w-lg mx-auto space-y-4">
      <p className="text-muted-foreground">{message}</p>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button asChild variant="default" size="sm" className="min-h-[44px]">
          <Link href="/vega-financial/marketplace">Go to Strategies</Link>
        </Button>
        {showClearAll && (
          <Button asChild variant="outline" size="sm" className="min-h-[44px]">
            <Link href="/vega-financial/compare">Clear all</Link>
          </Button>
        )}
      </div>
    </div>
  );
}

export default async function VegaFinancialComparePage({
  searchParams,
}: {
  searchParams: Promise<{ compare?: string }>;
}) {
  const params = await searchParams;
  const compareParam = params.compare?.trim() ?? "";
  const ids = compareParam
    ? compareParam.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 3)
    : [];

  if (ids.length === 0) {
    return (
      <VegaFinancialPageScaffold
        title="Compare strategies"
        description="Select 2 to 3 strategies on the Strategies page to compare them side by side."
      >
        <EmptyState
          message="Select at least 2 strategies to compare. Use the Strategies page to choose strategies, then click &quot;Compare strategies&quot;."
        />
      </VegaFinancialPageScaffold>
    );
  }

  const { strategies, invalidIds } = await getCompareStrategies(ids);

  if (strategies.length < 2) {
    const oneValid = strategies.length === 1;
    const noneValid = strategies.length === 0;
    const message = noneValid
      ? "We couldn&apos;t load any of the selected strategies. Check the link or choose strategies from the Strategies page."
      : oneValid
        ? "Only one strategy could be loaded. Add at least one more from the Strategies page to compare."
        : "Select at least 2 strategies to compare. Use the Strategies page to choose strategies, then click &quot;Compare strategies&quot;.";
    return (
      <VegaFinancialPageScaffold
        title="Compare strategies"
        description="Select 2 to 3 strategies on the Strategies page to compare them side by side."
      >
        <EmptyState message={message} showClearAll />
      </VegaFinancialPageScaffold>
    );
  }

  return (
    <VegaFinancialPageScaffold
      title="Compare strategies"
      description="Side-by-side comparison of selected strategies. Simulated data for demo only."
    >
      <ComparePanel
        strategies={strategies}
        compareIds={ids}
        invalidIds={invalidIds}
      />
    </VegaFinancialPageScaffold>
  );
}
