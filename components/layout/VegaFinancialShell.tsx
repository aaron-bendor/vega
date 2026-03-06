"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const BANNER_TEXT =
  "University prototype. Synthetic data. Paper trading only. Not investment advice.";

export function VegaFinancialShell({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled((window.scrollY ?? 0) > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header
        className={cn(
          "sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md transition-[height,border-color,background-color,box-shadow] duration-motion-slow ease-motion",
          scrolled
            ? "h-12 border-[rgba(51,51,51,0.12)] shadow-[0_1px_0_0_rgba(51,51,51,0.06)]"
            : "h-14 border-[rgba(51,51,51,0.12)]"
        )}
      >
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="font-semibold text-lg text-foreground hover:text-foreground/90 transition-colors duration-motion-fast ease-motion flex items-center gap-1"
            >
              Vega Financial
            </Link>
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-0.5 transition-colors duration-motion-fast ease-motion focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
              aria-label="Back to Vega home"
            >
              <ChevronLeft className="size-3.5 shrink-0" aria-hidden />
              Back to Vega
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-[rgba(51,51,51,0.12)] py-2 text-center text-xs text-muted-foreground">
        {BANNER_TEXT}
      </footer>
    </div>
  );
}
