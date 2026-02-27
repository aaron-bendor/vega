"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";

export function FilterChips() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const risk = searchParams.get("risk");
  const verified = searchParams.get("verified") === "true";
  const sort = searchParams.get("sort");
  const tab = searchParams.get("tab");
  const minTrackRecord = searchParams.get("minTrackRecord");
  const maxCorrelation = searchParams.get("maxCorrelation");
  const minRiskStability = searchParams.get("minRiskStability");
  const minRiskAdjustment = searchParams.get("minRiskAdjustment");

  const hasFilters =
    risk ||
    verified ||
    sort ||
    tab ||
    minTrackRecord ||
    maxCorrelation ||
    minRiskStability ||
    minRiskAdjustment;

  const clearAll = () => {
    const params = new URLSearchParams(searchParams.toString());
    ["risk", "verified", "sort", "tab", "minTrackRecord", "maxCorrelation", "minRiskStability", "minRiskAdjustment"].forEach(
      (k) => params.delete(k)
    );
    router.push(`/vega-financial?${params.toString()}`);
  };

  const remove = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    router.push(`/vega-financial?${params.toString()}`);
  };

  if (!hasFilters) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {risk && (
        <span className="inline-flex items-center gap-1 rounded-md border border-[rgba(51,51,51,0.18)] bg-[rgba(51,51,51,0.04)] px-2 py-0.5 text-xs text-foreground">
          Risk: {risk}
          <button
            type="button"
            onClick={() => remove("risk")}
            className="rounded hover:bg-[rgba(51,51,51,0.08)] p-0.5"
            aria-label="Remove risk filter"
          >
            <X className="size-3" />
          </button>
        </span>
      )}
      {verified && (
        <span className="inline-flex items-center gap-1 rounded-md border border-[rgba(51,51,51,0.18)] bg-[rgba(51,51,51,0.04)] px-2 py-0.5 text-xs text-foreground">
          Verified only
          <button
            type="button"
            onClick={() => remove("verified")}
            className="rounded hover:bg-[rgba(51,51,51,0.08)] p-0.5"
            aria-label="Remove verified filter"
          >
            <X className="size-3" />
          </button>
        </span>
      )}
      {sort && (
        <span className="inline-flex items-center gap-1 rounded-md border border-[rgba(51,51,51,0.18)] bg-[rgba(51,51,51,0.04)] px-2 py-0.5 text-xs text-foreground">
          Sort: {sort}
          <button
            type="button"
            onClick={() => remove("sort")}
            className="rounded hover:bg-[rgba(51,51,51,0.08)] p-0.5"
            aria-label="Remove sort"
          >
            <X className="size-3" />
          </button>
        </span>
      )}
      {hasFilters && (
        <button
          type="button"
          onClick={clearAll}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          Clear all
        </button>
      )}
    </div>
  );
}
