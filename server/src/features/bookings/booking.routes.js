import express from "express";
import {
  bookRoom,
  fetchMyBookings,
  cancelMyBooking,
} from "./booking.controller.js";

import authMiddleware from "../../middlewares/auth.middleware.js";

const router = express.Router();

/* Protected routes */
router.post("/", authMiddleware, bookRoom);
router.get("/me", authMiddleware, fetchMyBookings);
router.put("/cancel/:id", authMiddleware, cancelMyBooking);

export default router;
