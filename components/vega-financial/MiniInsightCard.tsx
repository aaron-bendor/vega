"use client";

import { cn } from "@/lib/utils";

interface MiniInsightCardProps {
  title: string;
  body: string;
  className?: string;
}

/**
 * Compact card for "Why consider this" row: title + short body.
 */
export function MiniInsightCard({ title, body, className }: MiniInsightCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-card p-3 min-w-0",
        className
      )}
    >
      <p className="text-xs font-medium text-foreground mb-0.5">{title}</p>
      <p className="text-[11px] text-muted-foreground leading-snug">{body}</p>
    </div>
  );
}
