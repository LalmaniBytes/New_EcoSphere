const mongoose = require("mongoose");

const CleanupDriveSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title for the drive"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    location: {
      type: String,
      required: [true, "Please provide a specific location or meeting point"],
      trim: true,
    },
    // Optional: Store coordinates if you want to show these on a map later
    geo_location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        index: "2dsphere", // Enables finding drives "near me"
      },
    },
    date: {
      type: Date,
      required: [true, "Please provide a date for the drive"],
    },
    description: {
      type: String,
      required: [true, "Please provide instructions for volunteers"],
      maxlength: [1000, "Description cannot be more than 1000 characters"],
    },
    // To track who created the drive
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assumes you have a User model
      required: true,
    },
    // To track who has joined
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    status: {
      type: String,
      enum: ["upcoming", "completed", "cancelled"],
      default: "upcoming",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("CleanupDrive", CleanupDriveSchema);