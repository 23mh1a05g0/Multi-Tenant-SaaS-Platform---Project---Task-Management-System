require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const tenantRoutes = require('./routes/tenant.routes');
const projectRoutes = require('./routes/project.routes');
const taskRoutes = require("./routes/task.routes");
const userRoutes = require('./routes/user.routes');
const dashboardRoutes = require('./routes/dashboard.routes');


const app = express();

/* ===============================
   🔴 CORS (EXPLICIT)
================================ */
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://frontend:3000'
  ],
  credentials: true
}));

/* ===============================
   🔴 BODY PARSERS FIRST
================================ */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ===============================
   ROUTES
================================ */
app.use('/api/auth', authRoutes);
app.use('/api/tenants', tenantRoutes);
app.use('/api', projectRoutes);
app.use('/api', taskRoutes);
app.use('/api', dashboardRoutes);
app.use('/api', userRoutes);



/* ===============================
   HEALTH CHECK
================================ */
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Backend API is healthy'
  });
});

/* ===============================
   404 HANDLER
================================ */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

/* ===============================
   START SERVER (IMPORTANT)
================================ */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
});
