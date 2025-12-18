import express from "express";
import {
  addProperty,
  fetchProperties,
  fetchPropertyById,
  editProperty,
  removeProperty,
} from "./property.controller.js";

import authMiddleware from "../../middlewares/auth.middleware.js";

const router = express.Router();

/* Public */
router.get("/", fetchProperties);
router.get("/:id", fetchPropertyById);

/* Protected */
router.post("/", authMiddleware, addProperty);
router.put("/:id", authMiddleware, editProperty);
router.delete("/:id", authMiddleware, removeProperty);

export default router;
