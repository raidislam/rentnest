import { Request, Response } from "express";
import {createCategory,deleteCategory,getCategories,updateCategory} from "./category.service";
export const getAllCategories = async (
  req: Request,
  res: Response,
) => {
  try {
    const categories = await getCategories();

    res.status(200).json({
      success: true,
      message: "Categories retrieved successfully",
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve categories",
      errorDetails: error,
    });
  }
};

export const createNewCategory = async ( req: Request, res: Response) => {
  try {
    const category = await createCategory(req.body);

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create category",
      errorDetails: error,
    });
  }
};

export const updateExistingCategory = async ( req: Request,res: Response) => {
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
    res.status(500).json({
      success: false,
      message: "Failed to update category",
      errorDetails: error,
    });
  }
};

export const deleteExistingCategory = async (
  req: Request,
  res: Response,
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
    res.status(500).json({
      success: false,
      message: "Failed to delete category",
      errorDetails: error,
    });
  }
};