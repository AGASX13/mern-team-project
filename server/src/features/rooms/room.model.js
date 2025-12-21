import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
      index: true, // Faster lookups
    },
    roomNumber: {
      type: String,
      required: [true, "Room number is required"],
      trim: true,
    },
    floorNumber: {
      type: Number, // Useful for large PGs
      default: 0,
    },
    type: {
      type: String,
      enum: ["single", "double", "triple", "dormitory"],
      required: true,
    },
    amenities: [
      {
        type: String,
        enum: ["AC", "Attached Balcony", "Attached Washroom", "Geyser", "TV", "Study Table"],
      },
    ],
    capacity: {
      type: Number,
      required: true,
      min: [1, "Capacity must be at least 1"],
    },
    occupiedBeds: {
      type: Number,
      default: 0,
      min: [0, "Occupied beds cannot be negative"],
    },
    price: {
      type: Number,
      required: true,
      min: [0, "Price cannot be negative"],
    },
    status: {
      type: String,
      enum: ["available", "full", "maintenance"],
      default: "available",
    },
    images: [
      {
        type: String, // Cloudinary URLs
      },
    ],
  },
  { timestamps: true }
);

// 1. Compound Index: Prevents duplicate room numbers INSIDE the same property.
// Room "101" can exist in Property A and Property B, but not twice in Property A.
roomSchema.index({ property: 1, roomNumber: 1 }, { unique: true });

// 2. Virtual for availability check (Logic moved to model level)
roomSchema.virtual("isAvailable").get(function () {
  return this.occupiedBeds < this.capacity && this.status === "available";
});

// Ensure virtuals are included in JSON
roomSchema.set("toJSON", { virtuals: true });
roomSchema.set("toObject", { virtuals: true });

export default mongoose.model("Room", roomSchema);
