const express = require('express');
const path = require('path');
const dotenvResult = require('dotenv').config();
const connectToMongo = require("./config/database");

if (dotenvResult.error) {
  console.error("❌ Failed to load .env file:", dotenvResult.error);
  process.exit(1);
} else {
  console.log("✅ .env file loaded successfully");
}

const mongoose = require('mongoose');

const app = express();

console.log("🚀 Starting Express server setup...");

// Middleware to parse JSON
app.use(express.json());
console.log("🧩 Middleware configured");

// MongoDB connection

connectToMongo();

// Route imports
const authRoutes = require('./Routes/AuthRoutes');
app.use('/api', authRoutes);
console.log("📦 Auth routes loaded at /api");

// Server listener
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`✅ Server is live at: http://localhost:${port}`);
  console.log("🌐 Ready to handle requests...");
});
