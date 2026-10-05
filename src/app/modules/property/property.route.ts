import { Router } from "express";

import { getProperties, getProperty } from "./property.controller";
import { validateIdParam } from "../../middlewares/validateRequest";

const router = Router();

// Public routes. Create/update/delete are in landlord.property.route.ts
router.get("/", getProperties);

router.get("/:id", validateIdParam, getProperty);

export default router;
