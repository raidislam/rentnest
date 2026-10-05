import { NextFunction, Request, Response } from "express";
import { z, ZodSchema } from "zod";

// Validates req.body. If invalid, the ZodError goes to the global error handler.
export const validateRequest = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    req.body = schema.parse(req.body);
    next();
  };
};

const idParamSchema = z.object({
  id: z.string().uuid("Invalid ID format"),
});

// Validates that req.params.id is a valid UUID
export const validateIdParam = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  idParamSchema.parse(req.params);
  next();
};
