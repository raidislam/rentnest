import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";

interface CreatePropertyData {
  landlordId: string;
  title: string;
  description: string;
  location: string;
  price: number;
  propertyType: string;
  amenities: string[];
  categoryId: string;
}

export const createProperty = async (
  data: CreatePropertyData,
) => {
  const category = await prisma.category.findUnique({
    where: {
      id: data.categoryId,
    },
  });

  if (!category) {
    throw new AppError(404, "Category not found");
  }

  const property = await prisma.property.create({
    data: {
      landlordId: data.landlordId,
      categoryId: data.categoryId,
      title: data.title,
      description: data.description,
      location: data.location,
      price: data.price,
      propertyType: data.propertyType,
      amenities: data.amenities,
    },
    include: {
      category: true,
    },
  });

  return property;
};

export const getAllProperties = async (filters?: {
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  propertyType?: string;
  amenity?: string;
}) => {
  const properties = await prisma.property.findMany({
    where: {
      availability: true,

      ...(filters?.location && {
        location: {
          contains: filters.location,
          mode: "insensitive",
        },
      }),

      ...(filters?.minPrice !== undefined && {
        price: {
          gte: filters.minPrice,
        },
      }),

      ...(filters?.maxPrice !== undefined && {
        price: {
          lte: filters.maxPrice,
        },
      }),

      ...(filters?.minPrice !== undefined &&
        filters?.maxPrice !== undefined && {
          price: {
            gte: filters.minPrice,
            lte: filters.maxPrice,
          },
        }),

      ...(filters?.propertyType && {
        propertyType: {
          equals: filters.propertyType,
          mode: "insensitive",
        },
      }),

      ...(filters?.amenity && {
        amenities: {
          has: filters.amenity,
        },
      }),
    },

    include: {
      category: true,
      landlord: {
        select: {
          id: true,
          name: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return properties;
};

export const getLandlordProperties = async (landlordId: string) => {
  const properties = await prisma.property.findMany({
    where: {
      landlordId,
    },
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return properties;
};

export const getPropertyById = async (id: string) => {
  const property = await prisma.property.findUnique({
    where: {
      id,
    },
    include: {
      category: true,
      landlord: {
        select: {
          id: true,
          name: true,
        },
      },
      reviews: true,
    },
  });

  if (!property) {
    throw new AppError(404, "Property not found");
  }

  return property;
};

export const updateProperty = async (
  propertyId: string,
  landlordId: string,
  data: any,
) => {
  const property = await prisma.property.findUnique({
    where: {
      id: propertyId,
    },
  });

  if (!property) {
    throw new AppError(404, "Property not found");
  }

  if (property.landlordId !== landlordId) {
    throw new AppError(403, "You can only update your own property");
  }

  if (data.categoryId) {
    const category = await prisma.category.findUnique({
      where: {
        id: data.categoryId,
      },
    });

    if (!category) {
      throw new AppError(404, "Category not found");
    }
  }

  const updatedProperty = await prisma.property.update({
    where: {
      id: propertyId,
    },
    data,
  });

  return updatedProperty;
};

export const deleteProperty = async (
  propertyId: string,
  landlordId: string,
) => {
  const property = await prisma.property.findUnique({
    where: {
      id: propertyId,
    },
  });

  if (!property) {
    throw new AppError(404, "Property not found");
  }

  if (property.landlordId !== landlordId) {
    throw new AppError(403, "You can only delete your own property");
  }

  // A property with rental history can't be deleted (it is linked to requests/payments)
  const rentalRequestCount = await prisma.rentalRequest.count({
    where: {
      propertyId,
    },
  });

  if (rentalRequestCount > 0) {
    throw new AppError(
      409,
      "This property has rental requests and cannot be deleted. Set availability to false instead.",
    );
  }

  await prisma.property.delete({
    where: {
      id: propertyId,
    },
  });
};