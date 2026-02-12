import mongoose from "mongoose";

const RewardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true, 
  },
  cost: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    enum: ["Premium", "Discount", "Product", "Donation"],
    default: "Premium",
  },
  image: {
    type: String,
    default: "default-reward.png",
  },
  isActive: {
    type: Boolean,
    default: true, 
  },
});

module.exports = mongoose.model("Reward", RewardSchema);
