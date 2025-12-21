import crypto from "crypto";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User } from "../users/user.model.js";
import { ApiError } from "../../utils/apiError.js";
import { sendVerificationEmail } from "../../utils/mail.util.js";

/**
 * ==============================================================================
 * INTERNAL HELPERS
 * ==============================================================================
 */

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Failed to generate authentication tokens");
  }
};

/**
 * ==============================================================================
 * AUTH SERVICES
 * ==============================================================================
 */

/**
 * REGISTER USER + SEND EMAIL OTP
 */
export const registerUser = async (data) => {
  const { email } = data;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "User with this email already exists");
  }

  // Generate 6-digit OTP
  const otp = crypto.randomInt(100000, 999999).toString();
  const hashedOTP = await bcrypt.hash(otp, 10);

  const user = await User.create({
    ...data,
    isVerified: false,
    verificationOTP: hashedOTP,
    verificationOTPExpires: Date.now() + 10 * 60 * 1000, // 10 min
  });

  try {
    await sendVerificationEmail(user.email, otp);
  } catch (error) {
    await User.findByIdAndDelete(user._id);
    throw new ApiError(500, "Failed to send verification email");
  }

  return {
    _id: user._id,
    email: user.email,
    message: "OTP sent to email. Please verify your account.",
  };
};

/**
 * VERIFY EMAIL (OTP)
 */
export const verifyEmail = async ({ email, otp }) => {
  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, "User not found");

  if (user.isVerified) {
    throw new ApiError(400, "User already verified");
  }

  if (user.verificationOTPExpires < Date.now()) {
    throw new ApiError(400, "OTP expired");
  }

  const isValidOTP = await bcrypt.compare(otp, user.verificationOTP);
  if (!isValidOTP) {
    throw new ApiError(400, "Invalid OTP");
  }

  user.isVerified = true;
  user.verificationOTP = undefined;
  user.verificationOTPExpires = undefined;

  await user.save({ validateBeforeSave: false });

  return { message: "Email verified successfully. You can now login." };
};

/**
 * LOGIN USER
 */
export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) throw new ApiError(404, "User does not exist");

  if (!user.isVerified) {
    throw new ApiError(403, "Please verify your email before logging in");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const { accessToken, refreshToken } =
    await generateAccessAndRefreshTokens(user._id);

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  return { user: loggedInUser, accessToken, refreshToken };
};

/**
 * LOGOUT USER
 */
export const logoutUser = async (userId) => {
  await User.findByIdAndUpdate(
    userId,
    { $unset: { refreshToken: 1 } },
    { new: true }
  );
};

/**
 * REFRESH ACCESS TOKEN
 */
export const refreshAccessToken = async (incomingRefreshToken) => {
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    const decoded = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decoded._id);
    if (!user || user.refreshToken !== incomingRefreshToken) {
      throw new ApiError(403, "Invalid refresh token");
    }

    return await generateAccessAndRefreshTokens(user._id);
  } catch (error) {
    throw new ApiError(401, "Refresh token expired or invalid");
  }
};

/**
 * CHANGE PASSWORD
 */
export const changeCurrentPassword = async (
  userId,
  { oldPassword, newPassword }
) => {
  const user = await User.findById(userId).select("+password");

  const isCorrect = await user.isPasswordCorrect(oldPassword);
  if (!isCorrect) {
    throw new ApiError(401, "Invalid old password");
  }

  user.password = newPassword;
  user.refreshToken = undefined; // invalidate sessions
  await user.save();

  return { message: "Password changed successfully" };
};

/**
 * FORGOT PASSWORD
 */
export const forgotPassword = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, "User not found");

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // TODO: send reset email
  return { resetToken };
};

/**
 * RESET PASSWORD
 */
export const resetPassword = async (token, newPassword) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(400, "Token invalid or expired");
  }

  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.refreshToken = undefined;

  await user.save();
};
