import axios from "axios";
import CivicReport from "../models/civicReport.model.js";

const fetchAqiData = async (lat, lon) => {
  const fallbackData = {
    aqi: 45,
    pm25: 12.5,
    pm10: 20.0,
    o3: 25.0,
    no2: 18.0,
    so2: 8.0,
    co: 0.4,
    status: "Good",
    forecast: [
      { day: "Today", aqi: 45, status: "Good" },
      { day: "Tomorrow", aqi: 52, status: "Moderate" },
      { day: "Day 3", aqi: 48, status: "Good" },
    ],
  };

  try {
    const url = `https://api.waqi.info/feed/geo:${lat};${lon}/?token=${process.env.WAQI_API_TOKEN}`;
    const response = await axios.get(url);
    if (response.data && response.data.status === "ok") {
      const aqiInfo = response.data.data;
      const iaqi = aqiInfo.iaqi || {};
      const aqiValue = aqiInfo.aqi || 50;

      return {
        aqi: aqiValue,
        pm25: iaqi.pm25?.v ?? 15.0,
        pm10: iaqi.pm10?.v ?? 25.0,
        o3: iaqi.o3?.v ?? 30.0,
        no2: iaqi.no2?.v ?? 20.0,
        so2: iaqi.so2?.v ?? 10.0,
        co: iaqi.co?.v ?? 0.5,
        status:
          aqiValue <= 50 ? "Good" : aqiValue <= 100 ? "Moderate" : "Unhealthy",
        forecast: [
          { day: "Today", aqi: aqiValue, status: "Good" },
          { day: "Tomorrow", aqi: aqiValue + 10, status: "Moderate" },
          { day: "Day 3", aqi: aqiValue + 5, status: "Good" },
        ],
      };
    }
    return fallbackData;
  } catch (error) {
    console.error("Error fetching AQI data:", error.message);
    return fallbackData;
  }
};

function estimateVisibility({ t, dew, h, pm10, w }) {
  const dewSpread = t - dew;
  let visibility;

  if (dewSpread < 2 && h > 90) {
    // Likely fog or heavy mist
    visibility = 0.5 + dewSpread / 2; // in km
  } else if (h > 80) {
    visibility = 2 + dewSpread; // in km
  } else {
    visibility = 5 + dewSpread * 2; // in km
  }

  // Adjust for PM10
  if (pm10 > 20) {
    visibility *= 0.85; // reduce by 15%
  }

  // Adjust for very low wind (no dispersal)
  if (w < 2) {
    visibility *= 0.9;
  }

  return Math.max(0.2, visibility.toFixed(2)); // clamp to minimum 0.2 km
}

// Example usage
const data = {
  t: 21.1,
  dew: 20,
  h: 93.6,
  pm10: 40,
  w: 1,
};



const fetchWeatherData = async (lat, lon) => {
  const url = `https://api.waqi.info/feed/geo:${lat};${lon}/?token=${process.env.WAQI_API_TOKEN}`;
  const response = await axios.get(url);
  console.log("Weather API response:", response.data.data.iaqi);
  const visibility = estimateVisibility({
    t: response.data.data?.iaqi.t?.v ?? 22.0,
    dew: response.data.data?.iaqi.d?.v ?? 20.0, 
    h: response.data.data?.iaqi.h?.v ?? 85,
    pm10: response.data.data?.iaqi.pm10?.v ?? 25.0,
    w: response.data.data?.iaqi.w?.v ?? 5.0,
  });
  console.log("Visibility :" , visibility)
  return {
  temperature: Math.round(response.data.data?.iaqi.t?.v ?? 22.0),
  humidity: Math.round(response.data.data?.iaqi.h?.v ?? 85),
  wind_speed: Math.round(response.data.data?.iaqi.w?.v ?? 5.0),
  wind_direction: Math.round(response.data.data?.iaqi.wd?.v ?? 180),
  pressure: Math.round(response.data.data?.iaqi.p?.v ?? 1013.2),
  visibility: Math.round(visibility ?? 10.0), // in km
};
};

const calculateWaterLoggingRisk = (lat, lon) => {
  if (lat > 28.6 && lat < 28.7) return "medium";
  if (lat > 19.0 && lat < 19.2) return "high";
  return "low";
};

const getAiSuggestions = async (environmentalData) => {
  const fallbackSuggestions = [
    "Monitor air quality regularly using reliable sources",
    "Stay hydrated and avoid outdoor activities during peak pollution hours",
    "Consider wearing N95 masks when outdoors in high pollution",
  ];
  // In a real app, you would uncomment and use the API call
  return fallbackSuggestions;
};

export async function buildEnvironmentalData(latitude, longitude) {
  if (!latitude || !longitude) {
    throw new Error(
      "Latitude and longitude are required to build environmental data."
    );
  }
  const [aqiData, weatherData, nearbyComplaints] = await Promise.all([
    fetchAqiData(latitude, longitude),
    fetchWeatherData(latitude, longitude),
    CivicReport.find({
      "location.latitude": { $gte: latitude - 0.01, $lte: latitude + 0.01 },
      "location.longitude": { $gte: longitude - 0.01, $lte: longitude + 0.01 },
      status: "active",
    })
      .limit(3)
      .lean(), // limit to 3 for a concise prompt
  ]);

  const waterLoggingRisk = calculateWaterLoggingRisk(latitude, longitude);

  // Return a structured object with all the fetched data
  console.log("Fetched Environmental Data:", aqiData.forecast);
  return {
    aqi_data: aqiData,
    weather_data: weatherData,
    water_logging_risk: waterLoggingRisk,
    civic_complaints:
      nearbyComplaints
        .map((c) => `${c.report_type}: ${c.description}`)
        .join("; ") || "None reported",
  };
}

export const getEnvironmentalReport = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    if (!latitude || !longitude) {
      return res
        .status(400)
        .json({ message: "Latitude and longitude are required." });
    }

    const [aqiData, weatherData, nearbyComplaints] = await Promise.all([
      fetchAqiData(latitude, longitude),
      fetchWeatherData(latitude, longitude),
      CivicReport.find({
        "location.latitude": { $gte: latitude - 0.01, $lte: latitude + 0.01 },
        "location.longitude": {
          $gte: longitude - 0.01,
          $lte: longitude + 0.01,
        },
        status: "active",
      })
        .limit(10)
        .lean(),
    ]);

    const waterLoggingRisk = calculateWaterLoggingRisk(latitude, longitude);
    const aiSuggestions = await getAiSuggestions({
      aqi: aqiData.aqi,
      temperature: weatherData.temperature,
      waterLoggingRisk: waterLoggingRisk,
    });

    const report = {
      location: { latitude, longitude },
      aqi_data: aqiData,
      weather_data: weatherData,
      noise_level: 45.0,
      water_logging_risk: waterLoggingRisk,
      civic_complaints: nearbyComplaints,
      ai_suggestions: aiSuggestions,
      timestamp: new Date(),
    };

    res.status(200).json(report);
  } catch (error) {
    console.error("Error generating environmental report:", error);
    res
      .status(500)
      .json({ message: "Failed to generate environmental report" });
  }
};
