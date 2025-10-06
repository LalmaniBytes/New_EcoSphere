import express from 'express';
import { getEnvironmentalReport } from '../controllers/environmentalController.js';
import { createCivicReport, getCivicReports } from '../controllers/civicReportController.js';
import { chatWithAI } from '../controllers/chatController.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: "EcoSphere API - Environmental Monitoring System (ESM)" });
});

router.post('/environmental-report', getEnvironmentalReport);

router.post('/civic-reports', createCivicReport);
router.get('/civic-reports', getCivicReports);

router.post('/chat', chatWithAI);

router.get('/water-logging-zones', (req, res) => {
    const { latitude, longitude } = req.query;
    const lat = parseFloat(latitude || '28.61');
    const lon = parseFloat(longitude || '77.23');
    
    const proneAreas = [
        { id: "zone_1", name: "Industrial Area Near You", latitude: lat + 0.01, longitude: lon + 0.01, risk_level: "high" },
        { id: "zone_2", name: "Local Market Road", latitude: lat - 0.008, longitude: lon + 0.015, risk_level: "medium" }
    ];
    res.json({ prone_areas: proneAreas });
});

export default router;