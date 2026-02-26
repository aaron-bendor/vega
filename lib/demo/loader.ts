/**
 * File-backed demo loader. Used when DB is unavailable.
 */

import * as fs from "fs";
import * as path from "path";

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
