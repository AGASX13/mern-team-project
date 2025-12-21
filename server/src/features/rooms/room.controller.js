import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import {
  createRoom,
  getRoomsByProperty,
  updateRoom,
  deleteRoom,
} from "./room.service.js";

export const addRoom = asyncHandler(async (req, res) => {
  // Pass req.body directly; service handles validation
  const room = await createRoom(req.params.propertyId, req.body);

  res
    .status(201)
    .json(new ApiResponse(201, room, "Room created successfully"));
});

export const fetchRooms = asyncHandler(async (req, res) => {
  // Pass query params for filtering/pagination
  const result = await getRoomsByProperty(req.params.propertyId, req.query);

  res.json(new ApiResponse(200, result, "Rooms fetched successfully"));
});

export const editRoom = asyncHandler(async (req, res) => {
  const room = await updateRoom(req.params.roomId, req.body);

  res.json(new ApiResponse(200, room, "Room details updated"));
});

export const removeRoom = asyncHandler(async (req, res) => {
  await deleteRoom(req.params.roomId);

  res.json(new ApiResponse(200, null, "Room deleted successfully"));
});
