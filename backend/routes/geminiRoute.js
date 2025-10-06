import express from "express";
import env from "dotenv";
import { generateReply } from "../services/gemini.js";
import axios from "axios";

const geminiRoute = express.Router();
env.config();

geminiRoute.get("/", async (req, res) => {
  let area = req.query.area;
  if (!area) return res.status(400).json({ error: "Missing 'area' query parameter" });

  try {
    console.log("🔍 Step 1: Received area from user:", area);

    // 🧠 Step 2: Correct the area spelling
    const correctionPrompt = `
      A user entered an area name in Delhi: "${area}". 
      Correct the spelling if it's wrong or suggest the nearest valid locality in Delhi.
      Return ONLY the corrected or valid area name.
    `;
    let correctedArea = (await generateReply({ message: correctionPrompt })).trim();
    console.log("✅ Step 2: Corrected area:", correctedArea);

    const triedAreas = new Set(); // to avoid repeats
    let articles = [];
    let currentArea = correctedArea;

    // 🔄 Loop: try increasing levels of proximity
    while (true) {
      if (triedAreas.has(currentArea.toLowerCase())) {
        console.log("⚠️ Already tried:", currentArea);
        break;
      }

      triedAreas.add(currentArea.toLowerCase());
      console.log("📰 Fetching news for area:", currentArea);

      const newsResponse = await axios.get("http://localhost:5050/news", {
        params: { area: currentArea },
      });

      articles = newsResponse.data.articles || [];

      if (articles.length > 0) {
        console.log("✅ Found articles in:", currentArea);
        area = currentArea; // use this in final prompt
        break;
      }

      // 🧠 Ask Gemini for the next fallback area
      const nextAreaPrompt = `
        "${currentArea}" is an area in Delhi. 
        Suggest a nearby OR broader area in Delhi that may contain similar civic issues. 
        Avoid repeating areas already tried: ${Array.from(triedAreas).join(", ")}.
        Return ONLY one name (the next closest or broader locality or district).
        When there's no further area realted to the user query area , return "Delhi".
      `;
      const nextArea = (await generateReply({ message: nextAreaPrompt })).trim();
      console.log("🔄 Trying next fallback area:", nextArea);

      if (!nextArea || triedAreas.has(nextArea.toLowerCase())) {
        console.log("❌ No new areas left to try or already tried. Stopping.");
        break;
      }

      currentArea = nextArea;
    }

    // 🧠 Final AI analysis step
    const message = `
You are an assistant tasked with identifying recent civic issues in different parts of Delhi.

Below is a list of news articles for the area: **${area}**.

Your job is to:
- Analyze the articles
- Identify any civic issues (such as sanitation, roads, pollution, traffic, water, etc.)
- Summarize them concisely
- If no relevant civic issues are found, say: "No recent civic issues found in the news for ${area}."

News Articles:
${JSON.stringify(articles)}
    `;

    console.log("🧠 Sending news to Gemini for analysis...");
    const reply = await generateReply({ message });

    res.json({ reply, area });
  } catch (err) {
    console.error("❌ Error generating reply:", err.message);
    res.status(500).json({ error: "Failed to generate reply" });
  }
});

export default geminiRoute;
