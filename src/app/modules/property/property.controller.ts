import { Request, Response } from "express";

import {
  createProperty,
  deleteProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
} from "./property.service";

import {
  createPropertySchema,
  updatePropertySchema,
} from "./property.validation";


export const getProperties = async (
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve properties",
      errorDetails: error,
    });
  }
};

export const getProperty = async (
  req: Request,
  res: Response,
) => {
  try {
    const property = await getPropertyById(req.params.id);

    res.status(200).json({
      success: true,
      message: "Property retrieved successfully",
      data: property,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message,
      errorDetails: error,
    });
  }
};

export const create = async (
  req: Request,
  res: Response,
) => {
  try {
    const validatedData = createPropertySchema.parse(req.body);

    const property = await createProperty({
      ...validatedData,
      landlordId: req.user!.userId,
    });

    res.status(201).json({
      success: true,
      message: "Property created successfully",
      data: property,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
      errorDetails: error,
    });
  }
};

export const update = async (
  req: Request,
  res: Response,
) => {
  try {
    const validatedData = updatePropertySchema.parse(req.body);

    const property = await updateProperty(
      req.params.id,
      req.user!.userId,
      validatedData,
    );

    res.status(200).json({
      success: true,
      message: "Property updated successfully",
      data: property,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
      errorDetails: error,
    });
  }
};

export const remove = async (
  req: Request,
  res: Response,
) => {
  try {
    await deleteProperty(
      req.params.id,
      req.user!.userId,
    );

    res.status(200).json({
      success: true,
      message: "Property deleted successfully",
      data: null,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
      errorDetails: error,
    });
  }
};