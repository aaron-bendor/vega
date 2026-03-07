"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search } from "lucide-react";
import { MarketplaceFilterRail } from "./MarketplaceFilterRail";
import { StrategyCard } from "@/components/vega-financial/StrategyCard";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SORT_OPTIONS = [
  { value: "best-fit", label: "Best fit for portfolio" },
  { value: "drawdown", label: "Lowest drawdown" },
  { value: "risk", label: "Lowest risk" },
  { value: "return", label: "Highest return" },
  { value: "newest", label: "Newest" },
] as const;

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
  void useDemo; // reserved for future demo-specific UI
  const searchParams = useSearchParams();
  const sort = searchParams.get("sort") ?? "newest";
  const [search, setSearch] = useState("");
  const [compareIds, setCompareIds] = useState<Set<string>>(new Set());
  const router = useRouter();
  const setSort = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("sort", value);
      router.push(`/vega-financial/marketplace?${params.toString()}`);
    },
    [router, searchParams]
  );

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
    <div className="flex gap-8 lg:gap-10">
      {/* Left: sticky filter rail — desktop only */}
      <div className="hidden lg:block">
        <MarketplaceFilterRail tagOptions={tagOptions} />
      </div>

      {/* Right: header + results */}
      <div className="min-w-0 flex-1 space-y-6">
        {/* Mobile: inline filter links (rail hidden on small screens) */}
        <div className="flex flex-wrap gap-2 lg:hidden">
          <Link
            href="/vega-financial/marketplace"
            className="rounded-md border border-border px-2.5 py-1.5 text-sm text-muted-foreground hover:bg-muted/50 hover:text-foreground"
          >
            All
          </Link>
          {(tagOptions.length > 0 ? tagOptions : ["Momentum", "Mean Reversion", "Quant"]).slice(0, 5).map((t) => (
            <Link
              key={t}
              href={`/vega-financial/marketplace?tag=${encodeURIComponent(t)}`}
              className="rounded-md border border-border px-2.5 py-1.5 text-sm text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            >
              {t}
            </Link>
          ))}
          {["Low", "Medium", "High"].map((r) => (
            <Link
              key={r}
              href={`/vega-financial/marketplace?risk=${encodeURIComponent(r)}`}
              className="rounded-md border border-border px-2.5 py-1.5 text-sm text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            >
              Risk: {r}
            </Link>
          ))}
        </div>

        {/* Header: search, sort, count */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative min-w-0 max-w-md flex-1" data-tour="mp-filters">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none" aria-hidden />
            <Input
              type="search"
              placeholder="Search strategies…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 pl-9"
              aria-label="Search strategies"
            />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-sm text-muted-foreground whitespace-nowrap">Sort by</span>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="h-9 w-[180px] shrink-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <p className="text-sm text-muted-foreground tabular-nums">
          Showing {filtered.length} strateg{filtered.length === 1 ? "y" : "ies"}
        </p>

        {/* Collections — muted quick links */}
        <div className="flex flex-wrap gap-2">
          {COLLECTIONS.map((c) => (
            <Link
              key={c.label}
              href={c.href}
              className="rounded-lg border border-border bg-card px-3 py-2 text-sm hover:border-primary/25 hover:bg-muted/30 transition-colors duration-150 focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="font-medium text-foreground">{c.label}</span>
              <span className="text-muted-foreground text-xs block mt-0.5">{c.desc}</span>
            </Link>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-xl border border-border bg-muted/30 py-12 px-6 text-center">
            <p className="text-muted-foreground mb-4">
              {algorithms.length === 0
                ? "No strategies yet. Run the database seed to populate the marketplace."
                : "No strategies match your filters."}
            </p>
            {algorithms.length > 0 && (
              <p className="text-sm text-muted-foreground">
                Try adjusting filters or search to see more results.
              </p>
            )}
          </div>
        ) : (
          <>
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((v) => (
                <StrategyCard
                  key={v.id}
                  algorithm={v}
                  onCompareToggle={toggleCompare}
                  compareSelected={compareIds.has(v.id)}
                  compareDisabled={!compareIds.has(v.id) && compareIds.size >= 3}
                  dataTour={v.id === "demo-1" ? "mp-card-alpha" : undefined}
                />
              ))}
            </div>
            {compareArray.length >= 2 && (
              <div className="sticky bottom-0 left-0 right-0 z-20 flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-4 shadow-lg">
                <span className="text-sm font-medium text-foreground">
                  {compareArray.length} strategies selected
                </span>
                <Link
                  href={compareHref ?? "#"}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover transition-colors duration-150"
                >
                  Compare strategies
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
