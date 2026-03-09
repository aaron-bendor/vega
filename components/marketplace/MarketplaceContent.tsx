"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";
import { MarketplaceFilterRail, MarketplaceFiltersSheet } from "./MarketplaceFilterRail";
import { StrategyCard } from "@/components/vega-financial/StrategyCard";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/routes";

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
  tagOptions?: string[];
  useDemo: boolean;
}

export function MarketplaceContent({ algorithms, useDemo }: MarketplaceContentProps) {
  void useDemo;
  const searchParams = useSearchParams();
  const sort = searchParams.get("sort") ?? "newest";
  const tag = searchParams.get("tag") ?? "";
  const asset = searchParams.get("asset") ?? "";
  const risk = searchParams.get("risk") ?? "";
  const [search, setSearch] = useState("");
  const [compareIds, setCompareIds] = useState<Set<string>>(new Set());
  const [maxCompareMessage, setMaxCompareMessage] = useState(false);
  const [filtersSheetOpen, setFiltersSheetOpen] = useState(false);
  const router = useRouter();

  const compareFromUrlDone = useRef(false);
  useEffect(() => {
    if (compareFromUrlDone.current || algorithms.length === 0) return;
    const compareParam = searchParams.get("compare");
    if (!compareParam) return;
    compareFromUrlDone.current = true;
    const ids = compareParam.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 3);
    const validIds = new Set(algorithms.map((a) => a.id).filter((id) => ids.includes(id)));
    if (validIds.size > 0) setCompareIds(validIds);
  }, [searchParams, algorithms]);
  const setSort = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("sort", value);
      router.push(`${ROUTES.vegaFinancial.marketplace}?${params.toString()}`);
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

    if (tag) {
      list = list.filter((a) => {
        const tags = isDbVersion(a) ? (a as DbVersion).tags.map((t) => t.tag.name) : (a as DemoAlgo).tags;
        return tags.some((t) => t === tag);
      });
    }
    if (asset) {
      list = list.filter((a) => {
        const tags = isDbVersion(a) ? (a as DbVersion).tags.map((t) => t.tag.name) : (a as DemoAlgo).tags;
        return tags.some((t) => t === asset);
      });
    }
    if (risk) {
      list = list.filter((a) => (a.riskLevel ?? "") === risk);
    }

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
  }, [algorithms, search, sort, tag, asset, risk]);

  const toggleCompare = (id: string) => {
    setCompareIds((prev) => {
      if (prev.has(id)) {
        setMaxCompareMessage(false);
        const next = new Set(prev);
        next.delete(id);
        return next;
      }
      if (prev.size >= 3) {
        setMaxCompareMessage(true);
        return prev;
      }
      setMaxCompareMessage(false);
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };
  const compareArray = Array.from(compareIds);
  const compareHref = compareArray.length >= 2
    ? `${ROUTES.vegaFinancial.compare}?compare=${compareArray.join(",")}`
    : null;

  const activeFiltersList = useMemo(() => {
    const a: { key: string; label: string }[] = [];
    if (tag) a.push({ key: "tag", label: `Style: ${tag}` });
    if (asset) a.push({ key: "asset", label: `Asset: ${asset}` });
    if (risk) a.push({ key: "risk", label: `Risk: ${risk}` });
    return a;
  }, [tag, asset, risk]);

  const filtersApplied = activeFiltersList.length;
  const sortLabel = sort === "newest" ? "newest" : SORT_OPTIONS.find((o) => o.value === sort)?.label ?? sort;

  const COLLECTIONS = [
    { label: "Low risk", href: `${ROUTES.vegaFinancial.marketplace}?risk=Low`, desc: "Strategies with lower volatility." },
    { label: "Momentum", href: `${ROUTES.vegaFinancial.marketplace}?tag=Momentum`, desc: "Trend-following style." },
    { label: "Mean Reversion", href: `${ROUTES.vegaFinancial.marketplace}?tag=Mean%20Reversion`, desc: "May help balance your portfolio." },
    { label: "Equity", href: `${ROUTES.vegaFinancial.marketplace}?asset=Equity`, desc: "Equity-focused strategies." },
    { label: "All strategies", href: ROUTES.vegaFinancial.marketplace, desc: "Browse everything." },
  ];

  return (
    <div className="vega-demo flex flex-col lg:flex-row gap-6 min-w-0">
      {/* Desktop: left sticky filter rail 280px */}
      <div className="hidden lg:block shrink-0">
        <MarketplaceFilterRail />
      </div>

      {/* Right: content column */}
      <div className="min-w-0 flex-1 space-y-6 lg:space-y-8">
        {/* 1. Search / sort toolbar — stack on mobile, full-width sort */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between min-w-0" data-tour="mp-filters">
          <div className="relative min-w-0 w-full max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none" aria-hidden />
            <Input
              type="search"
              placeholder="Search strategies…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 pl-9 w-full max-w-full"
              aria-label="Search strategies"
            />
          </div>
          <div className="flex items-center gap-2 shrink-0 max-sm:w-full max-sm:min-w-0">
            <span className="text-sm text-muted-foreground whitespace-nowrap shrink-0">Sort by</span>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="h-9 w-[180px] max-sm:flex-1 max-sm:min-w-0 shrink-0">
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

        {/* Help row: links to Learn */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <Link href={`${ROUTES.vegaFinancial.learn}#compare-strategies`} className="hover:text-foreground focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring rounded">
            How to compare strategies
          </Link>
          <Link href={`${ROUTES.vegaFinancial.learn}#drawdown`} className="hover:text-foreground focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring rounded">
            What drawdown means
          </Link>
          <Link href={`${ROUTES.vegaFinancial.learn}#correlation`} className="hover:text-foreground focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring rounded">
            Why correlation matters
          </Link>
        </div>

        {/* 2. Mobile: one chip row + More filters */}
        <div className="flex flex-wrap items-center gap-2 lg:hidden">
          <Link
            href={ROUTES.vegaFinancial.marketplace}
            className={cn(
              "vf-chip-motion inline-flex items-center justify-center rounded-lg border px-3 py-2 text-sm min-h-[44px]",
              !tag && !asset && !risk
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-foreground hover:border-primary/25 hover:bg-accent/50"
            )}
          >
            All
          </Link>
          {["Momentum", "Trend Following", "Mean Reversion"].map((t) => {
            const isActive = tag === t;
            const chipParams: Record<string, string> = {};
            if (!isActive) chipParams.tag = t;
            if (asset) chipParams.asset = asset;
            if (risk) chipParams.risk = risk;
            const chipQs = Object.keys(chipParams).length ? new URLSearchParams(chipParams).toString() : "";
            const chipHref = chipQs ? `${ROUTES.vegaFinancial.marketplace}?${chipQs}` : ROUTES.vegaFinancial.marketplace;
            return (
              <Link
                key={t}
                href={chipHref}
                className={cn(
                  "vf-chip-motion inline-flex items-center justify-center rounded-lg border px-3 py-2 text-sm min-h-[44px]",
                  isActive
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground hover:border-primary/25 hover:bg-accent/50"
                )}
              >
                {t}
              </Link>
            );
          })}
          <MarketplaceFiltersSheet open={filtersSheetOpen} onOpenChange={setFiltersSheetOpen} />
        </div>

        {/* 3. Active filters row */}
        {activeFiltersList.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground mr-1">Active:</span>
            {activeFiltersList.map(({ label }) => (
              <span
                key={label}
                className="inline-flex items-center rounded-md border border-primary bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
              >
                {label}
              </span>
            ))}
            <Link
              href={sort && sort !== "newest" ? `${ROUTES.vegaFinancial.marketplace}?sort=${sort}` : ROUTES.vegaFinancial.marketplace}
              className="text-xs font-medium text-muted-foreground hover:text-foreground focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring rounded"
            >
              Clear all
            </Link>
          </div>
        )}

        {/* Summary: count, sort, filters applied — no mid-word break on "strategies" */}
        <p className="text-sm text-muted-foreground" aria-live="polite">
          <span className="tabular-nums whitespace-nowrap">{filtered.length} strategies</span>
          {sortLabel && (
            <>
              {" · "}
              <span className="whitespace-nowrap">sorted by {sortLabel}</span>
            </>
          )}
          {filtersApplied > 0 && (
            <>
              {" · "}
              <span className="whitespace-nowrap">{filtersApplied} filter{filtersApplied !== 1 ? "s" : ""} applied</span>
            </>
          )}
        </p>

        {/* Helper when comparison is enabled */}
        {compareArray.length >= 1 && (
          <p className="text-xs vf-text-muted">
            Select 2 to 3 strategies to compare.
          </p>
        )}

        {/* 4. Category shortcuts — cards/pills with equal spacing */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 vf-enter-stagger vf-stagger-visible min-w-0">
          {COLLECTIONS.map((c) => (
            <Link
              key={c.label}
              href={c.href}
              className={cn(
                "vf-chip-motion rounded-xl border vf-border-soft vf-surface-2 px-4 py-4 text-left flex flex-col gap-1 min-h-[44px] min-w-0",
                "hover:border-primary/40 hover:shadow-md hover:vf-surface-2 transition-all duration-[var(--motion-duration-normal)]",
                "focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring"
              )}
            >
              <span className="font-medium text-foreground inline-flex items-center gap-2">
                {c.label}
                <ArrowRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
              </span>
              <span className="vf-text-muted text-sm">{c.desc}</span>
            </Link>
          ))}
        </div>

        {/* 5. Strategy grid */}
        {filtered.length === 0 ? (
          <div className="rounded-xl border vf-border-soft vf-surface-1 py-16 px-8 text-center max-w-2xl mx-auto">
            <p className="vf-text-muted mb-4">
              {algorithms.length === 0
                ? "No strategies yet. Run the database seed to populate the marketplace."
                : "No strategies match your filters."}
            </p>
            {algorithms.length > 0 && (
              <p className="text-sm vf-text-muted">
                Try adjusting filters or search to see more results.
              </p>
            )}
          </div>
        ) : (
          <>
            <div className={cn(
              "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6 min-w-0",
              compareArray.length >= 1 && "max-lg:pb-36 lg:pb-0"
            )}>
              {filtered.map((v, i) => (
                <div key={v.id} className="vf-reveal" style={{ animationDelay: `${Math.min(i * 50, 300)}ms` }}>
                  <StrategyCard
                    algorithm={v}
                    onCompareToggle={toggleCompare}
                    compareSelected={compareIds.has(v.id)}
                    compareDisabled={!compareIds.has(v.id) && compareIds.size >= 3}
                    dataTour={v.id === "demo-1" ? "mp-card-alpha" : undefined}
                  />
                </div>
              ))}
            </div>

            {/* 7. Compare bar: sticky bottom mobile (above bottom nav), sticky inline desktop */}
            {compareArray.length >= 1 && (
              <div
                className={cn(
                  "flex flex-col gap-2 rounded-xl border vf-border-soft vf-surface-1 p-4 shadow-lg z-20",
                  "lg:sticky lg:top-24",
                  "fixed left-4 right-4 lg:static lg:left-auto lg:right-auto lg:bottom-auto",
                  "max-lg:bottom-[calc(3.5rem+env(safe-area-inset-bottom,0px))] max-lg:safe-area-pb"
                )}
                role="region"
                aria-live="polite"
                aria-label="Compare selection"
              >
                <p className="text-xs vf-text-muted">
                  Select 2 to 3 strategies to compare.
                </p>
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <span className="text-sm font-medium text-foreground" aria-live="polite">
                    {compareArray.length} {compareArray.length === 1 ? "strategy" : "strategies"} selected
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => { setCompareIds(new Set()); setMaxCompareMessage(false); }}
                      className="text-sm font-medium vf-text-muted hover:text-foreground focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring rounded min-h-[44px] px-3 inline-flex items-center"
                    >
                      Clear all
                    </button>
                    {compareArray.length >= 2 ? (
                      <Link
                        href={compareHref ?? "#"}
                        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover transition-colors duration-150 min-h-[44px] min-w-[44px] inline-flex items-center justify-center"
                      >
                        Compare strategies
                      </Link>
                    ) : (
                      <span
                        className="rounded-lg bg-muted px-4 py-2 text-sm font-medium text-muted-foreground min-h-[44px] min-w-[44px] inline-flex items-center justify-center cursor-not-allowed"
                        aria-disabled
                      >
                        Compare strategies
                      </span>
                    )}
                  </div>
                </div>
                {maxCompareMessage && (
                  <p className="text-sm text-foreground" role="alert">
                    You can compare up to 3 strategies.
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
