import { z } from "zod";

export const updateUserStatusSchema = z.object({
  status: z.boolean(),
});