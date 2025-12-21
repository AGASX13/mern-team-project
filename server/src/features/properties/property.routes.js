import express from "express";
import {
  addProperty,
  fetchProperties,
  fetchPropertyById,
  editProperty,
  removeProperty,
} from "./property.controller.js";

import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = express.Router();

// Public Routes
// GET /properties?lat=28.6&lng=77.2&radius=2000 (Find PGs near coords)
// GET /properties?keyword=Dwarka&amenities=wifi,ac (Search text)
router.get("/", fetchProperties);
router.get("/:id", fetchPropertyById);

// Protected Routes (Property Owners)
router.post("/", authMiddleware, addProperty);

router.route("/:id")
  .put(authMiddleware, editProperty)
  .delete(authMiddleware, removeProperty);

export default router;
