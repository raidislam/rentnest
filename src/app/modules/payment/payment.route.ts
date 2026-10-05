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
import { validateIdParam } from "../../middlewares/validateRequest";

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
  validateIdParam,
  getPaymentByIdController,
);

// SSLCommerz IPN (server to server notification)
router.post(
  "/ipn",
  paymentCallbackController,
);

export default router;