import CivicReport from "../models/civicReport.model.js";
import axios from "axios";

export const reverseGeocode = async (req, res) => {
  const { lat, lon } = req.query; 
  if (!lat || !lon) {
    return res
      .status(400)
      .json({ message: "Latitude and longitude are required." });
  }

  try {
    const geoUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;

    const { data } = await axios.get(geoUrl, {
      headers: {
        // This header is required by Nominatim's usage policy
        "User-Agent": "EcoSphere/1.0",
      },
    });

    // Forward the response from Nominatim back to your frontend
    res.status(200).json(data);
  } catch (error) {
    console.error("Error in reverse geocoding proxy:", error.message);
    res
      .status(500)
      .json({ message: "Failed to fetch address from external service." });
  }
};

export const createCivicReport = async (req, res) => {
  try {
    const { report_type, description, severity, location } = req.body;

    if (!report_type || !description || !severity) {
      return res.status(400).json({ message: "Missing required report fields." });
    }

    if (!location || !location.latitude || !location.longitude) {
      return res.status(400).json({
        message: "Location with latitude and longitude is required.",
      });
    }

    // 🔄 Reverse geocode to get area name
    let area = null;
    try {
      const geoUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.latitude}&lon=${location.longitude}`;
      const { data } = await axios.get(geoUrl, {
        headers: {
          "User-Agent": "EcoSphere/1.0",
        },
      });

      const address = data.address;
      // 🧠 Choose the most specific available area
      area =
        address.suburb ||
        address.city ||
        address.town ||
        address.village ||
        address.county ||
        null;
    } catch (geoError) {
      console.warn("Reverse geocoding failed, saving without area.");
    }

    // 📝 Include area in the report data
    const newReport = new CivicReport({
      ...req.body,
      area,
    });

    const savedReport = await newReport.save();
    console.log("Civic report created:", savedReport);
    res.status(201).json(savedReport);
  } catch (error) {
    console.error("Error creating civic report:", error);
    res.status(400).json({
      message: "Failed to create civic report",
      error: error.message,
    });
  }
};
export const getCivicReports = async (req, res) => {
  try {
    const { latitude, longitude, report_type } = req.query;
    const radius = parseFloat(req.query.radius) || 0.01;
    const query = { status: "active" };
    if (latitude && longitude) {
      const latNum = parseFloat(latitude);
      const lonNum = parseFloat(longitude);
      query["location.latitude"] = {
        $gte: latNum - radius,
        $lte: latNum + radius,
      };
      query["location.longitude"] = {
        $gte: lonNum - radius,
        $lte: lonNum + radius,
      };
    }
    if (report_type) {
      query.report_type = report_type;
    }
    const reports = await CivicReport.find(query)
      .limit(50)
      .sort({ timestamp: -1 });
    res.status(200).json(reports);
  } catch (error) {
    console.error("Error fetching civic reports:", error);
    res.status(500).json({ message: "Failed to fetch civic reports" });
  }
};
