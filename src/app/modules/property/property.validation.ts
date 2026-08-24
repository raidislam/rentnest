import { z } from "zod";

export const createPropertySchema = z.object({
  title: z.string().min(2, "Title is required"),
  description: z.string().min(10, "Description is required"),
  location: z.string().min(2, "Location is required"),
  price: z.number().positive("Price must be greater than 0"),
  propertyType: z.string().min(2, "Property type is required"),
  amenities: z.array(z.string()).min(1, "At least one amenity is required"),
  categoryId: z.string().uuid("Invalid category ID"),
});

export const updatePropertySchema = z.object({
  title: z.string().min(2).optional(),
  description: z.string().min(10).optional(),
  location: z.string().min(2).optional(),
  price: z.number().positive().optional(),
  propertyType: z.string().min(2).optional(),
  amenities: z.array(z.string()).optional(),
  categoryId: z.string().uuid().optional(),
  availability: z.boolean().optional(),
});