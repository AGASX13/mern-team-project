import express from "express";
import {
  addRoom,
  fetchRooms,
  editRoom,
  removeRoom,
} from "./room.controller.js";

import { authMiddleware } from "../../middlewares/auth.middleware.js";
// Optional: import { verifyPropertyOwner } from "../../middlewares/access.middleware.js"; 

const router = express.Router();

// Public or Semi-Public Routes
// Added query support: GET /:propertyId?type=single&minPrice=5000
router.get("/:propertyId", fetchRooms);

// Protected Routes (Admin/Owner)
// Note: In a real app, add a middleware here to ensure the logged-in user OWNS the property.
router.post("/:propertyId", authMiddleware, addRoom);

router.route("/:roomId")
    .put(authMiddleware, editRoom)
    .delete(authMiddleware, removeRoom);

export default router;
