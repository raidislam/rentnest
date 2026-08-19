import { JwtPayload } from './../../types/jwt';
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
interface JwtPayload {
  userId: string;
  role: string;
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      return res.status(401).json({
        success: false,
        message: "Authentication token is required",
        errorDetails: null,
      });
    }

    const token = authorization.startsWith("Bearer ")
      ? authorization.split(" ")[1]
      : null;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Invalid authorization format",
        errorDetails: null,
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as JwtPayload;

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
      errorDetails: error,
    });
  }
};