import { Router } from "express";

import {
  getAllUsersController,
  updateUserStatusController,
  getAllPropertiesController,
  getAllRentalsController,
} from "./admin.controller";

import { authenticate, requireAdmin} from "../../middlewares/auth.middleware";
import { createNewCategory, deleteExistingCategory, updateExistingCategory } from "../category/category.controller";
import { createCategorySchema, updateCategorySchema } from "../category/category.validation";
import { validateRequest } from "../../middlewares/validateRequest";


const router = Router();

router.get("/users",authenticate,requireAdmin,getAllUsersController);

router.patch("/users/:id",authenticate,requireAdmin,updateUserStatusController);

router.get(
  "/properties",
  authenticate,
  requireAdmin,
  getAllPropertiesController,
);


router.get(
  "/rentals",
  authenticate,
  requireAdmin,
  getAllRentalsController,
);

router.post(
  "/categories",
  authenticate,
  requireAdmin,
  validateRequest(createCategorySchema),
  createNewCategory,
);

router.put(
  "/categories/:id",
  authenticate,
  requireAdmin,
  validateRequest(updateCategorySchema),
  updateExistingCategory,
);

router.delete(
  "/categories/:id",
  authenticate,
  requireAdmin,
  deleteExistingCategory,
);

export default router;