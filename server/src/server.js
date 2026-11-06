import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { initDatabase, isPostgresActive } from './config/db.js';
import { seedDatabase } from './db/seed.js';

import destinationRoutes from './routes/destinationRoutes.js';
import tripRoutes from './routes/tripRoutes.js';
import itineraryRoutes from './routes/itineraryRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import dataRoutes from './routes/dataRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Healthcheck & System Info Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    appName: 'TripCraft API & Data Engineering Engine',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    postgresActive: isPostgresActive(),
    databaseMode: isPostgresActive() ? 'PostgreSQL Relational DB' : 'In-Memory Fallback Store',
  });
});

// API Routes
app.use('/api/destinations', destinationRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/itinerary', itineraryRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/analytics', analyticsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ success: false, error: err.message || 'Internal Server Error' });
});

// Start Server & Initialize Database
async function startServer() {
  await initDatabase();
  await seedDatabase();

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n==================================================`);
    console.log(`✈️  TripCraft Backend API running on http://localhost:${PORT}`);
    console.log(`📡 Healthcheck: http://localhost:${PORT}/api/health`);
    console.log(`📊 Analytics:   http://localhost:${PORT}/api/analytics/dashboard`);
    console.log(`🗄️  Database:    ${isPostgresActive() ? 'PostgreSQL Active (Live)' : 'In-Memory Fallback (Postgres Ready)'}`);
    console.log(`==================================================\n`);
  });
}

startServer();
