import { NextFunction, Request, Response } from "express";
import {createCategory,deleteCategory,getCategories,updateCategory} from "./category.service";
export const getAllCategories = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const categories = await getCategories();

    res.status(200).json({
      success: true,
      message: "Categories retrieved successfully",
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

export const createNewCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const category = await createCategory(req.body);

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

export const updateExistingCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const category = await updateCategory(
      req.params.id as string,
      req.body,
    );

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteExistingCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const category = await deleteCategory(
      req.params.id as string,
    );

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};