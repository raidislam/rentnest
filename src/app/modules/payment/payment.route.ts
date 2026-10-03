import { Router } from "express";
import {
  createPaymentController,
  confirmPaymentController,
  getMyPaymentsController,
  getPaymentByIdController,
  paymentCallbackController,
  paymentSuccessController,
  paymentFailController,
  paymentCancelController,
} from "./payment.controller";

import {authenticate,requireTenant} from "../../middlewares/auth.middleware";

const router = Router();

router.post("/create", authenticate,requireTenant, createPaymentController);

router.post("/confirm",authenticate,requireTenant,confirmPaymentController);

// SSLCommerz redirects here (no login token, so no authenticate)
router.post("/success", paymentSuccessController);
router.post("/fail", paymentFailController);
router.post("/cancel", paymentCancelController);

router.get("/",authenticate,requireTenant,getMyPaymentsController);

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