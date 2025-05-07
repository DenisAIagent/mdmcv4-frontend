const rateLimit = require('express-rate-limit');

// Limiter les requêtes d'analytics
const analyticsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limite chaque IP à 100 requêtes par fenêtre
  message: {
    success: false,
    error: 'Trop de requêtes, veuillez réessayer plus tard'
  }
});

// Limiter les requêtes d'API en général
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: {
    success: false,
    error: 'Trop de requêtes, veuillez réessayer plus tard'
  }
});

module.exports = {
  analyticsLimiter,
  apiLimiter
}; 