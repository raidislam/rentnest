import { Router } from "express";

import {
  createRental,
  getMyRentals,
  getRentalById,
  completeRental,
} from "./rental.controller";
import {
  authenticate,
  requireTenant,
} from "../../middlewares/auth.middleware";
import { validateIdParam } from "../../middlewares/validateRequest";

const router = Router();

// Tenant routes. Landlord request routes are in landlord.rental.route.ts
router.post("/", authenticate, requireTenant, createRental);

router.get("/", authenticate, requireTenant, getMyRentals);

router.get("/:id", authenticate, requireTenant, validateIdParam, getRentalById);

router.patch("/:id/complete", authenticate, requireTenant, validateIdParam, completeRental);

export default router;
