import { Router } from "express";


import {
  createRental,
  getMyRentals,
  getRentalById,
  getLandlordRentals,
  completeRental,
} from "./rental.controller";
import {
  authenticate,
  requireLandlord,
  requireTenant,
} from "../../middlewares/auth.middleware";

const router = Router();

router.post("/",authenticate,requireTenant,createRental);

router.get("/",authenticate,requireTenant,getMyRentals);

router.get("/:id",authenticate,requireTenant,getRentalById);
router.patch("/:id/complete",authenticate,requireTenant,completeRental);

router.get("/requests",authenticate,requireLandlord,getLandlordRentals);

export default router;