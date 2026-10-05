import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import AppError from "../utils/AppError";

const globalErrorHandler: ErrorRequestHandler = (
  error,
  req,
  res,
  next,
) => {
  // Zod validation error (body, params or query)
  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errorDetails: error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  // Errors we throw ourselves from services
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      errorDetails: null,
    });
  }

  // Invalid JSON in request body
  if (error.type === "entity.parse.failed") {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON in request body",
      errorDetails: null,
    });
  }

  // Known Prisma errors - send a friendly message instead of Prisma internals
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "A record with this value already exists",
        errorDetails: null,
      });
    }

    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Record not found",
        errorDetails: null,
      });
    }

    if (error.code === "P2003") {
      return res.status(400).json({
        success: false,
        message: "This record is linked to other records",
        errorDetails: null,
      });
    }
  }

  // Anything else is an unexpected server error
  console.error(error);

  res.status(500).json({
    success: false,
    message: "Something went wrong",
    errorDetails:
      process.env.NODE_ENV === "development" ? error.message : null,
  });
};

export default globalErrorHandler;
