"use client";

import Link from "next/link";
import { ChevronRight, ShieldCheck } from "lucide-react";
import { getDeveloperProfileBySlug, DEFAULT_DEMO_DEVELOPER_SLUG } from "@/lib/demo/developer-profile-data";
import { cn } from "@/lib/utils";

const developer = getDeveloperProfileBySlug(DEFAULT_DEMO_DEVELOPER_SLUG);

interface AlgorithmDeveloperProfileProps {
  /** Algorithm id when shown on an algorithm detail page (for breadcrumb on developer page). */
  algorithmId?: string;
  /** Algorithm display name when shown on an algorithm detail page (for breadcrumb on developer page). */
  algorithmName?: string;
}

/**
 * Compact clickable developer card for the algorithm detail page.
 * Renders directly under the algorithm name and links to the dedicated developer profile page.
 * Pass algorithmId and algorithmName so the developer page breadcrumb shows: Strategies > [Algorithm] > [Developer].
 */
export function AlgorithmDeveloperProfile({ algorithmId, algorithmName }: AlgorithmDeveloperProfileProps = {}) {
  if (!developer) return null;

  const base = `/vega-financial/developers/${developer.slug}`;
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
        {developer.name.charAt(0)}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="font-medium text-foreground text-sm">{developer.name}</span>
          {developer.verified && (
            <span className="inline-flex items-center gap-0.5 text-xs text-muted-foreground">
              <ShieldCheck className="size-3.5 text-primary" aria-hidden />
              Verified
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{developer.role}</p>
        <p className="text-xs text-muted-foreground/80 mt-1">View developer profile</p>
      </div>
      <ChevronRight className="size-4 text-muted-foreground shrink-0" aria-hidden />
    </Link>
  );
}
