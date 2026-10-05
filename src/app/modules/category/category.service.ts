import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";

export const getCategories = async () => {
  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return categories;
};

export const createCategory = async (data: {
  name: string;
  description?: string;
}) => {
  const existingCategory = await prisma.category.findFirst({
    where: {
      name: {
        equals: data.name,
        mode: "insensitive",
      },
    },
  });

  if (existingCategory) {
    throw new AppError(409, "Category with this name already exists");
  }

  const category = await prisma.category.create({
    data: {
      name: data.name,
      description: data.description,
    },
  });

  return category;
};

export const updateCategory = async (
  id: string,
  data: {
    name?: string;
    description?: string;
  },
) => {
  const category = await prisma.category.findUnique({
    where: {
      id,
    },
  });

  if (!category) {
    throw new AppError(404, "Category not found");
  }

  if (data.name) {
    const sameNameCategory = await prisma.category.findFirst({
      where: {
        name: {
          equals: data.name,
          mode: "insensitive",
        },
        NOT: {
          id,
        },
      },
    });

    if (sameNameCategory) {
      throw new AppError(409, "Category with this name already exists");
    }
  }

  const updatedCategory = await prisma.category.update({
    where: {
      id,
    },
    data,
  });

  return updatedCategory;
};

export const deleteCategory = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: {
      id,
    },
  });

  if (!category) {
    throw new AppError(404, "Category not found");
  }

  const propertyCount = await prisma.property.count({
    where: {
      categoryId: id,
    },
  });

  if (propertyCount > 0) {
    throw new AppError(
      409,
      "This category still has properties. Move or delete those properties first.",
    );
  }

  const deletedCategory = await prisma.category.delete({
    where: {
      id,
    },
  });

  return deletedCategory;
};
