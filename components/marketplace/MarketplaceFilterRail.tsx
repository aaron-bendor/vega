"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCallback, useMemo } from "react";
import { X } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

const RISK_OPTIONS = ["Low", "Medium", "High"] as const;
const STRATEGY_STYLE_OPTIONS = ["Momentum", "Trend Following", "Mean Reversion", "Quant"] as const;
const ASSET_OPTIONS = ["Equity", "Multi-Asset", "Commodities"] as const;
const BASE_PATH = "/vega-financial/marketplace";

function FilterGroup({
  label,
  options,
  currentValue,
  getHref,
}: {
  label: string;
  options: { value: "" | string; label: string }[];
  currentValue: string;
  getHref: (value: string) => string;
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      <ul className="space-y-0.5">
        {options.map(({ value, label: optLabel }) => {
          const href = getHref(value);
          const isActive = currentValue === value || (value === "" && !currentValue);
          return (
            <li key={value || "all"}>
              <Link
                href={href}
                className={cn(
                  "vf-chip-motion block rounded-md px-2.5 py-1.5 text-sm min-h-[44px] flex items-center",
                  "focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                  isActive
                    ? "bg-primary border border-primary font-medium text-primary-foreground"
                    : "border border-transparent bg-card text-foreground hover:bg-accent/50 hover:border-border"
                )}
              >
                {optLabel}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

interface MarketplaceFilterContentProps {
  tag: string;
  asset: string;
  risk: string;
  onClearAll: () => void;
  onRemoveFilter: (key: string) => void;
  activeFilters: { key: string; label: string }[];
  getHref: (params: { tag?: string; asset?: string; risk?: string }) => string;
}

export function MarketplaceFilterContent({
  tag,
  asset,
  risk,
  onClearAll,
  onRemoveFilter,
  activeFilters,
  getHref,
}: MarketplaceFilterContentProps) {
  const styleOptions = [{ value: "", label: "All" }, ...STRATEGY_STYLE_OPTIONS.map((c) => ({ value: c, label: c }))];
  const assetOptions = [{ value: "", label: "All" }, ...ASSET_OPTIONS.map((a) => ({ value: a, label: a }))];
  const riskOptions = [{ value: "", label: "All" }, ...RISK_OPTIONS.map((r) => ({ value: r, label: r }))];

  return (
    <div className="space-y-6">
      <FilterGroup
        label="Strategy style"
        options={styleOptions}
        currentValue={tag}
        getHref={(v) => getHref({ tag: v || undefined, asset: asset || undefined, risk: risk || undefined })}
      />
      <FilterGroup
        label="Asset"
        options={assetOptions}
        currentValue={asset}
        getHref={(v) => getHref({ tag: tag || undefined, asset: v || undefined, risk: risk || undefined })}
      />
      <FilterGroup
        label="Risk level"
        options={riskOptions}
        currentValue={risk}
        getHref={(v) => getHref({ tag: tag || undefined, asset: asset || undefined, risk: v || undefined })}
      />
      {activeFilters.length > 0 && (
        <div className="space-y-2 border-t border-border pt-4">
          <p className="text-xs font-medium text-muted-foreground">Active</p>
          <div className="flex flex-wrap gap-1.5">
            {activeFilters.map(({ key, label }) => (
              <span
                key={key}
                className="inline-flex items-center gap-1 rounded-md border border-primary bg-primary px-2 py-1 text-xs text-primary-foreground"
              >
                {label}
                <button
                  type="button"
                  onClick={() => onRemoveFilter(key)}
                  className="rounded p-0.5 hover:bg-primary/20 focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label={`Remove ${label}`}
                >
                  <X className="size-3" />
                </button>
              </span>
            ))}
            <button
              type="button"
              onClick={onClearAll}
              className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors duration-150 focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring rounded px-1"
            >
              Clear all
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function buildMarketplaceHref(params: { tag?: string; asset?: string; risk?: string }): string {
  const p = new URLSearchParams();
  if (params.tag) p.set("tag", params.tag);
  if (params.asset) p.set("asset", params.asset);
  if (params.risk) p.set("risk", params.risk);
  const q = p.toString();
  return q ? `${BASE_PATH}?${q}` : BASE_PATH;
}

interface MarketplaceFilterRailProps {
  tagOptions?: string[];
}

export function MarketplaceFilterRail(_opts?: MarketplaceFilterRailProps) {
  void _opts; // kept for API compatibility; filter options are fixed (style/asset/risk)
  const router = useRouter();
  const searchParams = useSearchParams();
  const tag = searchParams.get("tag") ?? "";
  const asset = searchParams.get("asset") ?? "";
  const risk = searchParams.get("risk") ?? "";

  const getHref = useCallback(
    (params: { tag?: string; asset?: string; risk?: string }) => buildMarketplaceHref(params),
    []
  );

  const setParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      const q = params.toString();
      router.push(q ? `${BASE_PATH}?${q}` : BASE_PATH);
    },
    [router, searchParams]
  );

  const activeFilters = useMemo(() => {
    const a: { key: string; label: string }[] = [];
    if (tag) a.push({ key: "tag", label: tag });
    if (asset) a.push({ key: "asset", label: asset });
    if (risk) a.push({ key: "risk", label: `Risk: ${risk}` });
    return a;
  }, [tag, asset, risk]);

  const clearAll = useCallback(() => {
    router.push(BASE_PATH);
  }, [router]);

  return (
    <aside
      className="sticky top-6 flex w-[280px] flex-shrink-0 flex-col gap-6 border-r border-border pr-6"
      aria-label="Filter strategies"
      data-tour="mp-filters"
    >
      <h3 className="font-maven-pro text-sm font-semibold text-foreground">Filters</h3>
      <MarketplaceFilterContent
        tag={tag}
        asset={asset}
        risk={risk}
        activeFilters={activeFilters}
        onClearAll={clearAll}
        onRemoveFilter={(key) => setParam(key, null)}
        getHref={getHref}
      />
    </aside>
  );
}

interface MarketplaceFiltersSheetProps {
  tagOptions?: string[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MarketplaceFiltersSheet({ open, onOpenChange }: MarketplaceFiltersSheetProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tag = searchParams.get("tag") ?? "";
  const asset = searchParams.get("asset") ?? "";
  const risk = searchParams.get("risk") ?? "";

  const getHref = useCallback(
    (params: { tag?: string; asset?: string; risk?: string }) => buildMarketplaceHref(params),
    []
  );

  const setParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      const q = params.toString();
      router.push(q ? `${BASE_PATH}?${q}` : BASE_PATH);
      onOpenChange(false);
    },
    [router, searchParams, onOpenChange]
  );

  const activeFilters = useMemo(() => {
    const a: { key: string; label: string }[] = [];
    if (tag) a.push({ key: "tag", label: tag });
    if (asset) a.push({ key: "asset", label: asset });
    if (risk) a.push({ key: "risk", label: `Risk: ${risk}` });
    return a;
  }, [tag, asset, risk]);

  const clearAll = useCallback(() => {
    router.push(BASE_PATH);
    onOpenChange(false);
  }, [router, onOpenChange]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="vf-chip-motion min-h-[44px] gap-2 border-border bg-card hover:bg-accent/50"
          aria-label="Open filters"
        >
          <SlidersHorizontal className="size-4" aria-hidden />
          More filters
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="rounded-t-2xl max-h-[85vh] overflow-auto">
        <SheetTitle className="sr-only">Filter strategies</SheetTitle>
        <div className="pt-4 pb-8">
          <h3 className="font-maven-pro text-sm font-semibold text-foreground mb-4">Filters</h3>
          <MarketplaceFilterContent
            tag={tag}
            asset={asset}
            risk={risk}
            activeFilters={activeFilters}
            onClearAll={clearAll}
            onRemoveFilter={(key) => setParam(key, null)}
            getHref={getHref}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
