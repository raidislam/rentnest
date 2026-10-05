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

// Query filters for GET /api/properties
export const propertyQuerySchema = z
  .object({
    location: z.string().trim().min(1).optional(),
    minPrice: z.coerce.number().min(0, "minPrice must be 0 or more").optional(),
    maxPrice: z.coerce.number().min(0, "maxPrice must be 0 or more").optional(),
    propertyType: z.string().trim().min(1).optional(),
    amenity: z.string().trim().min(1).optional(),
  })
  .refine(
    (data) =>
      data.minPrice === undefined ||
      data.maxPrice === undefined ||
      data.minPrice <= data.maxPrice,
    {
      message: "minPrice cannot be greater than maxPrice",
      path: ["minPrice"],
    },
  );
