import { z } from "zod";

export const createReviewSchema = z.object({
  propertyId: z.string().uuid("Invalid property ID"),

  rating: z
    .number()
    .int("Rating must be a whole number")
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot be more than 5"),

  comment: z
    .string()
    .min(1, "Comment is required"),
});