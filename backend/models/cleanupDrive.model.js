import mongoose from "mongoose";

const cleanupDriveSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  date: { 
    type: Date, 
    required: true 
  },
  location: { 
    type: String, 
    required: true 
  },
  organizer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  
  // --- GAMIFICATION FIELDS ---
  pointsReward: { 
    type: Number, 
    default: 100 // Default points for joining this drive
  },
  maxParticipants: { 
    type: Number, 
    default: 20 
  },
  // List of users who have joined
  participants: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  
  // Optional: Image for the card
  image_url: {
    type: String,
    default: ""
  },
  status: {
    type: String,
    enum: ['upcoming', 'completed', 'cancelled'],
    default: 'upcoming'
  }
}, { timestamps: true });

export default mongoose.model("CleanupDrive", cleanupDriveSchema);