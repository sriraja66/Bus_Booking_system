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
// In production (Vercel), frontend and backend share the same domain,
// so CORS is only relevant for external/local access.
// ALLOWED_ORIGINS env var lets you add extra origins (e.g. localhost during dev).
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
  : ['http://localhost:5173', 'http://localhost:3000'];

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
// Cache the connection across serverless warm invocations to avoid
// reconnecting on every function call (standard serverless DB pattern).
let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  try {
    if (!process.env.MONGO_URL) {
      throw new Error("MONGO_URL not found in environment variables");
    }
    const conn = await mongoose.connect(process.env.MONGO_URL);
    isConnected = true;
    console.log("MongoDB Connected:", conn.connection.host);
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

// --- API ROUTES ---
// Middleware: ensure DB is connected before every API request
app.use("/api", async (req, res, next) => {
  await connectDB();
  next();
});

app.use("/api/buses", busRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", env: process.env.NODE_ENV || "unset" });
});

// --- EXPORT for Vercel Serverless ---
export default app;

// --- LOCAL DEV: start the server only outside Vercel ---
// process.env.VERCEL is automatically set to "1" inside Vercel's runtime.
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5005;
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  });
}