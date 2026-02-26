"use client";

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
  const trendingList = trending.length ? trending : algorithms;
  const lowRiskList = lowRisk.length ? lowRisk : algorithms.filter((a) => a.riskLevel === "Low");
  const verifiedList = verified.length ? verified : algorithms.filter((a) => a.verified);
  const newList = newAlgorithms.length ? newAlgorithms : [...algorithms].reverse();
  const forYouList = forYou.length ? forYou : algorithms;

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

  return (
    <Tabs defaultValue="trending" className="w-full">
      <TabsList className="mb-4 bg-muted/50">
        <TabsTrigger value="trending">Trending</TabsTrigger>
        <TabsTrigger value="low-risk">Low risk</TabsTrigger>
        <TabsTrigger value="verified">Verified</TabsTrigger>
        <TabsTrigger value="new">New</TabsTrigger>
        <TabsTrigger value="for-you">For you</TabsTrigger>
      </TabsList>
      <TabsContent value="trending">{renderGrid(trendingList)}</TabsContent>
      <TabsContent value="low-risk">{renderGrid(lowRiskList)}</TabsContent>
      <TabsContent value="verified">{renderGrid(verifiedList)}</TabsContent>
      <TabsContent value="new">{renderGrid(newList)}</TabsContent>
      <TabsContent value="for-you">{renderGrid(forYouList)}</TabsContent>
    </Tabs>
  );
}
