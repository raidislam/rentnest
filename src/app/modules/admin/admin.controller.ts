import { Request, Response } from "express";

import {
  getAllUsers,
  updateUserStatus,
  getAllProperties,
  getAllRentals,
} from "./admin.service";

import { updateUserStatusSchema } from "./admin.validation";

export const getAllUsersController = async (
  req: Request,
  res: Response,
) => {
  try {
    const users = await getAllUsers();

    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
      errorDetails: error,
    });
  }
};

export const updateUserStatusController = async (
  req: Request,
  res: Response,
) => {
  try {
    const validatedData = updateUserStatusSchema.parse(
      req.body,
    );

    const user = await updateUserStatus(
      req.params.id,
      validatedData.status,
    );

    res.status(200).json({
      success: true,
      message: "User status updated successfully",
      data: user,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
      errorDetails: error,
    });
  }
};



export const getAllPropertiesController = async (
  req: Request,
  res: Response,
) => {
  try {
    const properties = await getAllProperties();

    res.status(200).json({
      success: true,
      message: "Properties retrieved successfully",
      data: properties,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
      errorDetails: error,
    });
  }
};

export const getAllRentalsController = async (
  req: Request,
  res: Response,
) => {
  try {
    const rentals = await getAllRentals();

    res.status(200).json({
      success: true,
      message: "Rental requests retrieved successfully",
      data: rentals,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
      errorDetails: error,
    });
  }
};