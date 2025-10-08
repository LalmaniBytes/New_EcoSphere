import express from "express";
import env from "dotenv";
import cors from "cors";
import helmet from "helmet";
import session from "express-session";
import mongoose from "mongoose";
import newsRoute from "./routes/news.js";
import geminiRoute from "./routes/geminiRoute.js";
import noiseRoute from "./routes/noise.js";
import geoapifyRoute from "./services/geoapify.js";
import waqiRoute from "./services/waqi.js";
import apiRoutes from "./routes/api.js";

const app = express();
const PORT = process.env.PORT || 5050;
env.config();

app.use(
  session({
    secret: "supersecretkey",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",")
  : [];
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));
app.use(
  helmet({
    crossOriginEmbedderPolicy: false, // disable COEP for dev
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("API is running");
});
app.get("/ping", (req, res) => {
  res.send("Ping routed working !");
});
app.use("/api", apiRoutes);
app.use("/news", newsRoute);
app.use("/gemini", geminiRoute);
app.use("/noise", noiseRoute);
app.use("/geoapify", geoapifyRoute);
app.use("/waqi", waqiRoute);

app.listen(PORT, () => {
  console.log("Server is running on port 5050");
});
