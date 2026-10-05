import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";

interface JwtPayload {
  userId: string;
  role: string;
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let decoded: JwtPayload;

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

    decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as JwtPayload;
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
      errorDetails: null,
    });
  }

  // Check the user still exists and is not banned,
  // so an old token stops working after a ban
  const user = await prisma.user.findUnique({
    where: {
      id: decoded.userId,
    },
  });

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "User no longer exists",
      errorDetails: null,
    });
  }

  if (!user.status) {
    return res.status(403).json({
      success: false,
      message: "Your account has been banned",
      errorDetails: null,
    });
  }

  req.user = {
    userId: user.id,
    role: user.role,
  };

  next();
};

export const requireLandlord = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.user?.role !== "LANDLORD") {
    return res.status(403).json({
      success: false,
      message: "Only landlords can perform this action",
      errorDetails: null,
    });
  }

  next();
};

export const requireTenant = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.user?.role !== "TENANT") {
    return res.status(403).json({
      success: false,
      message: "Only tenants can perform this action",
      errorDetails: null,
    });
  }

  next();
};

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.user?.role !== "ADMIN") {
    return res.status(403).json({
      success: false,
      message: "Admin access required",
      errorDetails: null,
    });
  }

  next();
};

