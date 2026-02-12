import express from 'express';
import jwt from "jsonwebtoken";
import { getEnvironmentalReport } from '../controllers/environmentalController.js';
// import { createCivicReport, getCivicReports } from '../controllers/civicReportController.js';
import { chatWithAI } from '../controllers/chatController.js';
import noiseRoute from './noise.js';
import trafficRoute from '../services/tomtomNoise.js';
import { reverseGeocode , createCivicReport , getCivicReports} from '../controllers/civicReport.controller.js';
import bcrypt from "bcryptjs";
import userModel from "../models/user.model.js";
import { OAuth2Client } from "google-auth-library";
import session from "express-session";
import signup from './signup.js';
import signin from './signin.js';
import authRouter from '../services/checkSession.js';
import { authenticateToken } from '../middleware/jwtAuth.js';
import adminLogin from "../routes/adminLogin.js";

const router = express.Router();


router.get('/', (req, res) => {
  res.json({ message: "EcoSphere API - Environmental Monitoring System (ESM)" });
});

router.post('/environmental-report', getEnvironmentalReport);
router.get("/geocode/reverse", reverseGeocode);
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

router.use('/noise', noiseRoute);
router.use('/traffic', trafficRoute);
router.use('/signup', signup);
router.use('/signin', signin);
router.get("/auto-login", authenticateToken, (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ msg: "Not logged in" });
  console.log("Token : ", token);
  try {
    const userData = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ msg: "User auto-logged in", user: userData });
  } catch (err) {
    console.log("error , ", err);
    res.status(401).json({ msg: "Invalid or expired token" });
  }
});
router.use('/admin', adminLogin);

export default router;