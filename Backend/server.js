import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import busRoutes from "../api/routes/busRoutes.js";
import authRoutes from "../api/routes/authRoutes.js";
import bookingRoutes from "../api/routes/bookingRoutes.js";
// ✅ Load .env ONLY for local
if (!process.env.VERCEL) {
  dotenv.config();
}

const app = express();

// ✅ DEBUG (remove later)
console.log("MONGO_URL:", process.env.MONGO_URL);

// --- CORS ---
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map(o => o.trim())
  : ["http://localhost:5173", "http://localhost:3000"];

app.use(cors({
  origin: function (origin, callback) {
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
    throw new Error("MONGO_URL not found");
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    isConnected = true;
    console.log("✅ MongoDB Connected:", conn.connection.host);
  } catch (error) {
    console.error("❌ MongoDB ERROR:", error);
    throw error; // ✅ VERY IMPORTANT
  }
};

// --- ENSURE DB BEFORE API ---
app.use("/api", async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("DB FAILED:", err);
    return res.status(500).json({ error: "Database connection failed" });
  }
});

// --- ROUTES ---
app.use("/api/buses", busRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);

// --- HEALTH ---
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// --- EXPORT ---
export default app;

// --- LOCAL ONLY ---
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5005;

  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  });
}