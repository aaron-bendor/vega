"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCallback, useMemo } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const ASSET_OPTIONS = ["Equity", "Multi-Asset", "Commodities"];
const RISK_OPTIONS = ["Low", "Medium", "High"];

interface MarketplaceFilterRailProps {
  tagOptions: string[];
}

function FilterGroup({
  label,
  options,
  currentValue,
  paramKey,
  basePath,
}: {
  label: string;
  options: { value: "" | string; label: string }[];
  currentValue: string;
  paramKey: string;
  basePath: string;
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      <ul className="space-y-0.5">
        {options.map(({ value, label: optLabel }) => {
          const href = value ? `${basePath}?${paramKey}=${encodeURIComponent(value)}` : basePath;
          const isActive = currentValue === value || (value === "" && !currentValue);
          return (
            <li key={value || "all"}>
              <Link
                href={href}
                className={cn(
                  "block rounded-md px-2.5 py-1.5 text-sm transition-colors duration-150",
                  "focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                  isActive
                    ? "bg-primary/12 font-medium text-primary"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
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

export function MarketplaceFilterRail({ tagOptions }: MarketplaceFilterRailProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tag = searchParams.get("tag") ?? "";
  const risk = searchParams.get("risk") ?? "";
  const basePath = "/vega-financial/marketplace";

  const setParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      router.push(`${basePath}?${params.toString()}`);
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
    router.push(basePath);
  }, [router]);

  const categories = tagOptions.length > 0 ? tagOptions : ["Momentum", "Trend Following", "Mean Reversion", "Quant", "Multi-Asset", "Commodities"];
  const styleOptions = [{ value: "", label: "All" }, ...categories.map((c) => ({ value: c, label: c }))];
  const assetOptions = [{ value: "", label: "All" }, ...ASSET_OPTIONS.map((a) => ({ value: a, label: a }))];
  const riskOptions = [{ value: "", label: "All" }, ...RISK_OPTIONS.map((r) => ({ value: r, label: r }))];

  return (
    <aside
      className="sticky top-6 flex w-52 flex-shrink-0 flex-col gap-6 border-r border-border pr-6"
      aria-label="Filter strategies"
    >
      <h3 className="font-maven-pro text-sm font-semibold text-foreground">Filters</h3>

      <div className="space-y-6">
        <FilterGroup label="Strategy style" options={styleOptions} currentValue={tag} paramKey="tag" basePath={basePath} />
        <FilterGroup label="Asset" options={assetOptions} currentValue={tag} paramKey="tag" basePath={basePath} />
        <FilterGroup label="Risk level" options={riskOptions} currentValue={risk} paramKey="risk" basePath={basePath} />
      </div>

      {activeFilters.length > 0 && (
        <div className="space-y-2 border-t border-border pt-4">
          <p className="text-xs font-medium text-muted-foreground">Active</p>
          <div className="flex flex-wrap gap-1.5">
            {activeFilters.map(({ key, label }) => (
              <span
                key={key}
                className="inline-flex items-center gap-1 rounded-md border border-primary/25 bg-primary/10 px-2 py-1 text-xs text-foreground"
              >
                {label}
                <button
                  type="button"
                  onClick={() => setParam(key, null)}
                  className="rounded p-0.5 hover:bg-primary/20 focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label={`Remove ${label}`}
                >
                  <X className="size-3" />
                </button>
              </span>
            ))}
            <button
              type="button"
              onClick={clearAll}
              className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors duration-150 focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring rounded px-1"
            >
              Clear all
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
