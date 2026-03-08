export const dynamic = "force-dynamic";
import { listPublishedVersions, listTags } from "@/lib/db/algorithms";
import { withDbOrThrow } from "@/lib/db/safe";
import { loadDemoAlgorithms } from "@/lib/demo/loader";
import { MarketplaceContent } from "@/components/marketplace/MarketplaceContent";
import { PageHeader } from "@/components/vega-financial/PageHeader";
import { PAGE_SUBTITLES } from "@/lib/vega-financial/investor-copy";

export default async function VegaFinancialMarketplacePage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string; risk?: string }>;
}) {
  const params = await searchParams;
  const { data: tags, dbAvailable } = await withDbOrThrow(
    () => listTags(),
    [] as Awaited<ReturnType<typeof listTags>>
  );
  const tagIds = params.tag
    ? tags.filter((t) => t.name === params.tag).map((t) => t.id)
    : undefined;
  const { data: versions } = await withDbOrThrow(
    () =>
      listPublishedVersions({
        tagIds,
        riskLevel: params.risk ?? undefined,
      }),
    []
  );

  const demoAlgos = !dbAvailable ? loadDemoAlgorithms() : [];
  const useDemo = !dbAvailable && demoAlgos.length > 0;

  const filteredDemo =
    useDemo && demoAlgos.length
      ? demoAlgos.filter((a) => {
          if (params.tag && !a.tags.includes(params.tag)) return false;
          if (params.risk && a.riskLevel !== params.risk) return false;
          return true;
        })
      : [];

  const algorithms = useDemo ? filteredDemo : versions;
  const tagOptions = useDemo
    ? Array.from(new Set(demoAlgos.flatMap((a) => a.tags))).filter((t) => t !== "Low Risk")
    : tags.map((t) => t.name);

  return (
    <div className="w-full max-w-6xl min-w-0 mx-auto px-4 pt-6 pb-6 sm:px-6 sm:pt-8 sm:pb-8 lg:px-8 space-y-6">
      <PageHeader
        title="Explore strategies"
        subtitle={PAGE_SUBTITLES.explore}
      />
      <div className="min-w-0">
        <MarketplaceContent
          algorithms={algorithms as Parameters<typeof MarketplaceContent>[0]["algorithms"]}
          tagOptions={tagOptions}
          useDemo={useDemo}
        />
      </div>
    </div>
  );
}
