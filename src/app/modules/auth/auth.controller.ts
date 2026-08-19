import { Request, Response } from "express";
import {
  getCurrentUser,
  loginUser,
  registerUser,
} from "./auth.service";
import {
  loginSchema,
  registerSchema,
} from "./auth.validation";

export const register = async (
  req: Request,
  res: Response,
) => {
  try {
    const validatedData = registerSchema.parse(req.body);

    const user = await registerUser(validatedData);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Registration failed",
      errorDetails: error,
    });
  }
};

export const login = async (
  req: Request,
  res: Response,
) => {
  try {
    const validatedData = loginSchema.parse(req.body);

    const result = await loginUser(validatedData);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Login failed",
      errorDetails: error,
    });
  }
};

export const me = async (
  req: Request,
  res: Response,
) => {
  try {
    const user = await getCurrentUser(req.user!.userId);

    res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      data: user,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message || "User not found",
      errorDetails: error,
    });
  }
};