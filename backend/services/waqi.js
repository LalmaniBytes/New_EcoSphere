import express from "express";
import axios from "axios";

const waqiRoute = express.Router();

const WAQI_API_KEY = process.env.WAQI_API_KEY;

// GET /waqi/aqi - Get AQI data by city OR by lat & lon
waqiRoute.get("/aqi", async (req, res) => {
  const { city, lat, lon } = req.query;

  if (!city && (!lat || !lon)) {
    return res.status(400).json({ error: "Provide either city or lat & lon" });
  }

  let url = "";
  if (city) {
    url = `https://api.waqi.info/feed/${city}/?token=${WAQI_API_KEY}`;
  } else {
    url = `https://api.waqi.info/feed/geo:${lat};${lon}/?token=${WAQI_API_KEY}`;
  }

  try {
    const response = await axios.get(url);
    if (response.data.status === "ok") {
      res.json({
        aqi: response.data,
        city: response.data,
      });
    } else {
      res.status(404).json({ error: "No AQI data available for the location" });
    }
  } catch (error) {
    console.error("WAQI API error:", error);
    res.status(500).json({ error: "Failed to fetch AQI data from WAQI" });
  }
});

export default waqiRoute;
