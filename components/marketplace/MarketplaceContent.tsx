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
  const sort = searchParams.get("sort") ?? "trending";
  const [search, setSearch] = useState("");

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
    if (sort === "drawdown" && list.some((a) => isDbVersion(a) && (a as DbVersion).cachedMaxDrawdown != null)) {
      list = [...list].sort((a, b) => {
        const da = isDbVersion(a) ? (a.cachedMaxDrawdown ?? 1) : 1;
        const db = isDbVersion(b) ? (b.cachedMaxDrawdown ?? 1) : 1;
        return da - db;
      });
    }
    if (sort === "sharpe" && list.some((a) => isDbVersion(a) && (a as DbVersion).cachedSharpe != null)) {
      list = [...list].sort((a, b) => {
        const sa = isDbVersion(a) ? (a.cachedSharpe ?? 0) : 0;
        const sb = isDbVersion(b) ? (b.cachedSharpe ?? 0) : 0;
        return sb - sa;
      });
    }
    return list;
  }, [algorithms, search, sort]);

  return (
    <>
      <MarketplaceFilterBar
        tagOptions={tagOptions}
        totalCount={algorithms.length}
        resultCount={filtered.length}
        search={search}
        onSearchChange={setSearch}
      />
      {filtered.length === 0 ? (
        <p className="text-muted-foreground py-8">
          {algorithms.length === 0
            ? "No algorithms yet. Run the database seed to populate the marketplace."
            : "No algorithms match your filters."}
        </p>
      ) : useDemo ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((v) => (
            <Link key={v.id} href={`/algo/${v.id}`}>
              <Card className="h-full rounded-2xl border-primary/20 bg-primary/[0.03] transition-colors hover:border-primary/30 hover:bg-primary/5 focus-within:ring-2 focus-within:ring-ring">
                <CardHeader className="pb-2">
                  <CardTitle className="font-syne text-sm font-semibold">{v.name}</CardTitle>
                  <CardDescription className="line-clamp-2">{v.shortDesc}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-1">
                    {(v as DemoAlgo).tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  {(v as DemoAlgo).riskLevel && (
                    <Badge variant="outline">{(v as DemoAlgo).riskLevel}</Badge>
                  )}
                  <p className="text-xs text-muted-foreground">Demo mode · Run backtest to see metrics</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((v) => (
            <Link key={v.id} href={`/algo/${v.id}`}>
              <Card className="h-full rounded-2xl border-primary/20 bg-primary/[0.03] transition-colors hover:border-primary/30 hover:bg-primary/5 focus-within:ring-2 focus-within:ring-ring">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="font-syne text-sm font-semibold">{v.name}</CardTitle>
                    {isDbVersion(v) && v.verificationStatus === "verified" && (
                      <ShieldCheck className="size-4 text-primary shrink-0" aria-hidden />
                    )}
                  </div>
                  <CardDescription className="line-clamp-2">
                    {v.shortDesc ?? (v as DbVersion).description ?? ""}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-1">
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
                  {v.riskLevel && <Badge variant="outline">{v.riskLevel}</Badge>}
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {isDbVersion(v) && v.cachedReturn != null && (
                      <span>Return: {formatPercent(v.cachedReturn)}</span>
                    )}
                    {isDbVersion(v) && v.cachedSharpe != null && (
                      <span>Sharpe: {v.cachedSharpe.toFixed(2)}</span>
                    )}
                    {isDbVersion(v) && v.cachedMaxDrawdown != null && (
                      <span>Max DD: {formatPercent(v.cachedMaxDrawdown)}</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
