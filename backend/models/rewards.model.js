import mongoose from "mongoose";

const rewardSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  cost: { 
    type: Number, 
    required: true 
  },
  category: { 
    type: String, 
    enum: ['Product', 'Premium', 'Discount'], 
    default: 'Product' 
  },
  icon: {
    type: String, // 'leaf', 'star', 'tag' etc.
    default: 'leaf'
  },
  isActive: { 
    type: Boolean, 
    default: true 
  }
});

export default mongoose.model("Reward", rewardSchema);