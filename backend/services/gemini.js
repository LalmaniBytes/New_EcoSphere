import { GoogleGenAI } from "@google/genai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import axios from "axios";
import { buildEnvironmentalData } from "../controllers/environmentalController.js";

const env = dotenv.config();

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });

export async function generateReply({ message }) {
  try {
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: message }],
        },
      ],
    });

    const response = result.response;
    return response.text();
  } catch (err) {
    console.error("Gemini API error:", err);
    throw err;
  }
}

export async function generateReplyHome({ message, location }) {
  try {
    // 1. Fetch the live environmental data, which now includes the forecast
    const environmentalData = await buildEnvironmentalData(
      location.latitude,
      location.longitude
    );

    const forecastString =
      environmentalData.aqi_data.forecast &&
      Array.isArray(environmentalData.aqi_data.forecast)
        ? environmentalData.aqi_data.forecast
            .map(
              (day) => `${day.day} (AQI: ${day.aqi}, Status: "${day.status}")`
            )
            .join("; ")
        : "Not available.";
    console.log("Forecast String:", forecastString);

    // 3. Construct the detailed, structured prompt with the new forecast data
    const prompt = `
You are EcoSphere Bot, a helpful AI assistant for local environmental and civic concerns. Your answers must be concise, helpful, and directly use the real-time data provided.

**CONTEXTUAL DATA (Current & Upcoming Conditions at User's Location):**
- **Weather:** Temperature is ${environmentalData.weather_data.temperature}°C with ${environmentalData.weather_data.humidity}% humidity.
- **Air Quality (AQI):** The current AQI is ${environmentalData.aqi_data.aqi}, which is considered "${environmentalData.aqi_data.status}". The PM2.5 level is ${environmentalData.aqi_data.pm25}.
- **Water Logging Risk:** The risk in this area is currently rated as "${environmentalData.water_logging_risk}".
- **Nearby Active Civic Reports:** ${environmentalData.civic_complaints}.
- **AQI FORECAST (next 3 days):** ${forecastString}

**USER'S QUESTION:**
"${message}"

Based *only* on the contextual data above, provide a direct and helpful answer. Do not invent information. If asked about the future, use the forecast data.
`;

    // 4. Call the Gemini API with the rich prompt
    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (err) {
    console.error("Gemini API error or data fetching error:", err);
    // Provide a graceful fallback message
    return "I'm sorry, I couldn't fetch the latest local data right now. Please try again in a moment.";
  }
}
  