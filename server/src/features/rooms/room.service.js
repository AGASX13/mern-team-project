import Room from "./room.model.js";
import Property from "../properties/property.model.js";
import { ApiError } from "../../utils/apiError.js";

/**
 * Create a new room with duplicate checks
 */
export const createRoom = async (propertyId, data) => {
  const property = await Property.findById(propertyId);
  if (!property) {
    throw new ApiError(404, "Property not found");
  }

  // Check for duplicate room number in this property
  const existingRoom = await Room.findOne({
    property: propertyId,
    roomNumber: data.roomNumber,
  });

  if (existingRoom) {
    throw new ApiError(409, `Room ${data.roomNumber} already exists in this property`);
  }

  const room = await Room.create({
    ...data,
    property: propertyId,
  });

  return room;
};

/**
 * Fetch rooms with Filtering, Sorting & Pagination
 */
export const getRoomsByProperty = async (propertyId, query) => {
  const { 
    type, 
    minPrice, 
    maxPrice, 
    status, 
    page = 1, 
    limit = 10 
  } = query;

  const filter = { property: propertyId };

  if (type) filter.type = type;
  if (status) filter.status = status;
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  // Pagination logic
  const skip = (page - 1) * limit;

  const rooms = await Room.find(filter)
    .sort({ roomNumber: 1 }) // Order by room number
    .skip(skip)
    .limit(Number(limit));
    
  const total = await Room.countDocuments(filter);

  return { rooms, total, page: Number(page), pages: Math.ceil(total / limit) };
};

/**
 * Update Room with Safety Checks (Capacity vs Occupancy)
 */
export const updateRoom = async (roomId, data) => {
  const room = await Room.findById(roomId);

  if (!room) {
    throw new ApiError(404, "Room not found");
  }

  // Safety: Cannot reduce capacity below current occupied beds
  if (data.capacity && data.capacity < room.occupiedBeds) {
    throw new ApiError(400, `Cannot reduce capacity to ${data.capacity}. ${room.occupiedBeds} beds are currently occupied.`);
  }

  // Update fields
  Object.assign(room, data);

  // Auto-update status if not explicitly set
  if (!data.status) {
    if (room.occupiedBeds >= room.capacity) {
      room.status = "full";
    } else {
      room.status = "available";
    }
  }

  await room.save();
  return room;
};

/**
 * Delete Room - Strict Mode
 * Prevents deleting rooms that have active tenants.
 */
export const deleteRoom = async (roomId) => {
  const room = await Room.findById(roomId);

  if (!room) {
    throw new ApiError(404, "Room not found");
  }

  if (room.occupiedBeds > 0) {
    throw new ApiError(400, "Cannot delete room. There are active residents/bookings assigned to this room.");
  }

  await Room.findByIdAndDelete(roomId);
  return { message: "Room deleted successfully" };
};
