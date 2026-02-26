/**
 * Strategy template registry.
 * No user code execution. Long-only exposures in [0, 1].
 */

import { z } from "zod";

export interface TemplateDef {
  id: string;
  name: string;
  description: string;
  paramSchema: z.ZodObject<Record<string, z.ZodType>>;
  defaultParams: Record<string, number>;
  riskLabel: "Low" | "Medium" | "High";
  tags: string[];
}

export const TEMPLATES: TemplateDef[] = [
  {
    id: "buy_and_hold",
    name: "Buy and hold",
    description: "Always fully invested.",
    paramSchema: z.object({}),
    defaultParams: {},
    riskLabel: "Medium",
    tags: ["equity", "passive"],
  },
  {
    id: "ma_crossover",
    name: "MA crossover",
    description: "Fast/slow moving average crossover.",
    paramSchema: z.object({
      fastWindow: z.number().int().min(2).max(100).default(10),
      slowWindow: z.number().int().min(2).max(200).default(30),
    }),
    defaultParams: { fastWindow: 10, slowWindow: 30 },
    riskLabel: "Medium",
    tags: ["momentum", "trend"],
  },
  {
    id: "bollinger_reversion",
    name: "Bollinger reversion",
    description: "Mean reversion at Bollinger bands.",
    paramSchema: z.object({
      window: z.number().int().min(5).max(100).default(20),
      k: z.number().min(1).max(3).default(2),
    }),
    defaultParams: { window: 20, k: 2 },
    riskLabel: "Medium",
    tags: ["mean-reversion", "volatility"],
  },
  {
    id: "rsi_momentum",
    name: "RSI momentum",
    description: "RSI oversold/overbought signals.",
    paramSchema: z.object({
      window: z.number().int().min(5).max(50).default(14),
      entry: z.number().min(0).max(50).default(30),
      exit: z.number().min(50).max(100).default(70),
    }),
    defaultParams: { window: 14, entry: 30, exit: 70 },
    riskLabel: "High",
    tags: ["momentum", "mean-reversion"],
  },
  {
    id: "vol_target_overlay",
    name: "Vol target overlay",
    description: "Scale position by volatility target. Wraps another strategy.",
    paramSchema: z.object({
      targetVol: z.number().min(0.05).max(0.5).default(0.15),
      maxLeverage: z.number().min(0.5).max(2).default(1),
      innerTemplate: z.string().default("buy_and_hold"),
    }),
    defaultParams: { targetVol: 0.15, maxLeverage: 1 },
    riskLabel: "Low",
    tags: ["risk-management", "volatility"],
  },
];

export function getTemplate(id: string): TemplateDef | undefined {
  return TEMPLATES.find((t) => t.id === id);
}

export function clampExposure(x: number): number {
  return Math.max(0, Math.min(1, x));
}
