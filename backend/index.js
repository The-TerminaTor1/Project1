const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const database = require('./config/database');
const errorMiddleware = require('./middleware/errorMiddleware');

// Load environment variables
const dotenvResult = dotenv.config();
if (dotenvResult.error) {
  console.error("❌ Failed to load .env file:", dotenvResult.error);
  process.exit(1);
} else {
  console.log("✅ .env file loaded successfully");
}

const app = express();
console.log("🚀 Starting Express server setup...");

app.use(cors());
app.use(express.json());
console.log("🧩 Middleware configured");

// Connect to MongoDB
database.connectDB();

// Routes
const authRoutes = require('./Routes/AuthRoutes');
app.use('/api', authRoutes);
console.log("📦 Auth routes loaded at /api");

// Error handler
app.use(errorMiddleware);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`✅ Server is live at: http://localhost:${port}`);
  console.log("🌐 Ready to handle requests...");
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('SIGINT received. Shutting down gracefully...');
  await mongoose.connection.close();
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});
