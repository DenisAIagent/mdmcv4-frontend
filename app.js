const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('./middleware/cors');
const { analyticsLimiter } = require('./middleware/rateLimiter');
const logger = require('./utils/logger');

const app = express();

// Middleware de sécurité
app.use(helmet());
app.use(compression());
app.use(cors);

// Middleware de logging
app.use(logger.middleware);

// Middleware de parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
app.use('/api/analytics', analyticsLimiter);

// Routes
const analyticsRoutes = require('./routes/analytics');
app.use('/api/analytics', analyticsRoutes);

// Gestion des erreurs
app.use((err, req, res, next) => {
  logger.error('Erreur non gérée:', err);
  res.status(500).json({
    success: false,
    error: 'Une erreur interne est survenue'
  });
});

// Gestion des routes non trouvées
app.use((req, res) => {
  logger.warn(`Route non trouvée: ${req.method} ${req.url}`);
  res.status(404).json({
    success: false,
    error: 'Route non trouvée'
  });
});

module.exports = app; 