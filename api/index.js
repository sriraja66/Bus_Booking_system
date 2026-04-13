<<<<<<< HEAD
// Vercel Serverless Function entry point.
// Imports the Express app and exports it as the default handler.
// Vercel will call this function for every /api/* request.
import app from '../Backend/server.js';

=======
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

// Import routes
import busRoutes from "./routes/busRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";

dotenv.config();

const app = express();

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());

// --- DATABASE CONNECTION ---
// We connect once; the cached connection logic in db.js handles reuse
connectDB().catch(err => console.error("Database connection failed:", err));

// --- API ROUTES ---
// Prefixing with /api to match frontend expectations and existing structure
app.use("/api/buses", busRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

// Root handler for /api
app.get("/api", (req, res) => {
  res.json({ message: "Welcome to the Bus Booking API" });
});

// Export the app for Vercel serverless functions
>>>>>>> 49a6919 (deploy)
export default app;
