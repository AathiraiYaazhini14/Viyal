require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const alertRoutes = require('./routes/alerts');
const zoneRoutes = require('./routes/zones');
const speciesRoutes = require('./routes/species');
const insightRoutes = require('./routes/insights');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', authRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/zones', zoneRoutes);
app.use('/api/species', speciesRoutes);
app.use('/api/insights', insightRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Viyal API is running' });
});

// MongoDB Connection
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully to Atlas (Standard Mode)');
    app.listen(PORT, () => {
      console.log(`🚀 Viyal backend running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:');
    console.error('   Error Name:', err.name);
    console.error('   Error Message:', err.message);
    console.error('\n   ⚠️ Troubleshooting Tips:');
    console.error('   1. Ensure your IP address is whitelisted in MongoDB Atlas.');
    console.error('   2. Check if your ISP or a local firewall is blocking port 27017.');
    console.error('   3. If using public WiFi, they often block DB ports.');
    process.exit(1);
  });
