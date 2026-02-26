import { z } from "zod";

export const runBacktestSchema = z.object({
  versionId: z.string().min(1).optional(),
  templateId: z.string().min(1).optional(),
  parameters: z.record(z.string(), z.union([z.number(), z.string()])).optional(),
  scenario: z.enum(["TREND", "RANGE", "CRASH", "RECOVERY"]).optional(),
  horizon: z.number().int().min(1).max(2520).optional(),
  strategyId: z.string().min(1).optional(),
  startingCapital: z.number().positive().optional().default(10000),
  preview: z.boolean().optional().default(false),
  // Stooq / real-data options
  dataSource: z.enum(["stooq", "synthetic"]).optional().default("stooq"),
  symbols: z.array(z.string()).optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});
