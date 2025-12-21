import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/apiError.js";
import { ApiResponse } from "../../utils/apiResponse.js"; // Assuming you have this, or use generic res.json
import * as authService from "./auth.service.js";

// Cookie Options
const options = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // true in production
  sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
};

export const register = asyncHandler(async (req, res) => {
  const user = await authService.registerUser(req.body);
  res.status(201).json(new ApiResponse(201, user, "User registered successfully"));
});

export const login = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.loginUser(req.body);

  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200, 
        { user, accessToken, refreshToken }, 
        "User logged in successfully"
      )
    );
});

export const verifyOtp = asyncHandler(async (req, res) => {
  const result = await authService.verifyEmail(req.body);
  res.status(200).json(new ApiResponse(200, {}, result.message));
});

export const logout = asyncHandler(async (req, res) => {
  await authService.logoutUser(req.user._id);

  res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out"));
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

  const { accessToken, refreshToken } = await authService.refreshAccessToken(incomingRefreshToken);

  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { accessToken, refreshToken },
        "Access token refreshed"
      )
    );
});

export const changePassword = asyncHandler(async (req, res) => {
  await authService.changeCurrentPassword(req.user._id, req.body);
  res.status(200).json(new ApiResponse(200, {}, "Password changed successfully"));
});

export const forgotPassword = asyncHandler(async (req, res) => {
    // We return the token for dev/testing. In prod, DO NOT return it, only send email.
    const { resetToken } = await authService.forgotPassword(req.body.email); 
    res.status(200).json(new ApiResponse(200, { resetToken }, "Password reset email sent (check console/response for token in dev mode)"));
});

export const resetPassword = asyncHandler(async (req, res) => {
    await authService.resetPassword(req.params.token, req.body.password);
    res.status(200).json(new ApiResponse(200, {}, "Password reset successfully"));
});