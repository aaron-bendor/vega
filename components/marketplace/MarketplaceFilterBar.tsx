"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, X, ChevronDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SlidingChipRow } from "@/components/marketplace/SlidingChipRow";
import { cn } from "@/lib/utils";

const SORT_OPTIONS = [
  { value: "trending", label: "Trending" },
  { value: "newest", label: "Newest" },
  { value: "drawdown", label: "Lowest drawdown" },
  { value: "sharpe", label: "Best Sharpe" },
] as const;

const CATEGORY_OPTIONS = [
  "Momentum",
  "Trend Following",
  "Mean Reversion",
  "Quant",
  "Multi-Asset",
  "Commodities",
];

const ASSET_OPTIONS = ["Equity", "Multi-Asset", "Commodities"];

const RISK_OPTIONS = ["Low", "Medium", "High"];

interface MarketplaceFilterBarProps {
  tagOptions: string[];
  totalCount: number;
  resultCount: number;
  search?: string;
  onSearchChange?: (value: string) => void;
}

export function MarketplaceFilterBar({
  tagOptions,
  totalCount,
  resultCount,
  search = "",
  onSearchChange,
}: MarketplaceFilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sort, setSort] = useState(searchParams.get("sort") ?? "trending");
  const tag = searchParams.get("tag") ?? "";
  const risk = searchParams.get("risk") ?? "";

  const setParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      router.push(`/vega-financial/marketplace?${params.toString()}`);
    },
    [router, searchParams]
  );

  const activeFilters = useMemo(() => {
    const a: { key: string; label: string }[] = [];
    if (tag) a.push({ key: "tag", label: tag });
    if (risk) a.push({ key: "risk", label: `Risk: ${risk}` });
    return a;
  }, [tag, risk]);

  const clearAll = useCallback(() => {
    router.push("/vega-financial/marketplace");
  }, [router]);

  const categories = tagOptions.length > 0 ? tagOptions : CATEGORY_OPTIONS;

  const [filtersOpen, setFiltersOpen] = useState(true);
  const filtersContentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number | null>(null);

  useLayoutEffect(() => {
    const el = filtersContentRef.current;
    if (!el) return;
    const measure = () => setContentHeight(el.scrollHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [categories]);

  return (
    <div className="space-y-5" data-tour="mp-filters">
      {/* Search + Sort row — single aligned row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="relative flex-1 min-w-0 max-w-md w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" aria-hidden />
          <Input
            type="search"
            placeholder="Search algorithms…"
            value={search}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="pl-9 h-9 w-full"
            aria-label="Search algorithms"
          />
        </div>
        <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
          <span className="text-sm text-muted-foreground whitespace-nowrap">Sort</span>
          <Select
            value={sort}
            onValueChange={(v) => {
              setSort(v);
              setParam("sort", v);
            }}
          >
            <SelectTrigger className="w-[180px] h-9 shrink-0">
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

      {/* Category / Risk filters — single row of chips where possible; animated expand/collapse */}
      <div className="rounded-xl border border-[rgba(51,51,51,0.12)] bg-muted/30 overflow-hidden">
        <button
          type="button"
          onClick={() => setFiltersOpen((o) => !o)}
          className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-foreground focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring rounded-xl"
          aria-expanded={filtersOpen}
          aria-controls="filters-content"
          id="filters-summary"
        >
          Filters
          <ChevronDown
            className={cn("size-4 shrink-0 text-muted-foreground transition-transform duration-200 ease-out", filtersOpen && "rotate-180")}
            aria-hidden
          />
        </button>
        <div
          id="filters-content"
          ref={filtersContentRef}
          role="region"
          aria-labelledby="filters-summary"
          className="grid gap-6 sm:gap-x-8 sm:grid-cols-2 lg:grid-cols-3 border-t border-[rgba(51,51,51,0.08)] px-4 pb-4 pt-3 transition-[max-height] duration-200 ease-out overflow-hidden motion-reduce:transition-none"
          style={{ maxHeight: contentHeight != null ? (filtersOpen ? contentHeight : 0) : undefined }}
        >
          <div className="min-w-0 space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</p>
            <SlidingChipRow
              chips={[
                { href: "/vega-financial/marketplace", label: "All" },
                ...categories.map((name) => ({
                  href: `/vega-financial/marketplace?tag=${encodeURIComponent(name)}`,
                  label: name,
                })),
              ]}
              activeHref={tag ? `/vega-financial/marketplace?tag=${encodeURIComponent(tag)}` : "/vega-financial/marketplace"}
            />
          </div>
          <div className="min-w-0 space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Asset</p>
            <SlidingChipRow
              chips={ASSET_OPTIONS.map((name) => ({
                href: `/vega-financial/marketplace?tag=${encodeURIComponent(name)}`,
                label: name,
              }))}
              activeHref={tag ? `/vega-financial/marketplace?tag=${encodeURIComponent(tag)}` : "/vega-financial/marketplace"}
            />
          </div>
          <div className="min-w-0 space-y-2 sm:col-span-2 lg:col-span-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Risk</p>
            <SlidingChipRow
              chips={[
                { href: "/vega-financial/marketplace", label: "All" },
                ...RISK_OPTIONS.map((r) => ({
                  href: `/vega-financial/marketplace?risk=${encodeURIComponent(r)}`,
                  label: r,
                })),
              ]}
              activeHref={risk ? `/vega-financial/marketplace?risk=${encodeURIComponent(risk)}` : "/vega-financial/marketplace"}
            />
          </div>
        </div>
      </div>

      {/* Active filters + result count — clear alignment */}
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <div className="flex flex-wrap items-center gap-2 min-w-0">
          {activeFilters.length > 0 && (
            <>
              {activeFilters.map(({ key, label }) => (
                <span
                  key={key}
                  className="inline-flex items-center gap-1 rounded-md border border-primary/25 bg-primary/10 px-2.5 py-1 text-xs text-foreground transition-[background-color,border-color] duration-[200ms] focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/20"
                >
                  {label}
                  <button
                    type="button"
                    onClick={() => setParam(key, null)}
                    className="rounded p-0.5 transition-colors duration-150 hover:bg-primary/20 focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
                    aria-label={`Remove ${label}`}
                  >
                    <X className="size-3" />
                  </button>
                </span>
              ))}
              <button
                type="button"
                onClick={clearAll}
                className="text-xs text-muted-foreground hover:text-foreground font-medium transition-colors duration-150 focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 rounded px-1"
              >
                Clear all
              </button>
            </>
          )}
        </div>
        <p className="text-sm text-muted-foreground tabular-nums shrink-0">
          Showing {resultCount} of {totalCount}
        </p>
      </div>
    </div>
  );
}

