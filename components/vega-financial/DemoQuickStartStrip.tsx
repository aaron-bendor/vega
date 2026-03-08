"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { DEMO_QUICK_START } from "@/lib/vega-financial/investor-copy";

export function DemoQuickStartStrip() {
  return (
    <section
      className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4"
      aria-label="What you can do here"
    >
      {DEMO_QUICK_START.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="rounded-xl border border-border bg-card p-4 flex flex-col gap-1.5 hover:border-muted-foreground/25 hover:bg-muted/10 transition-colors duration-200 focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring min-h-[44px] sm:min-h-0"
        >
          <span className="font-medium text-foreground">{item.title}</span>
          <span className="text-sm text-muted-foreground">{item.description}</span>
          <span className="text-xs text-primary font-medium mt-1 flex items-center gap-0.5">
            Go <ChevronRight className="size-3.5" aria-hidden />
          </span>
        </Link>
      ))}
    </section>
  );
}
