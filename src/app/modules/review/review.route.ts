import { Router } from "express";

import { createReviewController } from "./review.controller";

import {
  authenticate,
  requireTenant,
} from "../../middlewares/auth.middleware";

const router = Router();

router.post(
  "/",
  authenticate,
  requireTenant,
  createReviewController,
);

export default router;