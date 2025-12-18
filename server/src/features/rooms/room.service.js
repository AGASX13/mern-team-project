import Room from "./room.model.js";
import Property from "../properties/property.model.js";
import {ApiError} from "../../utils/apiError.js";

export const createRoom = async (propertyId, data) => {
  const property = await Property.findById(propertyId);

  if (!property) {
    throw new ApiError(404, "Property not found");
  }

  const room = await Room.create({
    ...data,
    property: propertyId,
  });

  return room;
};

export const getRoomsByProperty = async (propertyId) => {
  return await Room.find({ property: propertyId });
};

export const updateRoom = async (roomId, data) => {
  const room = await Room.findById(roomId);

  if (!room) {
    throw new ApiError(404, "Room not found");
  }

  Object.assign(room, data);

  // auto availability logic
  room.isAvailable = room.occupiedBeds < room.capacity;

  await room.save();

  return room;
};

export const deleteRoom = async (roomId) => {
  const room = await Room.findByIdAndDelete(roomId);

  if (!room) {
    throw new ApiError(404, "Room not found");
  }

  return room;
};
