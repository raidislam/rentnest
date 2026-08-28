import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

const globalErrorHandler: ErrorRequestHandler = (
  error,
  req,
  res,
  next,
) => {
  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errorDetails: error.issues,
    });
  }

  res.status(500).json({
    success: false,
    message: error.message || "Something went wrong",
    errorDetails: error,
  });
};

export default globalErrorHandler;