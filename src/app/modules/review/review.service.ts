import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";

export const createReview = async (
  tenantId: string,
  propertyId: string,
  rating: number,
  comment: string,
) => {
  const rentalRequest = await prisma.rentalRequest.findFirst({
    where: {
      tenantId,
      propertyId,
      status: "COMPLETED",
    },
  });

  if (!rentalRequest) {
    throw new AppError(
      403,
      "You can only review a property after completing the rental",
    );
  }

  const existingReview = await prisma.review.findFirst({
    where: {
      tenantId,
      propertyId,
    },
  });

  if (existingReview) {
    throw new AppError(
      409,
      "You have already reviewed this property",
    );
  }

  const review = await prisma.review.create({
    data: {
      tenantId,
      propertyId,
      rating,
      comment,
    },
  });

  return review;
};