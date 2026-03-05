export const dynamic = "force-dynamic";
import { listPublishedVersions, listTags } from "@/lib/db/algorithms";
import { withDbOrThrow } from "@/lib/db/safe";
import { loadDemoAlgorithms } from "@/lib/demo/loader";
import { MarketplaceContent } from "@/components/marketplace/MarketplaceContent";

export default async function MarketplacePage({
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
    ? Array.from(new Set(demoAlgos.flatMap((a) => a.tags)))
    : tags.map((t) => t.name);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="font-syne text-2xl md:text-3xl font-bold mb-2 text-foreground">Marketplace</h1>
      {!dbAvailable && !useDemo && (
        <div className="mb-6 rounded-lg border border-[rgba(51,51,51,0.12)] bg-[rgba(51,51,51,0.04)] px-4 py-3 text-sm text-muted-foreground">
          <strong className="text-foreground">Database not configured.</strong> Set{" "}
          <code className="rounded bg-[rgba(51,51,51,0.06)] px-1">DATABASE_URL</code> in{" "}
          <code className="rounded bg-[rgba(51,51,51,0.06)] px-1">.env</code>, run{" "}
          <code className="rounded bg-[rgba(51,51,51,0.06)] px-1">npm run prisma:migrate</code>{" "}
          and <code className="rounded bg-[rgba(51,51,51,0.06)] px-1">npm run prisma:seed</code>{" "}
          to see seeded data.
        </div>
      )}
      <p className="text-muted-foreground mb-6">
        Browse published algorithms. Simulated performance only. Paper trading only.
      </p>
      {useDemo && (
        <span className="text-xs text-muted-foreground mb-4 inline-block">Demo mode</span>
      )}
      <MarketplaceContent
        algorithms={algorithms as Parameters<typeof MarketplaceContent>[0]["algorithms"]}
        tagOptions={tagOptions}
        useDemo={useDemo}
      />
    </div>
  );
}
