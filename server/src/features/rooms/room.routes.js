import express from "express";
import {
  addRoom,
  fetchRooms,
  editRoom,
  removeRoom,
} from "./room.controller.js";

import authMiddleware from "../../middlewares/auth.middleware.js";

const router = express.Router();

/* Rooms under a property */
router.get("/:propertyId", fetchRooms);

/* Protected */
router.post("/:propertyId", authMiddleware, addRoom);
router.put("/update/:roomId", authMiddleware, editRoom);
router.delete("/delete/:roomId", authMiddleware, removeRoom);

export default router;
