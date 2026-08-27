import { Router } from "express";

import { getLandlordRentals, updateRental } from "./rental.controller";
import { authenticate, requireLandlord } from "../../middlewares/auth.middleware";



const router = Router();

router.get("/requests",authenticate,requireLandlord,getLandlordRentals);

router.patch(
  "/requests/:id",
  authenticate,
  requireLandlord,
  updateRental,
);
export default router;

