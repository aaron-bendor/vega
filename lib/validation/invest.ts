import { z } from "zod";

export const investSchema = z.object({
  versionId: z.string().min(1),
  amount: z.number().positive(),
  userId: z.string().optional(),
});
