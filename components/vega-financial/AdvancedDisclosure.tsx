"use client";

import { type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdvancedDisclosureProps {
  summary: string;
  children: ReactNode;
  className?: string;
}

/**
 * Collapsible section for technical/advanced content. Keeps primary screens simple
 * while giving power users access to deeper metrics and settings.
 */
export function AdvancedDisclosure({ summary, children, className }: AdvancedDisclosureProps) {
  return (
    <details
      className={cn(
        "rounded-xl border border-border bg-muted/30 overflow-hidden group",
        className
      )}
    >
      <summary className="font-maven-pro flex cursor-pointer list-none items-center justify-between gap-2 px-4 py-3 text-sm font-medium text-foreground hover:bg-muted/50 focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset [&::-webkit-details-marker]:hidden">
        <span>{summary}</span>
        <ChevronDown
          className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180"
          aria-hidden
        />
      </summary>
      <div className="border-t border-border px-4 pb-4 pt-3 text-sm text-muted-foreground">
        {children}
      </div>
    </details>
  );
}
