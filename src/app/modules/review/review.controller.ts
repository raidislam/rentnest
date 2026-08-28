import { Request, Response } from "express";

import { createReviewSchema } from "./review.validation";
import { createReview } from "./review.service";

export const createReviewController = async (
  req: Request,
  res: Response,
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
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
      errorDetails: error,
    });
  }
};