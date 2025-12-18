import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      required: true,
    },

    city: {
      type: String,
      required: true,
    },

    rent: {
      type: Number,
      required: true,
    },

    gender: {
      type: String,
      enum: ["boys", "girls", "unisex"],
      required: true,
    },

    amenities: [
      {
        type: String, // wifi, food, ac, laundry etc
      },
    ],

    totalRooms: {
      type: Number,
      required: true,
    },

    availableRooms: {
      type: Number,
      required: true,
    },

    images: [
      {
        type: String, // image URLs
      },
    ],

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Property", propertySchema);
