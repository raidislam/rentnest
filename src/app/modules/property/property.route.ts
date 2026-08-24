import { Router } from "express";

import {
  create,
  getProperties,
  getProperty,
  remove,
  update,
} from "./property.controller";



const router = Router();

router.get("/", getProperties);

router.get("/:id", getProperty);


export default router;