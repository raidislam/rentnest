import { prisma } from "../../lib/prisma";

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
  const category = await prisma.category.update({
    where: {
      id,
    },
    data,
  });

  return category;
};

export const deleteCategory = async (id: string) => {
  const category = await prisma.category.delete({
    where: {
      id,
    },
  });

  return category;
};