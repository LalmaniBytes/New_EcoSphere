import express from "express";
import cleanupDriveModel from "../models/cleanupDrive.model.js";
import userModel from "../models/user.model.js"; 
import { authenticateToken } from "../middleware/jwtAuth.js"; 

const cleanupDrive = express.Router();

// --- 1. CREATE DRIVE ---
cleanupDrive.post("/create", authenticateToken, async (req, res) => {
  const { title, description, date, location, pointsReward } = req.body;

  try {
    const organizer = req.user.id;

    const newDrive = new cleanupDriveModel({
      title,
      description,
      date,
      location,
      organizer,
      pointsReward: pointsReward || 100, 
      participants: [] 
    });

    const savedDrive = await newDrive.save();
    res.status(201).json(savedDrive);
  } catch (error) {
    console.error("Error creating drive:", error);
    res.status(500).json({ error: "Failed to create cleanup drive" });
  }
});

// --- 2. LIST DRIVES ---
cleanupDrive.get("/drives", async (req, res) => {
  try {
    const drives = await cleanupDriveModel
      .find({ status: "upcoming" })
      .populate("organizer", "username email") 
      .sort({ date: 1 });

    res.json(drives);
  } catch (error) {
    console.error("Error fetching drives:", error);
    res.status(500).json({ error: "Failed to fetch cleanup drives" });
  }
});

// --- 3. JOIN DRIVE ---
cleanupDrive.post("/join/:id", authenticateToken, async (req, res) => {
  try {
    const driveId = req.params.id;
    const userId = req.user.id;

    const drive = await cleanupDriveModel.findById(driveId);
    if (!drive) return res.status(404).json({ error: "Drive not found" });

    // RULE 1: Cannot join own drive
    if (drive.organizer.toString() === userId) {
      return res.status(400).json({ error: "You cannot join your own drive." });
    }

    // RULE 2: Already joined
    if (drive.participants.includes(userId)) {
      return res.status(400).json({ error: "You have already joined this drive." });
    }

    // 1. Add user to drive participants
    drive.participants.push(userId);
    await drive.save();

    // 2. PERMANENTLY Update User Points & History
    const pointsToAdd = drive.pointsReward || 100;
    
    await userModel.findByIdAndUpdate(userId, {
      $push: { completedDrives: driveId },
      $inc: { points: pointsToAdd } // <--- SAVES POINTS TO DB
    });

    res.json({ message: "Successfully joined!", pointsAdded: pointsToAdd });
  } catch (error) {
    console.error("Error joining drive:", error);
    res.status(500).json({ error: "Failed to join drive" });
  }
});

export default cleanupDrive;