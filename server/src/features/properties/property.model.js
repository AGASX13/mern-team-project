import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Property name is required"],
      trim: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
    },
    // Detailed Address Structure
    address: {
      street: { type: String, required: true },
      area: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
    },
    // GeoJSON for Map Search (Crucial for PGs)
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        index: "2dsphere", // Enables geospatial queries
      },
    },
    gender: {
      type: String,
      enum: ["boys", "girls", "unisex"], // "unisex" is common for co-living
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["PG", "Flat", "Hostel"],
      default: "PG",
    },
    amenities: [
      {
        type: String, // e.g., "WiFi", "Power Backup", "Food"
      },
    ],
    rules: {
      smoking: { type: Boolean, default: false },
      guests: { type: String, default: "Allowed during day" },
      curfew: { type: String, default: "10:00 PM" },
    },
    contactInfo: {
      phone: { type: String, required: true },
      email: { type: String },
    },
    images: [
      {
        type: String, // Cloudinary URLs
      },
    ],
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// 1. Text Index for Search Bar functionality
propertySchema.index({ name: "text", "address.city": "text", "address.area": "text" });

export default mongoose.model("Property", propertySchema);
