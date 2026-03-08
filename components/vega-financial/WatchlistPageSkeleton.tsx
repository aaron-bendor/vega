"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton for Watchlist page: header + 3 card skeletons with shimmer.
 * Prevents layout jump when content loads.
 */
export function WatchlistPageSkeleton() {
  return (
    <div className="w-full max-w-[1280px] min-w-0 mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6 lg:space-y-8">
      <header className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </header>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="rounded-xl border border-border overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex gap-2">
                <Skeleton className="h-5 w-16 rounded-md" />
                <Skeleton className="h-5 w-20 rounded-md" />
              </div>
              <Skeleton className="h-5 w-3/4 mt-2" />
              <Skeleton className="h-4 w-full mt-2" />
              <Skeleton className="h-4 w-2/3 mt-1" />
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex gap-4">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-8 w-24 mt-4 rounded-lg" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
