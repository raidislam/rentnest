import { NextFunction, Request, Response } from "express";

import {
  createProperty,
  deleteProperty,
  getAllProperties,
  getLandlordProperties,
  getPropertyById,
  updateProperty,
} from "./property.service";

import {
  createPropertySchema,
  propertyQuerySchema,
  updatePropertySchema,
} from "./property.validation";


export const getProperties = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const filters = propertyQuerySchema.parse(req.query);

    const properties = await getAllProperties(filters);

    res.status(200).json({
      success: true,
      message: "Properties retrieved successfully",
      data: properties,
    });
  } catch (error) {
    next(error);
  }
};

export const getProperty = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const property = await getPropertyById(req.params.id as string);

    res.status(200).json({
      success: true,
      message: "Property retrieved successfully",
      data: property,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyProperties = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const properties = await getLandlordProperties(req.user!.userId);

    res.status(200).json({
      success: true,
      message: "Your properties retrieved successfully",
      data: properties,
    });
  } catch (error) {
    next(error);
  }
};

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction,
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
  } catch (error) {
    next(error);
  }
};

export const update = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedData = updatePropertySchema.parse(req.body);

    const property = await updateProperty(
      req.params.id as string,
      req.user!.userId,
      validatedData,
    );

    res.status(200).json({
      success: true,
      message: "Property updated successfully",
      data: property,
    });
  } catch (error) {
    next(error);
  }
};

export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await deleteProperty(
      req.params.id as string,
      req.user!.userId,
    );

    res.status(200).json({
      success: true,
      message: "Property deleted successfully",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};