import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/apiResponse.js";
import {
  createBooking,
  getMyBookings,
  cancelBooking,
} from "./booking.service.js";

export const bookRoom = asyncHandler(async (req, res) => {
  const booking = await createBooking(req.user._id, req.body);

  res
    .status(201)
    .json(new ApiResponse(201, booking, "Room booked successfully"));
});

export const fetchMyBookings = asyncHandler(async (req, res) => {
  const bookings = await getMyBookings(req.user._id);

  res.json(new ApiResponse(200, bookings));
});

export const cancelMyBooking = asyncHandler(async (req, res) => {
  const booking = await cancelBooking(req.params.id, req.user._id);

  res.json(new ApiResponse(200, booking, "Booking cancelled"));
});
