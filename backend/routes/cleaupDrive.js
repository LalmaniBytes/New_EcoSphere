import express from "express";
import cleanupDriveModel from "../models/cleanupDrive.model.js";
import { authenticateToken } from "../middleware/jwtAuth.js"; // Import your auth middleware

const cleanupDrive = express.Router();

// 1. Apply 'authenticateToken' middleware to protect this route
cleanupDrive.post("/create", authenticateToken, async (req, res) => {
  // We do NOT need 'organizer' from req.body anymore
  const { title, description, date, location } = req.body;

  try {
    // 2. Get the logged-in user's ID from the token (set by middleware)
    const organizer = req.user.id; 

    const newDrive = new cleanupDriveModel({
      title,
      description,
      date,
      location,
      organizer, // Use the ID from the token
    });

    const savedDrive = await newDrive.save();
    res.status(201).json(savedDrive);
  } catch (error) {
    console.error("Error creating cleanup drive:", error);
    res.status(500).json({ error: "Failed to create cleanup drive" });
  }
});

cleanupDrive.get("/drives", async (req, res) => {
  try {
    const drives = await cleanupDriveModel
      .find()
      .populate("organizer", "username email");
    res.json(drives);
  } catch (error) {
    console.error("Error fetching cleanup drives:", error);
    res.status(500).json({ error: "Failed to fetch cleanup drives" });
  }
});

export default cleanupDrive;