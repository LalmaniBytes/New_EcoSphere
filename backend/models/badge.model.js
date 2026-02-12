import mongoose from "mongoose";

const BadgeSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., "Early Bird"
  icon: { type: String, required: true }, // URL or icon class name
  criteria: {
    type: String,
    required: true, // Description of how to earn it
  },
  threshold: { type: Number, required: true }, // e.g., 5 (drives attended)
});

module.exports = mongoose.model("Badge", BadgeSchema);
