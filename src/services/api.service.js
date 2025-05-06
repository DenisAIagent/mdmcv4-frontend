// src/services/api.service.js
import axios from 'axios';
import API_CONFIG from '../config/api.config'; // Vérifie que le chemin est correct

// Créer une instance Axios configurée
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL, // Par ex: https://mdmcv4-backend-production-b615.up.railway.app/api
  timeout: API_CONFIG.TIMEOUT,
  withCredentials: true, // ESSENTIEL pour que le navigateur envoie les cookies HttpOnly avec les requêtes
});

// Intercepteur de réponse Axios
// Il permet de traiter toutes les réponses ou erreurs de manière centralisée.
apiClient.interceptors.response.use(
  (response) => {
    // Si la requête réussit, on retourne directement les 'data' de la réponse.
    return response.data;
  },
  (error) => {
    // Si une erreur se produit (erreur réseau, statut HTTP 4xx ou 5xx)
    console.error('API Error Interceptor caught an error:', error.response || error.message || error);

    let structuredError = {
      message: 'An unexpected error occurred. Please try again.',
      status: null, // Statut HTTP de la réponse, si disponible
      data: null,   // Données de la réponse d'erreur du backend, si disponibles
    };

    if (error.response) {
      // Le serveur a répondu avec un statut d'erreur
      structuredError.status = error.response.status;
      structuredError.data = error.response.data;
      structuredError.message = error.response.data?.error ||
                                error.response.data?.message ||
                                error.message ||
                                `Request failed with status ${error.response.status}`;

      if (error.response.status === 401) {
        console.warn('API Error 401: Unauthorized. Token might be invalid, expired, or not sent.');
      }
    } else if (error.request) {
      structuredError.message = 'No response from server. Check your network connection or CORS policy on the server.';
    } else {
      structuredError.message = error.message;
    }
    return Promise.reject(structuredError);
  }
);

// --- Service d'Authentification ---
export const authService = {
  getMe: async () => {
    return apiClient.get('/auth/me');
  },
  login: async (credentials) => {
    return apiClient.post('/auth/login', credentials);
  },
  logout: async () => {
    return apiClient.get('/auth/logout');
  },
  register: async (userData) => {
    return apiClient.post('/auth/register', userData);
  }
};

// --- Service pour les Artistes (Exemple pour montrer comment ajouter d'autres services) ---
// export const artistService = {
//   getAll: async () => apiClient.get('/artists'),
//   // ... autres fonctions pour les artistes
// };

// Exporter un objet contenant tous les services pour un accès facile
const apiService = {
    auth: authService,
    // artists: artistService, // Décommente quand tu implémentes ce service
};

export default apiService;
