import { Router } from "express";

import {create,getProperties,getProperty,remove,update} from "./property.controller";



const router = Router();

router.get("/", getProperties);

router.get("/:id", getProperty);

router.post("/", create);

router.put("/:id", update);

router.delete("/:id", remove);


export default router;