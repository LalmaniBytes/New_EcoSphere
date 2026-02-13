import express from "express";
import userModel from "../models/user.model.js";
import { authenticateToken } from "../middleware/jwtAuth.js";

const gamificationRouter = express.Router();

// --- GET USER STATS & RANK ---
gamificationRouter.get("/stats", authenticateToken, async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    // 1. Calculate Rank (Count users with MORE points than current user)
    const usersWithMorePoints = await userModel.countDocuments({ points: { $gt: user.points } });
    const globalRank = usersWithMorePoints + 1; 

    // 2. Calculate Level Progress
    let nextLevelThreshold = 1000;
    if (user.points >= 1000) nextLevelThreshold = 2500;
    if (user.points >= 2500) nextLevelThreshold = 5000;
    
    const progress = Math.min(100, Math.floor((user.points / nextLevelThreshold) * 100));

    res.json({
      _id: user._id,
      points: user.points || 0,
      rankTitle: user.rankTitle || "Novice",
      streak: user.streak?.count || 0,
      nextLevelThreshold,
      progressPercentage: progress,
      globalRank: globalRank,
      dailyBonusAvailable: true 
    });
  } catch (error) {
    console.error("Stats error:", error);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// --- GET REWARDS (Static Data) ---
gamificationRouter.get("/rewards", (req, res) => {
  // Sending static rewards so the frontend always has data
  res.json([
    { _id: "r1", title: 'Eco-Friendly Bottle', cost: 500, category: 'Product', description: 'Sustainable bamboo water bottle' },
    { _id: "r2", title: 'Premium Badge', cost: 2000, category: 'Premium', description: 'Exclusive profile recognition' },
    { _id: "r3", title: 'Local Store Discount', cost: 800, category: 'Discount', description: '20% off at partner eco-stores' }
  ]);
});

// --- REDEEM REWARD ---
gamificationRouter.post("/redeem", authenticateToken, async (req, res) => {
  const { cost } = req.body; 
  try {
    const user = await userModel.findById(req.user.id);
    
    if (user.points < cost) return res.status(400).json({ error: "Insufficient points!" });

    user.points -= cost;
    await user.save();

    res.json({ success: true, message: "Redeemed successfully!", newBalance: user.points });
  } catch (error) {
    res.status(500).json({ error: "Transaction failed" });
  }
});

export default gamificationRouter;