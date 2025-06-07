// src/config/api.config.js

const API_CONFIG = {
  // URL du backend - Railway production
  BASE_URL: process.env.REACT_APP_API_URL || 'https://analyzer-backend-production-a35c.up.railway.app/api',
  
  // Timeout pour les requêtes (10 secondes)
  TIMEOUT: 10000,
  
  // Headers par défaut
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  },
  
  // Configuration CORS
  WITH_CREDENTIALS: true,
};

// Configuration pour différents environnements
const ENV_CONFIG = {
  development: {
    BASE_URL: 'http://localhost:5001/api',
  },
  production: {
    BASE_URL: 'https://analyzer-backend-production-a35c.up.railway.app/api',
  }
};

// Détecter l'environnement et ajuster la config
const currentEnv = process.env.NODE_ENV || 'production';
if (ENV_CONFIG[currentEnv]) {
  Object.assign(API_CONFIG, ENV_CONFIG[currentEnv]);
}

// Debug en développement
if (process.env.NODE_ENV === 'development') {
  console.log('🔍 API Config:', {
    Environment: currentEnv,
    Base_URL: API_CONFIG.BASE_URL,
    Frontend_URL: window.location.origin
  });
}

export default API_CONFIG;
