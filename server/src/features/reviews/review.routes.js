import express from "express";
import {
  createReview,
  fetchReviews,
  editReview,
  removeReview,
} from "./review.controller.js";

import {authMiddleware} from "../../middlewares/auth.middleware.js";

const router = express.Router();

/* Public */
router.get("/:propertyId", fetchReviews);

/* Protected */
router.post("/", authMiddleware, createReview);
router.put("/:reviewId", authMiddleware, editReview);
router.delete("/:reviewId", authMiddleware, removeReview);

export default router;

