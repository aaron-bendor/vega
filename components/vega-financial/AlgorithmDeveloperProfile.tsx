"use client";

import Link from "next/link";
import { ChevronRight, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AlgorithmDeveloperProfileProps {
  /** Developer slug for the link (e.g. acar-gok). From getDeveloperByAlgorithmId(id).slug */
  developerSlug: string;
  /** Developer display name */
  developerName: string;
  /** Short role / background line */
  role: string;
  /** Show verified badge */
  verified: boolean;
  /** Algorithm id (for breadcrumb on developer page). */
  algorithmId?: string;
  /** Algorithm display name (for breadcrumb on developer page). */
  algorithmName?: string;
}

/**
 * Compact clickable developer card for the algorithm detail page.
 * Renders directly under the algorithm name and links to the dedicated developer profile page.
 * Breadcrumb on developer page: Strategies > [Algorithm Name] > [Developer Name].
 */
export function AlgorithmDeveloperProfile({
  developerSlug,
  developerName,
  role,
  verified,
  algorithmId,
  algorithmName,
}: AlgorithmDeveloperProfileProps) {
  const base = `/vega-financial/developers/${developerSlug}`;
  const params = new URLSearchParams();
  if (algorithmId) params.set("from", algorithmId);
  if (algorithmName) params.set("fromName", algorithmName);
  const href = params.toString() ? `${base}?${params.toString()}` : base;

  return (
    <Link
      href={href}
      className={cn(
        "algorithm-developer-summary flex items-center gap-3 w-full text-left rounded-lg border border-border bg-white dark:bg-card p-3 sm:p-3.5",
        "hover:border-muted-foreground/30 hover:bg-muted/30",
        "focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "transition-colors duration-[var(--motion-duration-fast)]"
      )}
    >
      <div
        className="size-10 shrink-0 rounded-full bg-muted border border-border flex items-center justify-center text-muted-foreground text-sm font-medium"
        aria-hidden
      >
        {developerName.charAt(0)}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="font-medium text-foreground text-sm">{developerName}</span>
          {verified && (
            <span className="inline-flex items-center gap-0.5 text-xs text-muted-foreground">
              <ShieldCheck className="size-3.5 text-primary" aria-hidden />
              Verified
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{role}</p>
        <p className="text-xs text-muted-foreground/80 mt-1">View developer profile</p>
      </div>
      <ChevronRight className="size-4 text-muted-foreground shrink-0" aria-hidden />
    </Link>
  );
}
