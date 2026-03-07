import { DashboardPortfolioContent } from "@/components/vega-financial/DashboardPortfolioContent";
import { listPublishedVersions } from "@/lib/db/algorithms";
import { withDbOrThrow } from "@/lib/db/safe";
import { loadDemoAlgorithms } from "@/lib/demo/loader";

export const dynamic = "force-dynamic";

async function getAlgorithmsData() {
  const { data: versions, dbAvailable } = await withDbOrThrow(
    () => listPublishedVersions({}),
    []
  );

  const demoAlgos = !dbAvailable ? loadDemoAlgorithms() : [];
  const useDemo = !dbAvailable && demoAlgos.length > 0;

  const items = useDemo
    ? demoAlgos.map((a) => ({
        id: a.id,
        name: a.name,
        shortDesc: a.shortDesc,
        tags: a.tags,
        riskLevel: a.riskLevel ?? "Medium",
        riskScore: a.riskScore,
        var95MonthlyPct: a.var95MonthlyPct,
        standardised: a.standardised,
        attributes: a.attributes,
        verified: a.verified ?? false,
        return: undefined as number | undefined,
        volatility: undefined as number | undefined,
        maxDrawdown: undefined as number | undefined,
        sparklineData: [] as number[],
        thesis: a.thesis,
        bestFor: a.bestFor,
        mayNotSuit: a.mayNotSuit,
        statusBadgeText: a.statusBadgeText,
        cardFooterMicrocopy: a.cardFooterMicrocopy,
      }))
    : versions.map((v) => ({
        id: v.id,
        name: v.name,
        shortDesc: v.shortDesc ?? v.description ?? "",
        tags: v.tags?.map((t) => t.tag.name) ?? [],
        riskLevel: v.riskLevel ?? "Medium",
        riskScore: undefined as number | undefined,
        var95MonthlyPct: undefined as number | undefined,
        standardised: undefined as boolean | undefined,
        attributes: undefined,
        verified: v.verificationStatus === "verified",
        return: v.cachedReturn ?? undefined,
        volatility: v.cachedVolatility ?? undefined,
        maxDrawdown: v.cachedMaxDrawdown ?? undefined,
        sparklineData: [] as number[],
      }));

  return items;
}

export default async function VegaFinancialPage() {
  const algorithms = await getAlgorithmsData();

  const suggestedForCard = algorithms.slice(0, 5).map((a) => ({
    id: a.id,
    name: a.name,
    shortDesc: a.shortDesc ?? "",
    riskLevel: a.riskLevel ?? "Medium",
    verified: a.verified,
    return: a.return,
    maxDrawdown: a.maxDrawdown,
    sharpe: undefined as number | undefined,
  }));

  return <DashboardPortfolioContent suggestedAlgorithms={suggestedForCard} />;
}
