"use client";

import { cn } from "@/lib/utils";

interface RisksToKnowCardProps {
  title?: string;
  items: string[];
  className?: string;
}

export function RisksToKnowCard({
  title = "Risks to know",
  items,
  className,
}: RisksToKnowCardProps) {
  if (!items.length) return null;
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-4",
        className
      )}
    >
      <h3 className="text-sm font-semibold text-foreground mb-2">{title}</h3>
      <ul className="space-y-1.5 text-sm text-muted-foreground">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2">
            <span className="text-destructive/80 shrink-0">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
