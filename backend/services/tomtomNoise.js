import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const TOMTOM_KEY = process.env.TOMTOM_API_KEY;

const trafficRoute = express.Router();
// --- POST /api/traffic-report ---
trafficRoute.post("/", async (req, res) => {
  try {
    const { lat, lon } = req.body;
console.log("Received traffic request for:", lat, lon);
    if (!lat || !lon) {
      return res
        .status(400)
        .json({ error: "Latitude and longitude are required." });
    }

    // TomTom Traffic Flow API endpoint
    const url = `https://api.tomtom.com/traffic/services/4/flowSegmentData/relative0/10/json?point=${lat},${lon}&key=${TOMTOM_KEY}`;
    const { data } = await axios.get(url);

    if (!data.flowSegmentData) {
      return res
        .status(404)
        .json({ error: "No traffic data found for this location." });
    }

    const { currentSpeed, freeFlowSpeed } = data.flowSegmentData;
console.log("TomTom currentSpeed:", currentSpeed, "freeFlowSpeed:", freeFlowSpeed);
    // Calculate congestion %
    const congestionScore =
      ((freeFlowSpeed - currentSpeed) / freeFlowSpeed) * 100;
console.log("TomTom congestion score:", congestionScore);
    // Map to noise level
    let noise;
    if (congestionScore < 20) {
      noise = {
        level: "Low",
        db_range: "50-60 dB",
        desc: "Smooth traffic flow",
      };
    } else if (congestionScore < 60) {
      noise = {
        level: "Moderate",
        db_range: "60-75 dB",
        desc: "Busy road, medium noise",
      };
    } else {
      noise = {
        level: "High",
        db_range: "75+ dB",
        desc: "Traffic jam, high honking",
      };
    }

    // Send structured response
    return res.json({
      coordinates: { lat, lon },
      traffic: {
        currentSpeed,
        freeFlowSpeed,
        congestionScore: Math.round(congestionScore),
      },
      noise,
    });
  } catch (err) {
    console.error("Error fetching TomTom data:", err.message);
    res.status(500).json({ error: "Failed to fetch traffic data" });
  }
});

export default trafficRoute;
