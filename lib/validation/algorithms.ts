import { z } from "zod";

export const createAlgorithmSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  tags: z.array(z.string()).optional(),
  riskLevel: z.enum(["Low", "Medium", "High"]).optional(),
  universe: z.string().max(500).optional(),
});

export const updateAlgorithmSchema = createAlgorithmSchema.partial();
