"use client";

import Link from "next/link";

export function DashboardIntro() {
  return (
    <section className="min-w-0 mb-8" aria-labelledby="dashboard-intro-title">
      <div className="rounded-2xl border border-primary/20 bg-primary/[0.03] px-4 py-5 sm:px-6 sm:py-6">
        <h2
          id="dashboard-intro-title"
          className="font-syne text-lg sm:text-xl font-semibold text-foreground mb-2"
        >
          Explore systematic strategies with paper money
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl mb-4">
          Browse rule-based strategies, compare how they behave, and build a paper portfolio before
          taking any real-world investing decisions elsewhere. All performance shown here is
          simulated and for product demonstration only.
        </p>
        <Link
          href="/vega-financial/marketplace"
          className="inline-flex items-center text-sm font-medium text-primary hover:underline focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
        >
          Browse marketplace
        </Link>
      </div>
    </section>
  );
}
