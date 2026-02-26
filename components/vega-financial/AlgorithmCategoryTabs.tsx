"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlgorithmCard } from "./AlgorithmCard";

export interface AlgorithmForCard {
  id: string;
  name: string;
  shortDesc: string;
  tags: string[];
  riskLevel: string;
  verified?: boolean;
  return?: number;
  volatility?: number;
  maxDrawdown?: number;
  sparklineData?: number[];
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

  const filterList = (list: AlgorithmForCard[]) => {
    let out = list;
    if (risk) out = out.filter((a) => a.riskLevel === risk);
    if (verifiedOnly) out = out.filter((a) => a.verified);
    return out;
  };

  const trendingList = filterList(trending.length ? trending : algorithms);
  const lowRiskList = filterList(lowRisk.length ? lowRisk : algorithms.filter((a) => a.riskLevel === "Low"));
  const verifiedList = filterList(verified.length ? verified : algorithms.filter((a) => a.verified));
  const newList = filterList(newAlgorithms.length ? newAlgorithms : [...algorithms].reverse());
  const forYouList = filterList(forYou.length ? forYou : algorithms);

  const renderGrid = (items: AlgorithmForCard[]) => (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((algo) => (
        <AlgorithmCard
          key={algo.id}
          id={algo.id}
          name={algo.name}
          shortDesc={algo.shortDesc}
          tags={algo.tags}
          riskLevel={algo.riskLevel}
          verified={algo.verified}
          return={algo.return}
          volatility={algo.volatility}
          maxDrawdown={algo.maxDrawdown}
          sparklineData={algo.sparklineData}
        />
      ))}
    </div>
  );

  const router = useRouter();
  const setTab = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", value);
    router.push(`/vega-financial?${params.toString()}`);
  };

  return (
    <Tabs value={tab} onValueChange={setTab} className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="trending">Trending</TabsTrigger>
        <TabsTrigger value="low-risk">Low risk</TabsTrigger>
        <TabsTrigger value="verified">Verified</TabsTrigger>
        <TabsTrigger value="new">New</TabsTrigger>
        <TabsTrigger value="for-you">For you</TabsTrigger>
      </TabsList>
      <div className="text-xs text-muted-foreground mb-3">
        {tab === "trending" && `${trendingList.length} algorithm${trendingList.length !== 1 ? "s" : ""}`}
        {tab === "low-risk" && `${lowRiskList.length} algorithm${lowRiskList.length !== 1 ? "s" : ""}`}
        {tab === "verified" && `${verifiedList.length} algorithm${verifiedList.length !== 1 ? "s" : ""}`}
        {tab === "new" && `${newList.length} algorithm${newList.length !== 1 ? "s" : ""}`}
        {tab === "for-you" && `${forYouList.length} algorithm${forYouList.length !== 1 ? "s" : ""}`}
      </div>
      <TabsContent value="trending">{renderGrid(trendingList)}</TabsContent>
      <TabsContent value="low-risk">{renderGrid(lowRiskList)}</TabsContent>
      <TabsContent value="verified">{renderGrid(verifiedList)}</TabsContent>
      <TabsContent value="new">{renderGrid(newList)}</TabsContent>
      <TabsContent value="for-you">{renderGrid(forYouList)}</TabsContent>
    </Tabs>
  );
}

