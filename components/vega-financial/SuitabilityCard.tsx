"use client";

import { cn } from "@/lib/utils";

interface SuitabilityCardProps {
  text: string;
  className?: string;
}

export function SuitabilityCard({ text, className }: SuitabilityCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-muted/20 p-4",
        className
      )}
    >
      <p className="text-sm text-muted-foreground leading-snug">
        <span className="font-medium text-foreground">Who it may suit: </span>
        {text}
      </p>
    </div>
  );
}
