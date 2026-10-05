import { Router } from "express";

import { getLandlordReviewsController } from "./review.controller";
import { authenticate, requireLandlord } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/", authenticate, requireLandlord, getLandlordReviewsController);

export default router;
