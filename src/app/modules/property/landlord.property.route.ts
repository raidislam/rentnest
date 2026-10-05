import { Router } from "express";

import {
  create,
  getMyProperties,
  remove,
  update,
} from "./property.controller";

import { authenticate, requireLandlord } from "../../middlewares/auth.middleware";
import { validateIdParam } from "../../middlewares/validateRequest";

const router = Router();

router.get("/", authenticate, requireLandlord, getMyProperties);

router.post("/", authenticate, requireLandlord, create);

router.put("/:id", authenticate, requireLandlord, validateIdParam, update);

router.delete("/:id", authenticate, requireLandlord, validateIdParam, remove);

export default router;
