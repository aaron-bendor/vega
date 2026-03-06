/**
 * File-backed demo loader. Used when DB is unavailable.
 */

import * as fs from "fs";
import * as path from "path";
import type { InvestableAttributes } from "@/lib/vega-financial/types";

export interface DemoAlgorithm {
  id: string;
  name: string;
  shortDesc: string;
  description?: string;
  tags: string[];
  riskLevel: string;
  templateId: string;
  defaultParams: Record<string, number>;
  dataSource?: "stooq" | "synthetic";
  symbols?: string[];
  startDate?: string;
  endDate?: string;
  category?: string;
  verified?: boolean;
  minInvestment?: number;
  inceptionDate?: string;
  /** 1–10 risk score (eToro-style). */
  riskScore?: number;
  /** 95% monthly VaR as decimal (e.g. 0.05 = 5%). */
  var95MonthlyPct?: number;
  /** True if wrapped by vol-target/risk overlay (Darwinex investable asset). */
  standardised?: boolean;
  /** Platform attribute layer for filtering and comparison. */
  attributes?: InvestableAttributes;
  /** Developer id for follow/feed. */
  developerId?: string;
  /** One-line thesis for cards. */
  thesis?: string;
  /** Best for (short). */
  bestFor?: string;
  /** May not suit (short). */
  mayNotSuit?: string;
  /** Status badge text (e.g. "Simulated • Medium risk • Equity momentum"). */
  statusBadgeText?: string;
  /** Card footer microcopy / regime note. */
  cardFooterMicrocopy?: string;
}

export interface DemoDeveloper {
  id: string;
  displayName: string;
  shortBio?: string;
  verified?: boolean;
  joinedDate?: string;
  algorithmCount?: number;
}

export interface DemoRun {
  metrics: {
    cumulativeReturn?: number;
    sharpeRatio?: number;
    maxDrawdown?: number;
    annualisedVolatility?: number;
  };
  equityPoints: { dayIndex: number; value: number }[];
}

let cached: DemoAlgorithm[] | null = null;

export function loadDemoAlgorithms(): DemoAlgorithm[] {
  if (cached) return cached;
  try {
    const file = path.join(process.cwd(), "data", "demo", "algorithms.json");
    const raw = fs.readFileSync(file, "utf8");
    cached = JSON.parse(raw) as DemoAlgorithm[];
    return cached ?? [];
  } catch {
    return [];
  }
}

export function loadDemoRun(demoId: string): DemoRun | null {
  try {
    const file = path.join(process.cwd(), "data", "demo", "runs", `${demoId}.json`);
    const raw = fs.readFileSync(file, "utf8");
    return JSON.parse(raw) as DemoRun;
  } catch {
    return null;
  }
}

let cachedDevs: DemoDeveloper[] | null = null;

export function loadDemoDevelopers(): DemoDeveloper[] {
  if (cachedDevs) return cachedDevs;
  try {
    const file = path.join(process.cwd(), "data", "demo", "developers.json");
    const raw = fs.readFileSync(file, "utf8");
    cachedDevs = JSON.parse(raw) as DemoDeveloper[];
    return cachedDevs ?? [];
  } catch {
    return [];
  }
}
