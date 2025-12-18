import Review from "./review.model.js";
import Property from "../properties/property.model.js";
import {ApiError} from "../../utils/apiError.js";

const calculateAverageRating = async (propertyId) => {
  const stats = await Review.aggregate([
    { $match: { property: propertyId } },
    {
      $group: {
        _id: "$property",
        avgRating: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await Property.findByIdAndUpdate(propertyId, {
      averageRating: stats[0].avgRating,
      totalReviews: stats[0].count,
    });
  } else {
    await Property.findByIdAndUpdate(propertyId, {
      averageRating: 0,
      totalReviews: 0,
    });
  }
};

export const addReview = async (userId, data) => {
  const review = await Review.create({
    user: userId,
    property: data.property,
    rating: data.rating,
    comment: data.comment,
  });

  await calculateAverageRating(data.property);

  return review;
};

export const getReviewsByProperty = async (propertyId) => {
  return await Review.find({ property: propertyId })
    .populate("user", "name");
};

export const updateReview = async (reviewId, userId, data) => {
  const review = await Review.findOne({
    _id: reviewId,
    user: userId,
  });

  if (!review) {
    throw new ApiError(404, "Review not found");
  }

  review.rating = data.rating ?? review.rating;
  review.comment = data.comment ?? review.comment;

  await review.save();
  await calculateAverageRating(review.property);

  return review;
};

export const deleteReview = async (reviewId, userId) => {
  const review = await Review.findOneAndDelete({
    _id: reviewId,
    user: userId,
  });

  if (!review) {
    throw new ApiError(404, "Review not found");
  }

  await calculateAverageRating(review.property);

  return review;
};
