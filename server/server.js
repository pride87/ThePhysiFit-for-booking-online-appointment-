const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// CORS configuration
app.use(
  cors({
    origin: true,
    credentials: true
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded static files (photos)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect Database
connectDB();

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api', require('./routes/therapistRoutes'));
app.use('/api', require('./routes/therapyRoutes'));
app.use('/api', require('./routes/conditionRoutes'));
app.use('/api', require('./routes/appointmentRoutes'));
app.use('/api', require('./routes/contactRoutes'));
app.use('/api', require('./routes/patientRoutes'));
app.use('/api', require('./routes/reviewRoutes'));
app.use('/api', require('./routes/notificationRoutes'));
app.use('/api', require('./routes/settingRoutes'));
app.use('/api', require('./routes/paymentRoutes'));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const states = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };

  return res.status(200).json({
    status: 'ok',
    service: 'ThePhysiFit Express API Server',
    timestamp: new Date().toISOString(),
    mongodb: states[dbState] || 'unknown',
    database: mongoose.connection.name || 'physiocare'
  });
});

// Global 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found.` });
});

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
  console.log(`ThePhysiFit API running on port ${PORT}`);
  console.log(`🏥 Health Check available at: http://localhost:${PORT}/api/health`);
});
