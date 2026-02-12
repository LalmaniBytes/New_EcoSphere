import express from "express";
import userModel from "../models/user.model.js";
import rewardModel from "../models/reward.model.js"; // Optional, can return empty array if not used
import { authenticateToken } from "../middleware/jwtAuth.js";

const gamificationRouter = express.Router();

// --- GET USER STATS & RANK ---
gamificationRouter.get("/stats", authenticateToken, async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    // 1. Calculate Progress Logic
    let nextLevelThreshold = 1000;
    if (user.points >= 1000) nextLevelThreshold = 2500;
    if (user.points >= 2500) nextLevelThreshold = 5000;
    
    const progress = Math.min(100, Math.floor((user.points / nextLevelThreshold) * 100));

    // 2. Calculate Global Rank Logic
    // "Count how many people have strictly MORE points than me"
    const usersWithMorePoints = await userModel.countDocuments({ points: { $gt: user.points } });
    const globalRank = usersWithMorePoints + 1; 

    res.json({
      points: user.points,
      rankTitle: user.rankTitle || "Novice", // Ensure default
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

// --- GET REWARDS ---
gamificationRouter.get("/rewards", async (req, res) => {
  // If you don't have a reward model yet, return empty array
  res.json([]); 
});

// --- REDEEM REWARD ---
gamificationRouter.post("/redeem", authenticateToken, async (req, res) => {
  const { cost } = req.body; // Accepting cost directly for simplicity
  try {
    const user = await userModel.findById(req.user.id);
    
    if (user.points < cost) return res.status(400).json({ error: "Insufficient points!" });

    user.points -= cost;
    await user.save();

    res.json({ success: true, message: `Redeemed successfully!`, newBalance: user.points });
  } catch (error) {
    res.status(500).json({ error: "Transaction failed" });
  }
});

export default gamificationRouter;