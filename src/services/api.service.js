// src/services/api.service.js
import axios from 'axios';
import API_CONFIG from '../config/api.config'; // Vérifier le chemin

const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL, // ex: https://mdmcv4-backend-production-b615.up.railway.app/api
  timeout: API_CONFIG.TIMEOUT,
  withCredentials: true, // ESSENTIEL pour les cookies HttpOnly
});

// Intercepteur de réponse
apiClient.interceptors.response.use(
  (response) => response.data, // Simplifie l'accès direct aux données
  (error) => {
    console.error('API Error Interceptor:', error.response || error.message || error);
    let structuredError = {
      message: 'An unexpected error occurred.',
      status: null,
      data: null,
    };

    if (error.response) {
      structuredError = {
        status: error.response.status,
        message: error.response.data?.error || error.response.data?.message || error.message || `Request failed with status ${error.response.status}`,
        data: error.response.data,
      };
      if (error.response.status === 401) {
        console.warn('API Error 401: Unauthorized. Token might be invalid or expired. Consider global logout.');
        // TODO: Ici, on pourrait déclencher un événement de déconnexion global
        // ou appeler une action d'un store (Zustand) pour nettoyer l'état utilisateur
        // et potentiellement rediriger vers la page de login si l'erreur 401
        // n'est pas gérée spécifiquement par le composant appelant (comme ProtectedRoute).
        // Pour l'instant, on laisse ProtectedRoute gérer la redirection basée sur son propre appel /me.
      }
    } else if (error.request) {
      structuredError.message = 'No response from server. Check network or CORS policy.';
    } else {
      structuredError.message = error.message;
    }
    return Promise.reject(structuredError); // Propager une erreur structurée
  }
);

// --- Service d'Authentification ---
export const authService = {
  getMe: async () => {
    // GET {API_CONFIG.BASE_URL}/auth/me
    return apiClient.get('/auth/me');
  },
  login: async (credentials) => {
    // POST {API_CONFIG.BASE_URL}/auth/login
    return apiClient.post('/auth/login', credentials);
  },
  logout: async () => {
    // GET {API_CONFIG.BASE_URL}/auth/logout
    return apiClient.get('/auth/logout');
  },
  register: async (userData) => { // Ajout pour la complétude, si nécessaire
    // POST {API_CONFIG.BASE_URL}/auth/register
    return apiClient.post('/auth/register', userData);
  }
  // ... autres fonctions (forgotPassword, resetPassword)
};

// --- Service Artistes (Exemple) ---
// export const artistService = {
//   getAll: async () => apiClient.get('/artists'),
//   create: async (artistData) => apiClient.post('/artists', artistData),
//   // ...
// };

// Exporter les services structurés
const apiService = {
    auth: authService,
    // artists: artistService, // Décommentez quand prêt
};

export default apiService; // Exportation par défaut pour import apiService from '...'
// Ou exporter individuellement si préféré : export { authService, artistService }
