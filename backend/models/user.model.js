import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  isVerified: { type: Boolean, default: false },
  role: { type: String, default: "user" },

  // --- NEW GAMIFICATION FIELDS ---
  points: { 
    type: Number, 
    default: 0 
  },
  rankTitle: { 
    type: String, 
    default: "Novice" 
  },
  streak: {
    count: { type: Number, default: 1 },
    lastActiveDate: { type: Date, default: null }
  },
  // To track which drives they have finished
  completedDrives: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'CleanupDrive' 
  }],
  // To track what rewards they bought
  redeemedRewards: [{
    rewardId: { type: String }, // Or ObjectId if you make a Reward model
    redeemedAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true }); // Adds createdAt and updatedAt automatically

export default mongoose.model("User", userSchema);