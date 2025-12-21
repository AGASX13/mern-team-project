import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    // === Basic Info ===
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    phone: { type: String, required: true },
    password: { type: String, required: true, select: false }, // 'select: false' prevents leaking password
    role: { type: String, enum: ["user", "owner", "admin"], default: "user" },

    // === Profile Details ===
    gender: { type: String, enum: ["male", "female", "other"] },
    age: Number,
    college: String,
    city: String,
    profileImage: { type: String },

    // === Account Status ===
    isVerified: { 
      type: Boolean, 
      default: false 
    },
    isBlocked: { 
      type: Boolean, 
      default: false 
    },

    // === OTP Verification Fields (New) ===
    verificationOTP: {
      type: String, // Stores the hashed OTP
    },
    verificationOTPExpires: {
      type: Date,   // Expiration time for the OTP
    },

    // === Auth Tokens & Security ===
    refreshToken: { type: String }, 
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  { timestamps: true }
);

// 🔒 Pre-save hook: Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

// 🔑 Method: Check if password is correct
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// 🎫 Method: Generate Access Token (Short lived)
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { _id: this._id, email: this.email, role: this.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

// 🔄 Method: Generate Refresh Token (Long lived)
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { _id: this._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};

// 📧 Method: Generate Password Reset Token
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  // Save hashed version to DB (Security best practice)
  this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 Minutes

  return resetToken; // Send unhashed token to user via email
};

export const User = mongoose.model("User", userSchema);