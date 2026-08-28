import { Router } from "express";

import {
  getAllUsersController,
  updateUserStatusController,
  getAllPropertiesController,
  getAllRentalsController,
} from "./admin.controller";

import {
  authenticate,
  requireAdmin,
} from "../../middlewares/auth.middleware";

const router = Router();

router.get(
  "/users",
  authenticate,
  requireAdmin,
  getAllUsersController,
);

router.patch(
  "/users/:id",
  authenticate,
  requireAdmin,
  updateUserStatusController,
);

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

export default router;