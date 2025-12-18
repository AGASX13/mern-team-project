import { User } from "./user.model.js";
import { ApiError } from "../../utils/apiError.js";

export const getMyProfile = async (userId) => {
  const user = await User.findById(userId).select("-password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
};

export const updateMyProfile = async (userId, data) => {
  const user = await User.findByIdAndUpdate(
    userId,
    data,
    { new: true, runValidators: true }
  ).select("-password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
};
