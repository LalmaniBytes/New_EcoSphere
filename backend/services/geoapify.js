import express from "express";
import axios from "axios";
import env from "dotenv";
env.config();
console.log("Geoapify Key:", process.env.GEOAPIFY_KEY); 
const geoapifyRoute = express.Router();

const GEOAPIFY_KEY = process.env.GEOAPIFY_KEY;

// GET /geoapify/reverse - Reverse geocode to get address from lat/lon
geoapifyRoute.get("/reverse", async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) {
    return res
      .status(400)
      .json({ error: "Missing lat or lon query parameters" });
  }

  try {
    const response = await axios.get(
      `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=${GEOAPIFY_KEY}`);
    if (
      response.data &&
      response.data.features &&
      response.data.features.length > 0
    ) {
      const address = response.data.features[0].properties;
      res.json({ address });
    } else {
      res
        .status(404)
        .json({ error: "No address found for the given coordinates" });
    }
  } catch (error) {
    console.error("Geoapify API error:", error);
    res.status(500).json({ error: "Failed to fetch address from Geoapify" });
  }
});

export default geoapifyRoute;
