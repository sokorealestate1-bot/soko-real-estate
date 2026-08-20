const dns = require('dns');
// Use Cloudflare and Google DNS to bypass local DNS issues
dns.setServers(['1.1.1.1', '8.8.8.8']);

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

console.log("📌 MONGO_URI:", process.env.MONGO_URI);

const app = express();

// ===== CORS CONFIGURATION (Fixes "Forbidden" Error) =====
const corsOptions = {
  origin: [
    'https://soko-real-estate.vercel.app',   // Your live frontend
    'http://localhost:5173',                 // Your local development
    'http://localhost:3000'                  // Alternative local port
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Middleware
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Test route
app.get("/api/test", (req, res) => {
  res.json({ message: "API is working! 🎉" });
});

// Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/properties", require("./routes/propertyRoutes"));
app.use("/api", require("./routes/uploadRoutes"));

// MongoDB connection – with explicit options to handle timeouts
mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000, // 10 seconds timeout
    socketTimeoutMS: 45000,
    family: 4, // Force IPv4
    dbName: "SOKO", // ⬅️ FORCE the database name to be "SOKO"
  })
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    console.log("⚠️  Continuing without database connection...");
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});