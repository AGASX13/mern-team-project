import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
} from "./property.service.js";

export const addProperty = asyncHandler(async (req, res) => {
  // req.body should contain address object and location coordinates
  const property = await createProperty(req.body, req.user._id);

  res.status(201).json(
    new ApiResponse(201, property, "Property listed successfully")
  );
});

export const fetchProperties = asyncHandler(async (req, res) => {
  // Pass all query params (lat, lng, radius, filters) to service
  const result = await getAllProperties(req.query);

  res.json(new ApiResponse(200, result, "Properties fetched successfully"));
});

export const fetchPropertyById = asyncHandler(async (req, res) => {
  const property = await getPropertyById(req.params.id);

  res.json(new ApiResponse(200, property, "Property details fetched"));
});

export const editProperty = asyncHandler(async (req, res) => {
  const property = await updateProperty(
    req.params.id,
    req.user._id,
    req.body
  );

  res.json(new ApiResponse(200, property, "Property updated successfully"));
});

export const removeProperty = asyncHandler(async (req, res) => {
  await deleteProperty(req.params.id, req.user._id);

  res.json(new ApiResponse(200, null, "Property deleted successfully"));
});
