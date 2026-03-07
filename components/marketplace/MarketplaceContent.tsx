"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { MarketplaceFilterBar } from "./MarketplaceFilterBar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPercent } from "@/lib/utils/format";
import { ShieldCheck } from "lucide-react";

type DemoAlgo = { id: string; name: string; shortDesc?: string; tags: string[]; riskLevel?: string };
type DbVersion = {
  id: string;
  name: string;
  shortDesc?: string | null;
  description?: string | null;
  tags: { tag: { name: string } }[];
  riskLevel?: string | null;
  verificationStatus?: string;
  cachedReturn?: number | null;
  cachedSharpe?: number | null;
  cachedMaxDrawdown?: number | null;
};

type Algorithm = (DemoAlgo | DbVersion) & { _source?: "demo" | "db" };

function isDbVersion(a: Algorithm): a is DbVersion {
  return "verificationStatus" in a && Array.isArray((a as DbVersion).tags) && (a as DbVersion).tags[0]?.tag != null;
}

interface MarketplaceContentProps {
  algorithms: Algorithm[];
  tagOptions: string[];
  useDemo: boolean;
}

export function MarketplaceContent({ algorithms, tagOptions, useDemo }: MarketplaceContentProps) {
  const searchParams = useSearchParams();
  const sort = searchParams.get("sort") ?? "newest";
  const [search, setSearch] = useState("");
  const [compareIds, setCompareIds] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = q
      ? algorithms.filter((a) => {
          const name = a.name?.toLowerCase() ?? "";
          const desc = (a.shortDesc ?? (a as DbVersion).description ?? "").toLowerCase();
          return name.includes(q) || desc.includes(q);
        })
      : [...algorithms];

    if (sort === "newest") {
      list = [...list].reverse();
    }
    if (sort === "drawdown") {
      list = [...list].sort((a, b) => {
        const da = isDbVersion(a) ? (a.cachedMaxDrawdown ?? 1) : 1;
        const db = isDbVersion(b) ? (b.cachedMaxDrawdown ?? 1) : 1;
        return da - db;
      });
    }
    if (sort === "risk") {
      list = [...list].sort((a, b) => {
        const ra = (a.riskLevel === "Low" ? 1 : a.riskLevel === "High" ? 3 : 2);
        const rb = (b.riskLevel === "Low" ? 1 : b.riskLevel === "High" ? 3 : 2);
        return ra - rb;
      });
    }
    if (sort === "return" && list.some((a) => isDbVersion(a) && (a as DbVersion).cachedReturn != null)) {
      list = [...list].sort((a, b) => {
        const ra = isDbVersion(a) ? (a.cachedReturn ?? -1) : -1;
        const rb = isDbVersion(b) ? (b.cachedReturn ?? -1) : -1;
        return rb - ra;
      });
    }
    if (sort === "sharpe" && list.some((a) => isDbVersion(a) && (a as DbVersion).cachedSharpe != null)) {
      list = [...list].sort((a, b) => {
        const sa = isDbVersion(a) ? (a.cachedSharpe ?? 0) : 0;
        const sb = isDbVersion(b) ? (b.cachedSharpe ?? 0) : 0;
        return sb - sa;
      });
    }
    if (sort === "best-fit") {
      list = [...list];
    }
    return list;
  }, [algorithms, search, sort]);

  const toggleCompare = (id: string) => {
    setCompareIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else if (next.size < 3) next.add(id);
      return next;
    });
  };
  const compareArray = Array.from(compareIds);
  const compareHref = compareArray.length >= 2
    ? `/vega-financial/marketplace?compare=${compareArray.join(",")}`
    : null;

  const COLLECTIONS = [
    { label: "Low risk starters", href: "/vega-financial/marketplace?risk=Low", desc: "Strategies with lower volatility." },
    { label: "Diversifiers", href: "/vega-financial/marketplace?tag=Mean%20Reversion", desc: "May help balance your portfolio." },
    { label: "Longer track records", href: "/vega-financial/marketplace?sort=newest", desc: "Strategies with more history." },
    { label: "Verified strategies", href: "/vega-financial/marketplace", desc: "Reviewed by the platform." },
  ];

  return (
    <div className="space-y-6">
      <MarketplaceFilterBar
        tagOptions={tagOptions}
        totalCount={algorithms.length}
        resultCount={filtered.length}
        search={search}
        onSearchChange={setSearch}
      />

      {/* Collections strip */}
      <div className="flex flex-wrap gap-2">
        {COLLECTIONS.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="rounded-lg border border-border bg-card px-3 py-2 text-sm hover:bg-muted/30 transition-colors focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="font-medium text-foreground">{c.label}</span>
            <span className="text-muted-foreground text-xs block mt-0.5">{c.desc}</span>
          </Link>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-[rgba(51,51,51,0.12)] bg-muted/30 py-12 px-6 text-center">
          <p className="text-muted-foreground mb-4">
            {algorithms.length === 0
              ? "No strategies yet. Run the database seed to populate the marketplace."
              : "No strategies match your filters."}
          </p>
          {algorithms.length > 0 && (
            <p className="text-sm text-muted-foreground mb-4">
              Try adjusting filters or search to see more results.
            </p>
          )}
        </div>
      ) : useDemo ? (
        <>
          <div className="grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((v) => (
              <Card
                key={v.id}
                className="h-full min-h-[200px] flex flex-col rounded-2xl border border-border bg-card transition-[box-shadow,border-color] duration-200 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:border-muted-foreground/20 hover:shadow-md focus-within:ring-2 focus-within:ring-ring focus-within:outline-none motion-reduce:transition-none"
                data-tour={v.id === "demo-1" ? "mp-card-alpha" : undefined}
              >
                <CardHeader className="pb-2 flex-shrink-0">
                  <CardTitle className="font-syne text-sm font-semibold leading-tight">
                    <Link href={`/vega-financial/algorithms/${v.id}`} className="hover:underline">{v.name}</Link>
                  </CardTitle>
                  <CardDescription className="line-clamp-2 text-xs mt-1">{v.shortDesc}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 flex-1 flex flex-col justify-end pt-0">
                  <div className="flex flex-wrap gap-1.5">
                    {(v as DemoAlgo).tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  {(v as DemoAlgo).riskLevel && (
                    <Badge variant="outline" className="text-xs">{(v as DemoAlgo).riskLevel}</Badge>
                  )}
                  <p className="text-xs text-muted-foreground">Simulated results · View metrics and methodology</p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <Link href={`/vega-financial/algorithms/${v.id}`} className="text-sm font-medium text-primary hover:underline">
                      View details
                    </Link>
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); toggleCompare(v.id); }}
                      className="text-sm font-medium text-muted-foreground hover:text-foreground"
                    >
                      Compare
                    </button>
                    <Link href={`/vega-financial/algorithms/${v.id}#invest`} className="text-sm font-medium text-muted-foreground hover:text-foreground">
                      Add to watchlist
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {compareArray.length >= 2 && (
            <div className="sticky bottom-0 left-0 right-0 z-20 flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-4 shadow-lg">
              <span className="text-sm font-medium text-foreground">
                {compareArray.length} strategies selected
              </span>
              <Link
                href={compareHref ?? "#"}
                className="rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90"
              >
                Compare strategies
              </Link>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((v) => (
              <Card
                key={v.id}
                className="h-full min-h-[200px] flex flex-col rounded-2xl border border-border bg-card transition-[box-shadow,border-color] duration-200 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:border-muted-foreground/20 hover:shadow-md focus-within:ring-2 focus-within:ring-ring focus-within:outline-none motion-reduce:transition-none"
              >
                <CardHeader className="pb-2 flex-shrink-0">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="font-syne text-sm font-semibold leading-tight">
                      <Link href={`/vega-financial/algorithms/${v.id}`} className="hover:underline">{v.name}</Link>
                    </CardTitle>
                    {isDbVersion(v) && v.verificationStatus === "verified" && (
                      <ShieldCheck className="size-4 text-primary shrink-0 mt-0.5" aria-hidden />
                    )}
                  </div>
                  <CardDescription className="line-clamp-2 text-xs mt-1">
                    {v.shortDesc ?? (v as DbVersion).description ?? ""}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 flex-1 flex flex-col justify-end pt-0">
                  <div className="flex flex-wrap gap-1.5">
                    {isDbVersion(v)
                      ? v.tags.map(({ tag }, i) => (
                          <Badge key={(tag as { id?: string }).id ?? `${tag.name}-${i}`} variant="secondary" className="text-xs">
                            {tag.name}
                          </Badge>
                        ))
                      : (v as DemoAlgo).tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                  </div>
                  {v.riskLevel && <Badge variant="outline" className="text-xs">{v.riskLevel}</Badge>}
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    {isDbVersion(v) && v.cachedReturn != null && (
                      <span><span className="text-foreground">Return:</span> {formatPercent(v.cachedReturn)}</span>
                    )}
                    {isDbVersion(v) && v.cachedSharpe != null && (
                      <span><span className="text-foreground">Risk-adjusted:</span> {v.cachedSharpe.toFixed(2)}</span>
                    )}
                    {isDbVersion(v) && v.cachedMaxDrawdown != null && (
                      <span><span className="text-foreground">Biggest drop:</span> {formatPercent(v.cachedMaxDrawdown)}</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <Link href={`/vega-financial/algorithms/${v.id}`} className="text-sm font-medium text-primary hover:underline">
                      View details
                    </Link>
                    <button
                      type="button"
                      onClick={() => toggleCompare(v.id)}
                      className="text-sm font-medium text-muted-foreground hover:text-foreground"
                    >
                      Compare
                    </button>
                    <Link href={`/vega-financial/algorithms/${v.id}#invest`} className="text-sm font-medium text-muted-foreground hover:text-foreground">
                      Add to watchlist
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {compareArray.length >= 2 && (
            <div className="sticky bottom-0 left-0 right-0 z-20 flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-4 shadow-lg">
              <span className="text-sm font-medium text-foreground">
                {compareArray.length} strategies selected
              </span>
              <Link
                href={compareHref ?? "#"}
                className="rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90"
              >
                Compare strategies
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
