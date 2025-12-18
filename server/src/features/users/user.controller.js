import * as userService from "./user.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const getProfile = asyncHandler(async (req, res) => {
  const user = await userService.getMyProfile(req.user.id);

  res.status(200).json({
    success: true,
    data: user
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const updatedUser = await userService.updateMyProfile(
    req.user.id,
    req.body
  );

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: updatedUser
  });
});
