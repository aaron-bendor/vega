"use client";

import { useState, useEffect, type ReactNode } from "react";
import Link from "next/link";
import { Tabs, TabsContent, TabsListWithIndicator, TabsTrigger } from "@/components/ui/tabs";
import { ALLOCATION_FORM_ID_EXPORT } from "./MobileStickyAllocationBar";
import { Breadcrumb, type BreadcrumbItem } from "./Breadcrumb";
import { ChevronLeft } from "lucide-react";

export const METRICS_HELP_ID = "overview-metrics-help";

export type { BreadcrumbItem };

export function useAlgorithmDetailHowToRead(setTab: (v: string) => void) {
  useEffect(() => {
    const handler = () => {
      setTab("overview");
      requestAnimationFrame(() => {
        document.getElementById(METRICS_HELP_ID)?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    };
    window.addEventListener("algo-detail-how-to-read", handler);
    return () => window.removeEventListener("algo-detail-how-to-read", handler);
  }, [setTab]);
}

export interface AlgorithmDetailLayoutProps {
  /** Optional breadcrumb e.g. [{ label: "Strategies", href: "/vega-financial/marketplace" }, { label: "Strategy name" }] */
  breadcrumb?: BreadcrumbItem[];
  /** Left hero block: strategy summary, trust, why consider */
  heroLeft: ReactNode;
  /** Right hero block: allocation summary card (sticky on desktop) */
  heroRight: ReactNode;
  /** Metric strip below hero (5 cards) */
  metricStrip?: ReactNode;
  /** Tab content panels */
  tabPanels: {
    overview: ReactNode;
    performance: ReactNode;
    risk: ReactNode;
    portfolioFit: ReactNode;
    methodology: ReactNode;
  };
  /** Optional mobile sticky CTA bar (e.g. "Add to portfolio" that scrolls to form) */
  mobileStickyBar?: ReactNode;
}

export function AlgorithmDetailLayout({
  breadcrumb,
  heroLeft,
  heroRight,
  metricStrip,
  tabPanels,
  mobileStickyBar,
}: AlgorithmDetailLayoutProps) {
  const [tab, setTab] = useState<string>("overview");
  useAlgorithmDetailHowToRead(setTab);

  const tabTriggerClass =
    "font-maven-pro text-sm font-medium rounded-lg min-h-[44px] sm:min-h-[44px] px-4 shrink-0 transition-[background-color,border-color,color] duration-200 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary hover:bg-accent/50";

  return (
    <div className="vega-demo max-w-[1280px] mx-auto px-4 py-6 sm:px-6 lg:px-8 pb-24 lg:pb-10">
      <Link
        href="/vega-financial/marketplace"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring rounded min-h-[44px] min-w-[44px] sm:min-w-0 sm:min-h-0 sm:inline-flex"
      >
        <ChevronLeft className="size-4" aria-hidden />
        Back to strategies
      </Link>
      {breadcrumb && breadcrumb.length > 0 && (
        <Breadcrumb items={breadcrumb} />
      )}
      {/* Row 1: Hero 7+5 cols, more breathing room */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] gap-6 lg:gap-8 mb-10 lg:mb-12">
        <div className="vf-glass-hero vf-glass-violet vf-section-shift rounded-xl px-6 py-6 xl:px-8 xl:py-8 min-h-[260px] flex flex-col justify-center min-w-0">
          {heroLeft}
        </div>
        <div id={ALLOCATION_FORM_ID_EXPORT} className="lg:sticky lg:top-24 lg:min-w-0 scroll-mt-28 self-start">
          {heroRight}
        </div>
      </div>

      {/* Row 2: Metric strip (stagger on first paint handled by StrategyMetricStrip if needed) */}
      {metricStrip && (
        <section className="mb-10 lg:mb-12 scroll-mt-28" aria-label="Key metrics" id="overview-metrics">
          {metricStrip}
        </section>
      )}

      {/* Row 3: Tabs — sticky, blurred bar, sliding underline */}
      <Tabs value={tab} onValueChange={setTab} className="min-w-0">
        <div className="sticky top-0 z-10 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 py-3 bg-background/90 backdrop-blur-md border-b border-border mb-5 rounded-b-lg transition-shadow duration-[var(--motion-duration-normal)]">
          <div className="max-w-[1100px] mx-auto">
            <TabsListWithIndicator className="flex h-auto gap-1 w-full sm:w-auto bg-transparent border-0 p-0 rounded-none shadow-none min-w-0">
              <TabsTrigger value="overview" className={tabTriggerClass} id="tab-overview">
                Overview
              </TabsTrigger>
              <TabsTrigger value="performance" className={tabTriggerClass} id="tab-performance">
                Performance
              </TabsTrigger>
              <TabsTrigger value="risk" className={tabTriggerClass} id="tab-risk">
                Risk
              </TabsTrigger>
              <TabsTrigger value="portfolio-fit" className={tabTriggerClass} id="tab-portfolio-fit">
                Portfolio fit
              </TabsTrigger>
              <TabsTrigger value="methodology" className={tabTriggerClass} id="tab-methodology">
                Methodology
              </TabsTrigger>
            </TabsListWithIndicator>
          </div>
        </div>
        <div className="min-w-0 scroll-mt-24">
          <TabsContent value="overview" className="mt-0 focus-visible:outline-none vf-fade-in" id="overview">
            {tabPanels.overview}
          </TabsContent>
          <TabsContent value="performance" className="mt-0 focus-visible:outline-none vf-fade-in" id="performance">
            {tabPanels.performance}
          </TabsContent>
          <TabsContent value="risk" className="mt-0 focus-visible:outline-none vf-fade-in" id="risk">
            {tabPanels.risk}
          </TabsContent>
          <TabsContent value="portfolio-fit" className="mt-0 focus-visible:outline-none vf-fade-in" id="portfolio-fit">
            {tabPanels.portfolioFit}
          </TabsContent>
          <TabsContent value="methodology" className="mt-0 focus-visible:outline-none vf-fade-in" id="methodology">
            {tabPanels.methodology}
          </TabsContent>
        </div>
      </Tabs>

      {mobileStickyBar}
    </div>
  );
}
