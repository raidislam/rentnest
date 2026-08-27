import { Request, Response } from "express";


import {
  createRentalRequest,
  getMyRentalRequests,
  getRentalRequestById,
  getLandlordRentalRequests,
  updateRentalRequest,
} from "./rental.service";
import { createRentalRequestSchema, updateRentalRequestSchema } from "./rental.validation";

export const createRental = async (
  req: Request,
  res: Response,
) => {
  try {
    const validatedData = createRentalRequestSchema.parse(
      req.body,
    );

    const rentalRequest = await createRentalRequest({
      ...validatedData,
      tenantId: req.user!.userId,
    });

    res.status(201).json({
      success: true,
      message: "Rental request submitted successfully",
      data: rentalRequest,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
      errorDetails: error,
    });
  }
};


export const getMyRentals = async (
  req: Request,
  res: Response,
) => {
  try {
    const rentalRequests = await getMyRentalRequests(
      req.user!.userId,
    );

    res.status(200).json({
      success: true,
      message: "Rental requests retrieved successfully",
      data: rentalRequests,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
      errorDetails: error,
    });
  }
};

export const getRentalById = async (
  req: Request,
  res: Response,
) => {
  try {
    const rentalRequest = await getRentalRequestById(
      req.params.id,
      req.user!.userId,
    );

    res.status(200).json({
      success: true,
      message: "Rental request retrieved successfully",
      data: rentalRequest,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
      errorDetails: error,
    });
  }
};

export const getLandlordRentals = async (
  req: Request,
  res: Response,
) => {
  try {
    const rentalRequests = await getLandlordRentalRequests(
      req.user!.userId,
    );

    res.status(200).json({
      success: true,
      message: "Rental requests retrieved successfully",
      data: rentalRequests,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
      errorDetails: error,
    });
  }
};

export const updateRental = async (
  req: Request,
  res: Response,
) => {
  try {
    const validatedData = updateRentalRequestSchema.parse(
      req.body,
    );

    const rentalRequest = await updateRentalRequest(
      req.params.id,
      req.user!.userId,
      validatedData.status,
    );

    res.status(200).json({
      success: true,
      message: "Rental request updated successfully",
      data: rentalRequest,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
      errorDetails: error,
    });
  }
};