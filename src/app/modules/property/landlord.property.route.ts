import { Router } from "express";

import {
  create,
  remove,
  update,
} from "./property.controller";

import { authenticate, requireLandlord } from "../../middlewares/auth.middleware";


const router = Router();

router.post("/",authenticate,requireLandlord, create);

router.put("/:id",authenticate,requireLandlord,update);

router.delete("/:id",authenticate,requireLandlord,remove);

export default router;