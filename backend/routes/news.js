import express from "express";
import env from "dotenv";
import axios from "axios";

env.config();

const NEWS_API_KEY = process.env.NEWS_API_KEY;
const NEWS_API_URL = process.env.NEWS_API_URL;

const newsRoute = express.Router();
console.log("NEWS_API_URL:", NEWS_API_URL);   

newsRoute.get("/", async (req, res) => {
  const { area } = req.query;

  // Construct query
  let query = "(civic OR infrastructure OR potholes OR sanitation OR roads OR water supply) AND Delhi";
  if (area) {
    query += ` AND "${area}"`;
  }

  try {
    console.log("Fetching NEWS articles for:", area || "General Delhi");

    const response = await axios.get(NEWS_API_URL, {
      params: {
        q: query,
        lang: "en",
        country: "in",
        max: 20,
        token: NEWS_API_KEY,
      },
    });

    res.json({ articles: response.data.articles });
  } catch (err) {
    console.error("Error fetching NEWS:", err.message);
    res.status(500).json({ error: "Failed to fetch NEWS articles" });
  }
});

export default newsRoute;
