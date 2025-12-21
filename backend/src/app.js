/**
 * Entry point for Backend API
 * Multi-Tenant SaaS Platform
 */

require('dotenv').config();

const express = require('express');
const authRoutes = require('./routes/auth.routes');
const app = express();

/* -------------------- MIDDLEWARE -------------------- */
app.use('/api/auth', authRoutes);


// Parse JSON request body
app.use(express.json());

// Parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

/* -------------------- HEALTH CHECK -------------------- */
/**
 * Mandatory health endpoint
 * Used by Docker & evaluation scripts
 */
app.get('/api/health', async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Backend API is healthy',
      data: {
        status: 'UP',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Health check failed'
    });
  }
});

/* -------------------- ROUTES (PLACEHOLDERS) -------------------- */
/**
 * These will be implemented in Step 3.1+
 * Keeping structure ready
 */

// Example:
// const authRoutes = require('./routes/auth.routes');
// app.use('/api/auth', authRoutes);

/* -------------------- 404 HANDLER -------------------- */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

/* -------------------- GLOBAL ERROR HANDLER -------------------- */

const errorHandler = require('./middleware/error.middleware');
app.use(errorHandler);

/* -------------------- SERVER START -------------------- */




const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
});
