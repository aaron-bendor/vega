"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface EmptyStateCardProps {
  icon?: ReactNode;
  headline: string;
  description: string;
  primaryAction?: ReactNode;
  secondaryAction?: ReactNode;
  /** Optional preview row (e.g. 2 suggested strategy cards) */
  preview?: ReactNode;
  className?: string;
}

/**
 * Designed empty state for sparse pages. No single block floating in empty space.
 */
export function EmptyStateCard({
  icon,
  headline,
  description,
  primaryAction,
  secondaryAction,
  preview,
  className,
}: EmptyStateCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card overflow-hidden p-6 sm:p-8 lg:p-10 text-center vf-reveal vf-reveal-delay-0",
        className
      )}
    >
      {icon && (
        <div
          className="size-14 rounded-full bg-muted border border-border flex items-center justify-center mx-auto mb-4 text-primary/60"
          aria-hidden
        >
          {icon}
        </div>
      )}
      <h2 className="font-maven-pro text-lg sm:text-xl font-semibold text-foreground mb-2">
        {headline}
      </h2>
      <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-6">
        {description}
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
        {primaryAction}
        {secondaryAction}
      </div>
      {preview && (
        <div className="border-t border-border pt-6 text-left">
          {preview}
        </div>
      )}
    </div>
  );
}
