import { z } from "zod";

export const createRentalRequestSchema = z.object({
  propertyId: z.string().uuid("Invalid property ID"),
  message: z.string().optional(),
});

export const updateRentalRequestSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
});