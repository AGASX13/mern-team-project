import Booking from "./booking.model.js";
import Room from "../rooms/room.model.js";
import ApiError from "../../utils/apiError.js";

export const createBooking = async (userId, data) => {
  const room = await Room.findById(data.room);

  if (!room) {
    throw new ApiError(404, "Room not found");
  }

  if (!room.isAvailable) {
    throw new ApiError(400, "Room is full");
  }

  // create booking
  const booking = await Booking.create({
    user: userId,
    property: data.property,
    room: data.room,
    startDate: data.startDate,
    price: room.price,
    status: "confirmed",
  });

  // update room occupancy
  room.occupiedBeds += 1;
  room.isAvailable = room.occupiedBeds < room.capacity;
  await room.save();

  return booking;
};

export const getMyBookings = async (userId) => {
  return await Booking.find({ user: userId })
    .populate("property", "name city")
    .populate("room", "roomNumber type");
};

export const cancelBooking = async (bookingId, userId) => {
  const booking = await Booking.findOne({
    _id: bookingId,
    user: userId,
  });

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  if (booking.status === "cancelled") {
    throw new ApiError(400, "Booking already cancelled");
  }

  booking.status = "cancelled";
  await booking.save();

  // free room bed
  const room = await Room.findById(booking.room);
  if (room) {
    room.occupiedBeds -= 1;
    room.isAvailable = true;
    await room.save();
  }

  return booking;
};
