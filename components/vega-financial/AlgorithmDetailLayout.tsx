"use client";

import { useState, useEffect, type ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ALLOCATION_FORM_ID_EXPORT } from "./MobileStickyAllocationBar";
import { Breadcrumb, type BreadcrumbItem } from "./Breadcrumb";

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
  /** Optional breadcrumb e.g. [{ label: "Explore", href: "/vega-financial/marketplace" }, { label: "Strategy name" }] */
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

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8 pb-24 lg:pb-10">
      {breadcrumb && breadcrumb.length > 0 && (
        <Breadcrumb items={breadcrumb} />
      )}
      {/* 1. Hero: two columns on desktop, stack on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr,340px] gap-8 lg:gap-10 mb-8">
        <div className="min-w-0">{heroLeft}</div>
        <div id={ALLOCATION_FORM_ID_EXPORT} className="lg:min-w-0 scroll-mt-24">
          {heroRight}
        </div>
      </div>

      {/* 2. Metric strip */}
      {metricStrip && (
        <section className="mb-6" aria-label="Key metrics">
          {metricStrip}
        </section>
      )}

      {/* 3. Tabs: Overview, Performance, Risk, Portfolio fit, Methodology */}
      <Tabs value={tab} onValueChange={setTab} className="min-w-0">
        <div className="rounded-lg bg-muted/30 border border-border p-1.5 mb-6 overflow-x-auto">
          <TabsList className="flex h-auto gap-1 w-full sm:w-auto bg-transparent border-0 p-0 rounded-none shadow-none min-w-0">
            <TabsTrigger
              value="overview"
              className="font-maven-pro text-sm font-medium rounded-md data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm min-h-[44px] sm:min-h-[38px] px-4 shrink-0 transition-colors duration-200 hover:bg-background/70"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="performance"
              className="font-maven-pro text-sm font-medium rounded-md data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm min-h-[44px] sm:min-h-[38px] px-4 shrink-0 transition-colors duration-200 hover:bg-background/70"
            >
              Performance
            </TabsTrigger>
            <TabsTrigger
              value="risk"
              className="font-maven-pro text-sm font-medium rounded-md data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm min-h-[44px] sm:min-h-[38px] px-4 shrink-0 transition-colors duration-200 hover:bg-background/70"
            >
              Risk
            </TabsTrigger>
            <TabsTrigger
              value="portfolio-fit"
              className="font-maven-pro text-sm font-medium rounded-md data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm min-h-[44px] sm:min-h-[38px] px-4 shrink-0 transition-colors duration-200 hover:bg-background/70"
            >
              Portfolio fit
            </TabsTrigger>
            <TabsTrigger
              value="methodology"
              className="font-maven-pro text-sm font-medium rounded-md data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm min-h-[44px] sm:min-h-[38px] px-4 shrink-0 transition-colors duration-200 hover:bg-background/70"
            >
              Methodology
            </TabsTrigger>
          </TabsList>
        </div>
        <div className="min-w-0">
          <TabsContent value="overview" className="mt-0 focus-visible:outline-none">
            {tabPanels.overview}
          </TabsContent>
          <TabsContent value="performance" className="mt-0 focus-visible:outline-none">
            {tabPanels.performance}
          </TabsContent>
          <TabsContent value="risk" className="mt-0 focus-visible:outline-none">
            {tabPanels.risk}
          </TabsContent>
          <TabsContent value="portfolio-fit" className="mt-0 focus-visible:outline-none">
            {tabPanels.portfolioFit}
          </TabsContent>
          <TabsContent value="methodology" className="mt-0 focus-visible:outline-none">
            {tabPanels.methodology}
          </TabsContent>
        </div>
      </Tabs>

      {mobileStickyBar}
    </div>
  );
}
