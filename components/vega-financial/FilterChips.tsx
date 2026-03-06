"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { X } from "lucide-react";

export function FilterChips() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const base = pathname?.startsWith("/vega-financial/marketplace") ? "/vega-financial/marketplace" : "/vega-financial";
  const risk = searchParams.get("risk");
  const verified = searchParams.get("verified") === "true";
  const sort = searchParams.get("sort");
  const tab = searchParams.get("tab");
  const tag = searchParams.get("tag");
  const minTrackRecord = searchParams.get("minTrackRecord");
  const maxCorrelation = searchParams.get("maxCorrelation");
  const minRiskStability = searchParams.get("minRiskStability");
  const minRiskAdjustment = searchParams.get("minRiskAdjustment");

  const hasFilters =
    risk ||
    verified ||
    sort ||
    tab ||
    tag ||
    minTrackRecord ||
    maxCorrelation ||
    minRiskStability ||
    minRiskAdjustment;

  const clearAll = () => {
    const params = new URLSearchParams(searchParams.toString());
    ["risk", "verified", "sort", "tab", "tag", "minTrackRecord", "maxCorrelation", "minRiskStability", "minRiskAdjustment"].forEach(
      (k) => params.delete(k)
    );
    const q = params.toString();
    router.push(q ? `${base}?${q}` : base);
  };

  const remove = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    const q = params.toString();
    router.push(q ? `${base}?${q}` : base);
  };

  if (!hasFilters) return null;

  const chipClass =
    "inline-flex items-center gap-1 rounded-md border border-primary/25 bg-primary/10 px-2.5 py-1 text-xs text-foreground transition-[background-color,border-color,box-shadow] duration-[200ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/20";

  const removeBtnClass =
    "rounded min-w-[44px] min-h-[44px] flex items-center justify-center -m-1 transition-colors duration-150 hover:bg-primary/20 focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1";

  return (
    <div className="flex flex-wrap items-center gap-2 min-w-0">
      {risk && (
        <span className={chipClass}>
          Risk: {risk}
          <button
            type="button"
            onClick={() => remove("risk")}
            className={removeBtnClass}
            aria-label="Remove risk filter"
          >
            <X className="size-3" />
          </button>
        </span>
      )}
      {verified && (
        <span className={chipClass}>
          Verified only
          <button
            type="button"
            onClick={() => remove("verified")}
            className={removeBtnClass}
            aria-label="Remove verified filter"
          >
            <X className="size-3" />
          </button>
        </span>
      )}
      {sort && (
        <span className={chipClass}>
          Sort: {sort}
          <button
            type="button"
            onClick={() => remove("sort")}
            className={removeBtnClass}
            aria-label="Remove sort"
          >
            <X className="size-3" />
          </button>
        </span>
      )}
      {tag && (
        <span className={chipClass}>
          Tag: {tag}
          <button
            type="button"
            onClick={() => remove("tag")}
            className={removeBtnClass}
            aria-label="Remove tag filter"
          >
            <X className="size-3" />
          </button>
        </span>
      )}
      {hasFilters && (
        <button
          type="button"
          onClick={clearAll}
          className="text-xs text-muted-foreground hover:text-foreground font-medium transition-colors duration-150 focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 rounded min-h-[44px] flex items-center px-2"
        >
          Clear all
        </button>
      )}
    </div>
  );
}
