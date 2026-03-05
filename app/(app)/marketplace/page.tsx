import Link from "next/link";

export const dynamic = "force-dynamic";
import { listPublishedVersions, listTags } from "@/lib/db/algorithms";
import { withDbOrThrow } from "@/lib/db/safe";
import { loadDemoAlgorithms } from "@/lib/demo/loader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPercent } from "@/lib/utils/format";
import { ShieldCheck } from "lucide-react";

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

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="font-syne text-2xl md:text-3xl font-bold mb-6 text-foreground">Marketplace</h1>
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
      <p className="text-muted-foreground mb-4">
        Browse published algorithms. Simulated performance only. Paper trading
        only.
      </p>
      <div className="mb-8 flex flex-wrap gap-2">
        {useDemo && (
          <span className="text-xs text-muted-foreground self-center mr-2">
            Demo mode
          </span>
        )}
        <Link
          href="/marketplace"
          className={`px-3 py-1 rounded-md text-sm ${
            !params.tag && !params.risk
              ? "bg-primary text-primary-foreground"
              : "bg-muted hover:bg-muted/80"
          }`}
        >
          All
        </Link>
        {(useDemo ? Array.from(new Set(demoAlgos.flatMap((a) => a.tags))) : tags.map((t) => t.name)).map(
          (tagName) => (
            <Link
              key={tagName}
              href={`/marketplace?tag=${encodeURIComponent(tagName)}`}
              className={`px-3 py-1 rounded-md text-sm ${
                params.tag === tagName
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              {tagName}
            </Link>
          )
        )}
        {["Low", "Medium", "High"].map((risk) => (
          <Link
            key={risk}
            href={`/marketplace?risk=${encodeURIComponent(risk)}`}
            className={`px-3 py-1 rounded-md text-sm ${
              params.risk === risk ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
            }`}
          >
            {risk}
          </Link>
        ))}
      </div>

      {versions.length === 0 && filteredDemo.length === 0 ? (
        <p className="text-muted-foreground">
          No algorithms yet. Run the database seed to populate the marketplace.
        </p>
      ) : useDemo ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredDemo.map((v) => (
            <Link key={v.id} href={`/algo/${v.id}`}>
              <Card className="h-full rounded-2xl border-primary/20 bg-primary/[0.03] transition-colors hover:border-primary/30 hover:bg-primary/5">
                <CardHeader className="pb-2">
                  <CardTitle className="font-syne text-sm font-semibold">{v.name}</CardTitle>
                  <CardDescription className="line-clamp-2">{v.shortDesc}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-1">
                    {v.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  {v.riskLevel && <Badge variant="outline">{v.riskLevel}</Badge>}
                  <p className="text-xs text-muted-foreground">Demo mode · Run backtest to see metrics</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {versions.map((v) => (
            <Link key={v.id} href={`/algo/${v.id}`}>
              <Card className="h-full rounded-2xl border-primary/20 bg-primary/[0.03] transition-colors hover:border-primary/30 hover:bg-primary/5">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="font-syne text-sm font-semibold">{v.name}</CardTitle>
                    {v.verificationStatus === "verified" && (
                      <ShieldCheck className="size-4 text-primary shrink-0" />
                    )}
                  </div>
                  <CardDescription className="line-clamp-2">
                    {v.shortDesc ?? v.description ?? ""}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-1">
                    {v.tags.map(({ tag }) => (
                      <Badge key={tag.id} variant="secondary" className="text-xs">
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                  {v.riskLevel && <Badge variant="outline">{v.riskLevel}</Badge>}
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {v.cachedReturn != null && <span>Return: {formatPercent(v.cachedReturn)}</span>}
                    {v.cachedSharpe != null && <span>Sharpe: {v.cachedSharpe.toFixed(2)}</span>}
                    {v.cachedMaxDrawdown != null && (
                      <span>Max DD: {formatPercent(v.cachedMaxDrawdown)}</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
