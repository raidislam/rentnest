import { NextFunction, Request, Response } from "express";

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
  next: NextFunction,
) => {
  try {
    const users = await getAllUsers();

    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserStatusController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedData = updateUserStatusSchema.parse(
      req.body,
    );

    const user = await updateUserStatus(
      req.user!.userId,
      req.params.id as string,
      validatedData.status,
    );

    res.status(200).json({
      success: true,
      message: "User status updated successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};



export const getAllPropertiesController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const properties = await getAllProperties();

    res.status(200).json({
      success: true,
      message: "Properties retrieved successfully",
      data: properties,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllRentalsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const rentals = await getAllRentals();

    res.status(200).json({
      success: true,
      message: "Rental requests retrieved successfully",
      data: rentals,
    });
  } catch (error) {
    next(error);
  }
};