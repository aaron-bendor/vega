"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlgorithmCard } from "./AlgorithmCard";
import type { InvestableAttributes } from "@/lib/vega-financial/types";

export interface AlgorithmForCard {
  id: string;
  name: string;
  shortDesc: string;
  tags: string[];
  riskLevel: string;
  riskScore?: number;
  var95MonthlyPct?: number;
  standardised?: boolean;
  attributes?: InvestableAttributes;
  verified?: boolean;
  return?: number;
  volatility?: number;
  maxDrawdown?: number;
  sparklineData?: number[];
  thesis?: string;
  bestFor?: string;
  mayNotSuit?: string;
  statusBadgeText?: string;
  cardFooterMicrocopy?: string;
}

interface AlgorithmCategoryTabsProps {
  algorithms: AlgorithmForCard[];
  trending?: AlgorithmForCard[];
  lowRisk?: AlgorithmForCard[];
  verified?: AlgorithmForCard[];
  newAlgorithms?: AlgorithmForCard[];
  forYou?: AlgorithmForCard[];
}

export function AlgorithmCategoryTabs({
  algorithms,
  trending = [],
  lowRisk = [],
  verified = [],
  newAlgorithms = [],
  forYou = [],
}: AlgorithmCategoryTabsProps) {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "trending";
  const risk = searchParams.get("risk");
  const verifiedOnly = searchParams.get("verified") === "true";
  const minTrackRecord = searchParams.get("minTrackRecord");
  const maxCorrelation = searchParams.get("maxCorrelation");
  const minRiskStability = searchParams.get("minRiskStability");
  const minRiskAdjustment = searchParams.get("minRiskAdjustment");

  const filterList = (list: AlgorithmForCard[]) => {
    let out = list;
    if (risk) out = out.filter((a) => a.riskLevel === risk);
    if (verifiedOnly) out = out.filter((a) => a.verified);
    if (minTrackRecord) {
      const min = Number(minTrackRecord);
      if (!Number.isNaN(min))
        out = out.filter((a) => (a.attributes?.experience ?? 0) >= min);
    }
    if (maxCorrelation) {
      const max = Number(maxCorrelation);
      if (!Number.isNaN(max))
        out = out.filter((a) => (a.attributes?.marketCorrelation ?? 100) <= max);
    }
    if (minRiskStability) {
      const min = Number(minRiskStability);
      if (!Number.isNaN(min))
        out = out.filter((a) => (a.attributes?.riskStability ?? 0) >= min);
    }
    if (minRiskAdjustment) {
      const min = Number(minRiskAdjustment);
      if (!Number.isNaN(min))
        out = out.filter((a) => (a.attributes?.riskAdjustment ?? 0) >= min);
    }
    return out;
  };

  const trendingList = filterList(trending.length ? trending : algorithms);
  const lowRiskList = filterList(lowRisk.length ? lowRisk : algorithms.filter((a) => a.riskLevel === "Low"));
  const verifiedList = filterList(verified.length ? verified : algorithms.filter((a) => a.verified));
  const newList = filterList(newAlgorithms.length ? newAlgorithms : [...algorithms].reverse());
  const forYouList = filterList(forYou.length ? forYou : algorithms);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const renderGrid = (items: AlgorithmForCard[]) => (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 min-w-0">
      {items.map((algo) => (
        <AlgorithmCard
          key={algo.id}
          id={algo.id}
          name={algo.name}
          shortDesc={algo.shortDesc}
          tags={algo.tags}
          riskLevel={algo.riskLevel}
          riskScore={algo.riskScore}
          var95MonthlyPct={algo.var95MonthlyPct}
          standardised={algo.standardised}
          verified={algo.verified}
          return={algo.return}
          volatility={algo.volatility}
          maxDrawdown={algo.maxDrawdown}
          sparklineData={algo.sparklineData}
          thesis={algo.thesis}
          bestFor={algo.bestFor}
          mayNotSuit={algo.mayNotSuit}
          statusBadgeText={algo.statusBadgeText}
          cardFooterMicrocopy={algo.cardFooterMicrocopy}
          expandedId={expandedId}
          onExpand={setExpandedId}
        />
      ))}
    </div>
  );

  const router = useRouter();
  const setTab = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", value);
    router.push(`/vega-financial?${params.toString()}`, { scroll: false });
  };

  const tabClass =
    "min-h-[44px] min-w-[44px] shrink-0 px-3 py-2 text-xs sm:text-sm rounded-lg";

  return (
    <Tabs value={tab} onValueChange={setTab} className="w-full min-w-0">
      <TabsList className="mb-4 rounded-xl border border-border bg-muted/30 p-1 w-full overflow-x-auto overflow-y-hidden flex flex-nowrap justify-start gap-0 min-h-[44px]">
        <TabsTrigger value="trending" className={tabClass}>
          Trending
        </TabsTrigger>
        <TabsTrigger value="low-risk" className={tabClass}>
          Low risk
        </TabsTrigger>
        <TabsTrigger value="verified" className={tabClass}>
          Verified
        </TabsTrigger>
        <TabsTrigger value="new" className={tabClass}>
          New
        </TabsTrigger>
        <TabsTrigger value="for-you" className={tabClass}>
          For you
        </TabsTrigger>
      </TabsList>
      <div className="text-xs text-muted-foreground mb-3 min-w-0">
        {tab === "trending" && `${trendingList.length} algorithm${trendingList.length !== 1 ? "s" : ""}`}
        {tab === "low-risk" && `${lowRiskList.length} algorithm${lowRiskList.length !== 1 ? "s" : ""}`}
        {tab === "verified" && `${verifiedList.length} algorithm${verifiedList.length !== 1 ? "s" : ""}`}
        {tab === "new" && `${newList.length} algorithm${newList.length !== 1 ? "s" : ""}`}
        {tab === "for-you" && `${forYouList.length} algorithm${forYouList.length !== 1 ? "s" : ""}`}
      </div>
      <TabsContent value="trending" className="transition-opacity duration-200">
        {renderGrid(trendingList)}
      </TabsContent>
      <TabsContent value="low-risk" className="transition-opacity duration-200">
        {renderGrid(lowRiskList)}
      </TabsContent>
      <TabsContent value="verified" className="transition-opacity duration-200">
        {renderGrid(verifiedList)}
      </TabsContent>
      <TabsContent value="new" className="transition-opacity duration-200">
        {renderGrid(newList)}
      </TabsContent>
      <TabsContent value="for-you" className="transition-opacity duration-200">
        {renderGrid(forYouList)}
      </TabsContent>
    </Tabs>
  );
}

