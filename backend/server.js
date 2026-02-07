require('dotenv').config();

const path = require('path');
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const db = require('./config/database');

const app = express();

// ✅ CORS configuration - Allow requests from deployed frontend
const allowedOrigins = [
  'http://localhost:5173',      // Local development
  'http://localhost',           // Local docker
  process.env.FRONTEND_URL,     // Deployed frontend URL (e.g., from Render)
].filter(Boolean);

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? allowedOrigins 
    : '*',
  credentials: true,
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Add request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Serve frontend build if present (allows running frontend from backend on port 5000)
const frontendDist = path.join(__dirname, '..', 'frontend', 'dist');
app.use(express.static(frontendDist));
// If the request doesn't match /api/* and a static file isn't found, send index.html
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/health')) return next();
  res.sendFile(path.join(frontendDist, 'index.html'), (err) => {
    if (err) next();
  });
});

// ✅ Health check endpoint
app.get("/health", (req, res) => {
  res.json({ 
    status: "OK", 
    message: "Todo App Backend is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: process.env.DATABASE_URL ? 'Render MySQL' : 'Local/Docker',
  });
});

// ✅ Root endpoint
app.get("/", (req, res) => {
  res.json({ 
    message: "Todo App API",
    version: "1.0.0",
    endpoints: {
      auth: {
        register: "POST /api/auth/register",
        login: "POST /api/auth/login",
        me: "GET /api/auth/me"
      },
      tasks: {
        list: "GET /api/tasks",
        create: "POST /api/tasks",
        update: "PUT /api/tasks/:id",
        delete: "DELETE /api/tasks/:id"
      }
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { error: err.message }),
  });
});

const PORT = process.env.PORT || 5000;

// Wait for DB initialization (tables created) before starting server
if (db.init) {
  db.init()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`✅ Server started on http://localhost:${PORT}`);
        console.log(`📊 Health check: http://localhost:${PORT}/health`);
      });
    })
    .catch((err) => {
      console.error('Fatal DB error, refusing to start server:', err.message || err);
      process.exit(1);
    });
} else {
  // Fallback if init() isn't available
  app.listen(PORT, () => {
    console.log(`✅ Server started on http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
  });
}