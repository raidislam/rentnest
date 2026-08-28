import { Router } from "express";
import {
  createPaymentController,
  confirmPaymentController,
  getMyPaymentsController,
  getPaymentByIdController,
  paymentCallbackController,
} from "./payment.controller";

import {authenticate,requireTenant} from "../../middlewares/auth.middleware";

const router = Router();

router.post(
  "/create",
  authenticate,
  requireTenant,
  createPaymentController,
);

router.post(
  "/confirm",
  authenticate,
  requireTenant,
  confirmPaymentController,
);

router.get(
  "/",
  authenticate,
  requireTenant,
  getMyPaymentsController,
);

router.get(
  "/:id",
  authenticate,
  requireTenant,
  getPaymentByIdController,
);

router.post(
  "/ipn",
  paymentCallbackController,
);

export default router;