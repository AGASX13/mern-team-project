import {asyncHandler} from "../../utils/asyncHandler.js";
import {ApiResponse} from "../../utils/apiResponse.js";
import {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
} from "./property.service.js";

export const addProperty = asyncHandler(async (req, res) => {
  const property = await createProperty(req.body, req.user.id);

  res.status(201).json(
    new ApiResponse(201, property, "Property created successfully")
  );
});

export const fetchProperties = asyncHandler(async (req, res) => {
  const filters = {};

  if (req.query.city) filters.city = req.query.city;
  if (req.query.gender) filters.gender = req.query.gender;

  const properties = await getAllProperties(filters);

  res.json(new ApiResponse(200, properties));
});

export const fetchPropertyById = asyncHandler(async (req, res) => {
  const property = await getPropertyById(req.params.id);

  res.json(new ApiResponse(200, property));
});

export const editProperty = asyncHandler(async (req, res) => {
  const property = await updateProperty(
    req.params.id,
    req.user.id,
    req.body
  );

  res.json(new ApiResponse(200, property, "Property updated"));
});

export const removeProperty = asyncHandler(async (req, res) => {
  await deleteProperty(req.params.id, req.user.id);

  res.json(new ApiResponse(200, null, "Property deleted"));
});
