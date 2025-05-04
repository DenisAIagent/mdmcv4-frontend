// src/config/api.config.js - CORRIGÉ POUR UTILISER LES VARIABLES D'ENVIRONNEMENT

// Lire l'URL du backend depuis la variable d'environnement VITE_API_URL
// Fournir une URL par défaut (par exemple pour le développement local) si la variable n'est pas définie.
const backendApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
// Assurez-vous que VITE_API_URL dans votre déploiement est bien :
// https://mdmcv4-backend-production-b615.up.railway.app/api

// Log pour vérifier quelle URL est utilisée (sera visible dans la console du navigateur pendant le dev)
console.log("API Base URL being used:", backendApiUrl);

const API_CONFIG = {
    // Utiliser l'URL provenant de l'environnement (ou la valeur par défaut)
    API_URL: backendApiUrl,

    // Timeout des requêtes en millisecondes
    TIMEOUT: 10000,

    // Headers par défaut
    HEADERS: {
        'Content-Type': 'application/json'
        // Ajoutez d'autres headers si nécessaire, par ex. pour l'authentification
    }
};

export default API_CONFIG;
