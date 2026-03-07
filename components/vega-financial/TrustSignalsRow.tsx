"use client";

import { cn } from "@/lib/utils";

interface TrustSignalsRowProps {
  items: string[];
  className?: string;
}

/**
 * Narrow trust strip: Reviewed before publication, Simulated portfolio use, etc.
 */
export function TrustSignalsRow({ items, className }: TrustSignalsRowProps) {
  if (!items.length) return null;
  return (
    <div
      className={cn(
        "flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground",
        className
      )}
      role="list"
      aria-label="Trust and transparency"
    >
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5" role="listitem">
          <span className="size-1 rounded-full bg-brand-green/60 shrink-0" aria-hidden />
          {item}
        </span>
      ))}
    </div>
  );
}
