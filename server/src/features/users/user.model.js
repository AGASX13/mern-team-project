import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    phone: {
      type: String,
      required: true
    },

    password: {
      type: String,
      required: true,
      select: false
    },

    role: {
      type: String,
      enum: ["user", "owner", "admin"],
      default: "user"
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"]
    },

    age: Number,

    college: String,

    city: String,

    profileImage: {
      type: String
    },

    isVerified: {
      type: Boolean,
      default: false
    },

    isBlocked: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
