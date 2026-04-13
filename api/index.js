import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import busRoutes from "./routes/busRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";

// ✅ Load .env ONLY for local development
if (!process.env.VERCEL) {
  dotenv.config();
}

const app = express();

// --- CORS ---
// ALLOWED_ORIGINS env var lets you add extra origins (e.g. localhost during dev).
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map(o => o.trim())
  : ["http://localhost:5173", "http://localhost:3000"];

app.use(cors({
  origin: function (origin, callback) {
    // Allow same-origin requests (no Origin header) and allowlisted origins
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
}));

// --- MIDDLEWARE ---
app.use(express.json());

// --- DATABASE ---
let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  if (!process.env.MONGO_URL) {
    throw new Error("MONGO_URL not found in environment variables");
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    isConnected = true;
    console.log("✅ MongoDB Connected:", conn.connection.host);
  } catch (error) {
    console.error("❌ MongoDB ERROR:", error);
    throw error;
  }
};

// --- ENSURE DB BEFORE API REQUESTS ---
app.use("/api", async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("DB CONNECTION FAILED:", err);
    return res.status(500).json({ error: "Database connection failed" });
  }
});

// --- API ROUTES ---
app.use("/api/buses", busRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);

// --- HEALTH CHECK ---
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Bus Booking API is healthy" });
});

// --- ROOT HANDLER ---
app.get("/api", (req, res) => {
  res.json({ message: "Welcome to the Bus Booking API" });
});

// --- EXPORT FOR VERCEL ---
export default app;

// --- LOCAL DEV ONLY ---
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5005;
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  });
}