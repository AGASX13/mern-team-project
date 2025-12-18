import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/apiResponse.js";
import {
  addReview,
  getReviewsByProperty,
  updateReview,
  deleteReview,
} from "./review.service.js";

export const createReview = asyncHandler(async (req, res) => {
  const review = await addReview(req.user._id, req.body);

  res
    .status(201)
    .json(new ApiResponse(201, review, "Review added"));
});

export const fetchReviews = asyncHandler(async (req, res) => {
  const reviews = await getReviewsByProperty(req.params.propertyId);

  res.json(new ApiResponse(200, reviews));
});

export const editReview = asyncHandler(async (req, res) => {
  const review = await updateReview(
    req.params.reviewId,
    req.user._id,
    req.body
  );

  res.json(new ApiResponse(200, review, "Review updated"));
});

export const removeReview = asyncHandler(async (req, res) => {
  await deleteReview(req.params.reviewId, req.user._id);

  res.json(new ApiResponse(200, null, "Review deleted"));
});
