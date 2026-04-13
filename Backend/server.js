import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import busRoutes from "./routes/busRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";

dotenv.config();

const app = express();

// --- CORS ---
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
  : ['http://localhost:5173', 'http://localhost:3000'];

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

  try {
    if (!process.env.MONGO_URL) {
      throw new Error("MONGO_URL not found");
    }

    const conn = await mongoose.connect(process.env.MONGO_URL);
    isConnected = true;

    console.log("MongoDB Connected:", conn.connection.host);
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    // ❌ DO NOT crash server in Vercel
    return;
  }
};

// --- ENSURE DB CONNECTION BEFORE API ---
app.use("/api", async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    return res.status(500).json({ error: "Database connection failed" });
  }
});

// --- ROUTES ---
app.use("/api/buses", busRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);

// --- HEALTH CHECK ---
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", env: process.env.NODE_ENV || "unset" });
});

// --- EXPORT FOR VERCEL ---
export default app;

// --- LOCAL DEVELOPMENT ONLY ---
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5005;

  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  });
}