// src/config/api.config.js

const backendBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
console.log("API Base URL for service calls:", backendBaseUrl); // Bon pour le debug

const API_CONFIG = {
    BASE_URL: backendBaseUrl, // Parfait si VITE_API_URL se termine par /api
    TIMEOUT: 15000,
    // HEADERS sont généralement mieux gérés par l'instance Axios, notamment pour Content-Type.
};

export default API_CONFIG;
