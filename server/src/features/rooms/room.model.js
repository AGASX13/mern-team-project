import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },

    roomNumber: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["single", "double", "triple"],
      required: true,
    },

    capacity: {
      type: Number,
      required: true,
    },

    occupiedBeds: {
      type: Number,
      default: 0,
    },

    price: {
      type: Number,
      required: true,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Room", roomSchema);
