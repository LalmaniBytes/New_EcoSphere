import CivicReport from '../models/civicReport.model.js';

export const createCivicReport = async (req, res) => {
    try {
        const newReport = new CivicReport(req.body);
        const savedReport = await newReport.save();
        console.log("Civic report created:", savedReport);
        res.status(201).json(savedReport);
    } catch (error) {
        console.error("Error creating civic report:", error);
        res.status(400).json({ message: "Failed to create civic report", error: error.message });
    }
};

export const getCivicReports = async (req, res) => {
    try {
        const { latitude, longitude, report_type    } = req.query;
        const radius = parseFloat(req.query.radius) || 0.01;
        const query = { status: 'active' };
        if (latitude && longitude) {
            const latNum = parseFloat(latitude);
            const lonNum = parseFloat(longitude);
            query["location.latitude"] = { $gte: latNum - radius, $lte: latNum + radius };
            query["location.longitude"] = { $gte: lonNum - radius, $lte: lonNum + radius };
        }
        if (report_type) {
            query.report_type = report_type;
        }
        const reports = await CivicReport.find(query).limit(50).sort({ timestamp: -1 });
        res.status(200).json(reports);
    } catch (error) {
        console.error("Error fetching civic reports:", error);
        res.status(500).json({ message: "Failed to fetch civic reports" });
    }
};