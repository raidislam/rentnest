import { Router } from "express";


import {
  createRental,
  getMyRentals,
  getRentalById,
  getLandlordRentals,
} from "./rental.controller";
import {
  authenticate,
  requireTenant,
} from "../../middlewares/auth.middleware";

const router = Router();

router.post("/",authenticate,requireTenant,createRental);

router.get("/",authenticate,requireTenant,getMyRentals);

router.get("/:id",authenticate,requireTenant,getRentalById);

export default router;