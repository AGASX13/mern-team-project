import Property from "./property.model.js";
import Room from "../rooms/room.model.js"; // Import Room to check dependencies
import { ApiError } from "../../utils/apiError.js";

/**
 * Create Property
 */
export const createProperty = async (data, userId) => {
  // Ensure location coordinates are numbers if provided
  if (data.location && data.location.coordinates) {
    data.location.coordinates = data.location.coordinates.map(Number);
  }

  const property = await Property.create({
    ...data,
    owner: userId,
  });

  return property;
};

/**
 * Get Properties with Filters, Search, and Pagination
 */
export const getAllProperties = async (query) => {
  const {
    keyword,
    city,
    gender,
    lat,
    lng,
    radius = 5000, // Default 5km
    amenities,
    page = 1,
    limit = 10,
  } = query;

  const filter = {};

  // 1. Keyword Search (Name, Area, City)
  if (keyword) {
    filter.$text = { $search: keyword };
  }

  // 2. Exact Filters
  if (city) filter["address.city"] = { $regex: city, $options: "i" };
  if (gender) filter.gender = gender;

  // 3. Geo-Spatial Filter (Find near me)
  if (lat && lng) {
    filter.location = {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [parseFloat(lng), parseFloat(lat)],
        },
        $maxDistance: parseInt(radius), // Meters
      },
    };
  }

  // 4. Amenities Filter (Must have ALL selected amenities)
  if (amenities) {
    const amenitiesList = amenities.split(","); // "wifi,ac" -> ["wifi", "ac"]
    filter.amenities = { $all: amenitiesList };
  }

  // Pagination
  const skip = (page - 1) * limit;

  const properties = await Property.find(filter)
    .populate("owner", "name email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await Property.countDocuments(filter);

  return { properties, total, page: Number(page), pages: Math.ceil(total / limit) };
};

export const getPropertyById = async (id) => {
  const property = await Property.findById(id).populate("owner", "name email contact");

  if (!property) {
    throw new ApiError(404, "Property not found");
  }

  return property;
};

/**
 * Update Property (Owner Only)
 */
export const updateProperty = async (id, userId, data) => {
  const property = await Property.findOne({ _id: id, owner: userId });

  if (!property) {
    throw new ApiError(403, "Not authorized to update this property");
  }

  // Prevent overwriting strictly managed fields manually if needed
  if (data.isVerified !== undefined) {
      delete data.isVerified; // Only admin can verify usually
  }

  Object.assign(property, data);
  await property.save();

  return property;
};

/**
 * Delete Property (Owner Only) - Safe Delete
 */
export const deleteProperty = async (id, userId) => {
  const property = await Property.findOne({ _id: id, owner: userId });

  if (!property) {
    throw new ApiError(404, "Property not found or unauthorized");
  }

  // Check for dependent Rooms before deletion
  const roomCount = await Room.countDocuments({ property: id });
  if (roomCount > 0) {
    throw new ApiError(400, `Cannot delete property. It has ${roomCount} active rooms. Delete rooms first.`);
  }

  await Property.findByIdAndDelete(id);
  return { message: "Property deleted successfully" };
};
