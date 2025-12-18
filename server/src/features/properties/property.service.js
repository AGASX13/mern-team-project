import Property from "./property.model.js";
import ApiError from "../../utils/apiError.js";

export const createProperty = async (data, userId) => {
  const property = await Property.create({
    ...data,
    owner: userId,
  });

  return property;
};

export const getAllProperties = async (filters = {}) => {
  return await Property.find(filters)
    .populate("owner", "name email")
    .sort({ createdAt: -1 });
};

export const getPropertyById = async (id) => {
  const property = await Property.findById(id).populate(
    "owner",
    "name email"
  );

  if (!property) {
    throw new ApiError(404, "Property not found");
  }

  return property;
};

export const updateProperty = async (id, userId, data) => {
  const property = await Property.findOne({
    _id: id,
    owner: userId,
  });

  if (!property) {
    throw new ApiError(403, "Not authorized to update this property");
  }

  Object.assign(property, data);
  await property.save();

  return property;
};

export const deleteProperty = async (id, userId) => {
  const property = await Property.findOneAndDelete({
    _id: id,
    owner: userId,
  });

  if (!property) {
    throw new ApiError(403, "Not authorized or property not found");
  }

  return property;
};
