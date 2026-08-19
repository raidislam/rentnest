import { Request, Response } from "express";
import { getCategories } from "./category.service";

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