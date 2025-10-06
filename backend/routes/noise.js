import express from "express";
import { generateReply } from "../services/gemini.js";

const noiseRoute = express.Router();
const mockSamples = [];

console.log("Mock samples:", mockSamples);

// Calculate Leq from an array of samples
function calcLeq(dbList) {
  const lin = dbList.map((d) => Math.pow(10, d / 10));
  const meanLin = lin.reduce((a, b) => a + b, 0) / lin.length;
  return 10 * Math.log10(meanLin);
}

function calcPercentile(dbList, p) {
  const sorted = [...dbList].sort((a, b) => b - a);
  const idx = Math.floor(p * sorted.length);
  return sorted[Math.min(idx, sorted.length - 1)];
}

// POST /noise - Store incoming sample with optional location
noiseRoute.post("/", async (req, res) => {
  const { ts, dbspl, location } = req.body;

  // Basic validation
  if (!ts || typeof dbspl !== "number") {
    return res.status(400).json({ error: "Missing or invalid fields" });
  }

  // Default location if none provided
  const loc = location ? location.toString() : "unknown";

  mockSamples.push({ ts: new Date(ts), dbspl, location: loc });

  res.json({ success: true, totalSamples: mockSamples.length });
});

// Helper: Filter samples by location query param or return all
function filterSamplesByLocation(samples, location) {
  if (!location) return samples;
  return samples.filter((s) => s.location === location);
}

noiseRoute.get("/stats", async (req, res) => {
  const location = req.query.location;
  let samples = [...mockSamples];

  if (location) {
    samples = filterSamplesByLocation(samples, location);
  }

  // Sort by timestamp descending and take last 1000 samples
  const sortedSamples = samples.sort((a, b) => b.ts - a.ts).slice(0, 1000);
  const values = sortedSamples.map((s) => s.dbspl);

  if (values.length === 0) {
    return res.json({ error: "No data available for this location." });
  }

  const leq = calcLeq(values);
  const lmax = Math.max(...values);
  const lmin = Math.min(...values);
  const l10 = calcPercentile(values, 0.1);
  const l90 = calcPercentile(values, 0.9);

  res.json({ location: location || "all", leq, lmax, lmin, l10, l90 });
});

noiseRoute.get("/ai", async (req, res) => {
  const location = req.query.location;
  let samples = [...mockSamples];

  if (location) {
    samples = filterSamplesByLocation(samples, location);
  }

  const sortedSamples = samples.sort((a, b) => b.ts - a.ts).slice(0, 1000);
  const values = sortedSamples.map((s) => s.dbspl);

  if (values.length === 0) {
    return res.json({
      error: "No noise data available for analysis in this location.",
    });
  }

  const leq = calcLeq(values);
  const lmax = Math.max(...values);
  const lmin = Math.min(...values);
  const l10 = calcPercentile(values, 0.1);
  const l90 = calcPercentile(values, 0.9);

  const prompt = `Based on these noise levels (Leq: ${leq.toFixed(
    2
  )} dB, Lmax: ${lmax.toFixed(2)} dB, L90: ${l90.toFixed(
    2
  )} dB), give a simple explanation of how noisy the area is and whether it's healthy. Keep it short and easy to understand. Don't show data to the user.`;

  try {
    const aiResponse = await generateReply({ message: prompt });
    res.json({
      location: location || "all",
      stats: { leq, lmax, lmin, l10, l90 },
      advice: aiResponse,
    });
  } catch (err) {
    console.error("AI error:", err);
    res.status(500).json({ error: "Failed to generate AI explanation." });
  }
});


// GET /noise/current - Return latest noise sample (current noise level) + AI advice
noiseRoute.get("/current", async (req, res) => {
  const location = req.query.location;
  let samples = [...mockSamples];
  if (location) {
    samples = filterSamplesByLocation(samples, location);
  }

  if (samples.length === 0) {
    return res.json({ error: "No noise data available for this location." });
  }

  // Sort descending by timestamp and pick latest sample
  console.log(
    "Samples before sorting:",
    samples.map((s) => ({ ts: s.ts, dbspl: s.dbspl }))
  );
  const oldestSample = samples.reduce((oldest, sample) => {
    return !oldest || sample.ts < oldest.ts ? sample : oldest;
  }, null);
  console.log("Oldest sample:", oldestSample);
  const latestSample = samples.sort((a, b) => b.ts - a.ts)[0];
  console.log("Latest sample:", latestSample);

  const prompt = `The current noise level is ${latestSample.dbspl.toFixed(
    2
  )} dB. Explain in simple terms how noisy the area is right now and if it's healthy for people. Keep it short and easy to understand.`;

  try {
    const aiResponse = await generateReply({ message: prompt });

    res.json({
      location: location || "all",
      currentNoise: latestSample.dbspl,
      timestamp: latestSample.ts,
      advice: aiResponse,
    });
  } catch (err) {
    console.error("AI error:", err);
    res.status(500).json({ error: "Failed to generate AI explanation." });
  }
});

// GET /noise/trends - Return historical aggregated noise stats + AI advice
noiseRoute.get("/trends", async (req, res) => {
  const location = req.query.location;
  let samples = [...mockSamples];
  if (location) {
    samples = filterSamplesByLocation(samples, location);
  }

  const sortedSamples = samples.sort((a, b) => b.ts - a.ts).slice(0, 1000);
  const values = sortedSamples.map((s) => s.dbspl);

  if (values.length === 0) {
    return res.json({ error: "No noise data available for this location." });
  }

  const leq = calcLeq(values);
  const lmax = Math.max(...values);
  const lmin = Math.min(...values);
  const l10 = calcPercentile(values, 0.1);
  const l90 = calcPercentile(values, 0.9);

  const prompt = `Based on these noise levels over time (Leq: ${leq.toFixed(
    2
  )} dB, Lmax: ${lmax.toFixed(2)} dB, L90: ${l90.toFixed(
    2
  )} dB), explain the noise pollution trend in this area in simple language and whether it's healthy. Keep it brief and helpful. Keep it short and easy to understand. Don't show data to the user.`;

  try {
    const aiResponse = await generateReply({ message: prompt });
    res.json({
      location: location || "all",
      stats: { leq, lmax, lmin, l10, l90 },
      advice: aiResponse,
    });
  } catch (err) {
    console.error("AI error:", err);
    res.status(500).json({ error: "Failed to generate AI explanation." });
  }
});

export default noiseRoute;
