"use client";

import { cn } from "@/lib/utils";

interface DemoChromeIndicatorProps {
  className?: string;
  /** When true, show compact single line (e.g. bottom nav). */
  compact?: boolean;
}

/**
 * Persistent demo indicator for app chrome so users never lose context
 * that they are in a paper-trading demo.
 */
export function DemoChromeIndicator({ className, compact }: DemoChromeIndicatorProps) {
  if (compact) {
    return (
      <span
        className={cn(
          "text-[10px] font-medium text-muted-foreground uppercase tracking-wider",
          className
        )}
        aria-label="Demo mode, paper trading only"
      >
        Demo
      </span>
    );
  }
  return (
    <div
      className={cn(
        "flex flex-col gap-0.5 text-[11px] text-muted-foreground",
        className
      )}
      role="status"
      aria-label="Demo mode, paper trading only"
    >
      <span className="font-medium">Demo mode</span>
      <span>Paper trading only</span>
    </div>
  );
}
