"use client";

import { useState, useEffect, type ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ALLOCATION_FORM_ID_EXPORT } from "./MobileStickyAllocationBar";

export const METRICS_HELP_ID = "overview-metrics-help";

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
    developer: ReactNode;
    methodology: ReactNode;
  };
  /** Optional mobile sticky CTA bar (e.g. "Add to portfolio" that scrolls to form) */
  mobileStickyBar?: ReactNode;
}

export function AlgorithmDetailLayout({
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
      {/* 1. Hero: two columns on desktop, stack on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr,340px] gap-6 lg:gap-8 mb-6">
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

      {/* 3. Tabs: directly below strip, reduced margin, light background */}
      <Tabs value={tab} onValueChange={setTab} className="min-w-0">
        <div className="rounded-lg bg-muted/30 border border-border p-1 mb-4 overflow-x-auto">
          <TabsList className="flex h-auto gap-0.5 w-full sm:w-auto bg-transparent border-0 p-0 rounded-none shadow-none min-w-0">
            <TabsTrigger
              value="overview"
              className="text-sm rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm min-h-[44px] sm:min-h-[36px] px-3 shrink-0"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="performance"
              className="text-sm rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm min-h-[44px] sm:min-h-[36px] px-3 shrink-0"
            >
              Performance
            </TabsTrigger>
            <TabsTrigger
              value="risk"
              className="text-sm rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm min-h-[44px] sm:min-h-[36px] px-3 shrink-0"
            >
              Risk
            </TabsTrigger>
            <TabsTrigger
              value="developer"
              className="text-sm rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm min-h-[44px] sm:min-h-[36px] px-3 shrink-0"
            >
              Developer
            </TabsTrigger>
            <TabsTrigger
              value="how-it-works"
              className="text-sm rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm min-h-[44px] sm:min-h-[36px] px-3 shrink-0"
            >
              How it works
            </TabsTrigger>
            <TabsTrigger
              value="advanced"
              className="text-sm rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm min-h-[44px] sm:min-h-[36px] px-3 shrink-0"
            >
              Advanced
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
          <TabsContent value="developer" className="mt-0 focus-visible:outline-none">
            {tabPanels.developer}
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
