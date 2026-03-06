"use client";

import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton fallback for VF pages. Delays display by 150ms to avoid flashing;
 * reserves height for metrics/charts. Reduced motion: no pulse, static placeholders.
 */
export function VegaFinancialPageSkeleton() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 150);
    return () => clearTimeout(t);
  }, []);

  if (!show) {
    return <div className="flex-1 min-h-[60vh] bg-white" aria-hidden />;
  }

  return (
    <div className="flex-1 flex flex-col bg-white min-h-0">
      <div className="border-b border-[rgba(51,51,51,0.12)] h-14 px-4 lg:px-6 flex items-center gap-3">
        <Skeleton className="h-8 flex-1 max-w-md" />
      </div>
      <div className="px-4 lg:px-6 pb-2 flex gap-2">
        <Skeleton className="h-7 w-16 rounded-md" />
        <Skeleton className="h-7 w-20 rounded-md" />
        <Skeleton className="h-7 w-14 rounded-md" />
      </div>
      <main className="flex-1 flex flex-col p-6 lg:p-8 max-w-4xl mx-auto w-full gap-6 overflow-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-64 w-full rounded-2xl" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Skeleton className="h-40 rounded-xl" />
          <Skeleton className="h-40 rounded-xl" />
        </div>
      </main>
    </div>
  );
}
