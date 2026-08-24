import { prisma } from "../../lib/prisma";

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
    throw new Error("Category not found");
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

export const getAllProperties = async () => {
  const properties = await prisma.property.findMany({
    where: {
      availability: true,
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
    throw new Error("Property not found");
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
    throw new Error("Property not found");
  }

  if (property.landlordId !== landlordId) {
    throw new Error("You can only update your own property");
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
    throw new Error("Property not found");
  }

  if (property.landlordId !== landlordId) {
    throw new Error("You can only delete your own property");
  }

  await prisma.property.delete({
    where: {
      id: propertyId,
    },
  });
};