"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
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
      router.push(`/marketplace?${params.toString()}`);
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
    router.push("/marketplace");
  }, [router]);

  const categories = tagOptions.length > 0 ? tagOptions : CATEGORY_OPTIONS;

  return (
    <div className="space-y-4" data-tour="mp-filters">
      {/* Search + Sort row */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" aria-hidden />
          <Input
            type="search"
            placeholder="Search algorithms"
            value={search}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="pl-9 h-9"
            aria-label="Search algorithms"
          />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-sm text-muted-foreground whitespace-nowrap">Sort</span>
          <Select
            value={sort}
            onValueChange={(v) => {
              setSort(v);
              setParam("sort", v);
            }}
          >
            <SelectTrigger className="w-[180px] h-9">
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

      {/* Grouped filters (collapsible on small screens) */}
      <details className="rounded-lg border border-[rgba(51,51,51,0.12)] bg-muted/30 overflow-hidden group" open>
        <summary className="flex items-center justify-between px-4 py-3 cursor-pointer list-none font-medium focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring rounded-lg [&::-webkit-details-marker]:hidden">
          Filters
          <ChevronDown className="size-4 shrink-0 transition-transform group-open:rotate-180" aria-hidden />
        </summary>
        <div className="px-4 pb-4 grid gap-4 sm:grid-cols-3 border-t border-[rgba(51,51,51,0.08)]">
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Category</p>
            <SlidingChipRow
              chips={[
                { href: "/marketplace", label: "All" },
                ...categories.map((name) => ({
                  href: `/marketplace?tag=${encodeURIComponent(name)}`,
                  label: name,
                })),
              ]}
              activeHref={tag ? `/marketplace?tag=${encodeURIComponent(tag)}` : "/marketplace"}
            />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Asset</p>
            <SlidingChipRow
              chips={ASSET_OPTIONS.map((name) => ({
                href: `/marketplace?tag=${encodeURIComponent(name)}`,
                label: name,
              }))}
              activeHref={tag ? `/marketplace?tag=${encodeURIComponent(tag)}` : "/marketplace"}
            />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Risk</p>
            <SlidingChipRow
              chips={[
                { href: "/marketplace", label: "All" },
                ...RISK_OPTIONS.map((r) => ({
                  href: `/marketplace?risk=${encodeURIComponent(r)}`,
                  label: r,
                })),
              ]}
              activeHref={risk ? `/marketplace?risk=${encodeURIComponent(risk)}` : "/marketplace"}
            />
          </div>
        </div>
      </details>

      {/* Active filters + result count */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {activeFilters.length > 0 && (
            <>
              {activeFilters.map(({ key, label }) => (
                <span
                  key={key}
                  className="inline-flex items-center gap-1 rounded-md border border-[rgba(51,51,51,0.18)] bg-muted/50 px-2 py-1 text-xs"
                >
                  {label}
                  <button
                    type="button"
                    onClick={() => setParam(key, null)}
                    className="rounded p-0.5 hover:bg-muted focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label={`Remove ${label}`}
                  >
                    <X className="size-3" />
                  </button>
                </span>
              ))}
              <button
                type="button"
                onClick={clearAll}
                className="text-xs text-muted-foreground hover:text-foreground font-medium focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring rounded"
              >
                Clear all
              </button>
            </>
          )}
        </div>
        <p className="text-sm text-muted-foreground tabular-nums">
          Showing {resultCount} of {totalCount}
        </p>
      </div>
    </div>
  );
}

