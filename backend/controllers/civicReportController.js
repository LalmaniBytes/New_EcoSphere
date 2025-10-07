import CivicReport from "../models/civicReport.model.js";
import axios from "axios";  

export const createCivicReport = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    // 2. Check if coordinates are provided
    if (!latitude || !longitude) {
      return res
        .status(400)
        .json({ message: "Latitude and longitude are required." });
    }

    let address = "Address not found";
    try {
      // 3. Perform reverse geocoding using Nominatim
      const geoUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
      const { data } = await axios.get(geoUrl);
      console.log("Nominatim geocoding response:", data);
      if (data && data.display_name) {
        console.log("Geocoded address:", data);
        address = data.display_name;
      }
    } catch (geoError) {
      console.error(
        "Geocoding failed, proceeding without address:",
        geoError.message
      );
    }

    // 4. Combine original report data with the fetched address
    const reportData = {
      ...req.body,
      location: {
        // Assuming a nested location object in your schema
        latitude,
        longitude,
        address,
      },
    };

    const newReport = new CivicReport(req.body);
    const savedReport = await newReport.save();
    console.log("Civic report created:", savedReport);
    res.status(201).json(savedReport);
  } catch (error) {
    console.error("Error creating civic report:", error);
    res
      .status(400)
      .json({ message: "Failed to create civic report", error: error.message });
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
