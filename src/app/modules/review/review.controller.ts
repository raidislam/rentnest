import { NextFunction, Request, Response } from "express";

import { createReviewSchema } from "./review.validation";
import { createReview, getLandlordReviews } from "./review.service";

export const createReviewController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedData = createReviewSchema.parse(req.body);

    const review = await createReview(
      req.user!.userId,
      validatedData.propertyId,
      validatedData.rating,
      validatedData.comment,
    );

    res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

export const getLandlordReviewsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const reviews = await getLandlordReviews(req.user!.userId);

    res.status(200).json({
      success: true,
      message: "Reviews retrieved successfully",
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};
