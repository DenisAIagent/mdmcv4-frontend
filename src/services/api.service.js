// src/services/api.service.js
import axios from 'axios';
import API_CONFIG from '../config/api.config'; // Vérifie que le chemin est correct

// Créer une instance Axios configurée
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL, // Doit être https://<backend_url>/api
  timeout: API_CONFIG.TIMEOUT,
  withCredentials: true, // ESSENTIEL pour que le navigateur envoie les cookies HttpOnly avec les requêtes
});

// Intercepteur de réponse Axios
// Il permet de traiter toutes les réponses ou erreurs de manière centralisée.
apiClient.interceptors.response.use(
  (response) => {
    // Si la requête réussit, on retourne directement les 'data' de la réponse.
    // Le backend renvoie généralement { success: true, data: ... } ou { success: false, error: '...' }
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
      // Tenter d'extraire un message d'erreur plus précis du backend
      structuredError.message = error.response.data?.error || // Notre backend utilise { success: false, error: 'message' }
                                error.response.data?.message || // Au cas où la structure changerait
                                error.message || // Message d'erreur Axios par défaut
                                `Request failed with status ${error.response.status}`;

      if (error.response.status === 401) {
        console.warn('API Error 401: Unauthorized. Token might be invalid, expired, or not sent.');
        // Pour l'instant, ProtectedRoute gérera la redirection basée sur cet échec.
        // Plus tard, on pourrait implémenter une déconnexion globale ici si un token expire pendant une session active.
      }
    } else if (error.request) {
      // La requête a été faite mais aucune réponse n'a été reçue (ex: problème réseau, CORS bloquant silencieusement)
      structuredError.message = 'No response from server. Check your network connection or CORS policy on the server.';
    } else {
      // Une erreur s'est produite lors de la configuration de la requête (rare)
      structuredError.message = error.message;
    }
    // Rejeter la promesse avec l'erreur structurée pour que le code appelant puisse la gérer
    return Promise.reject(structuredError);
  }
);

// --- Service d'Authentification ---
// Regroupe toutes les fonctions liées à l'authentification
export const authService = {
  /**
   * Récupère les informations de l'utilisateur actuellement connecté.
   * Le backend attend un cookie HttpOnly 'token'.
   * L'URL complète sera: API_CONFIG.BASE_URL + '/auth/me'
   */
  getMe: async () => {
    return apiClient.get('/auth/me'); // Axios ajoute automatiquement la baseURL
  },

  /**
   * Connecte un utilisateur.
   * @param {object} credentials - Doit contenir { email, password }
   */
  login: async (credentials) => {
    return apiClient.post('/auth/login', credentials);
  },

  /**
   * Déconnecte l'utilisateur.
   * Le backend invalidera/supprimera le cookie HttpOnly.
   */
  logout: async () => {
    return apiClient.get('/auth/logout');
  },

  /**
   * Enregistre un nouvel utilisateur.
   * @param {object} userData - { username, email, password, role? }
   */
  register: async (userData) => {
    return apiClient.post('/auth/register', userData);
  },
  // Tu peux ajouter ici updatePassword, forgotPassword, resetPassword si besoin
  // Exemple:
  // updatePassword: async (passwords) => apiClient.put('/auth/updatepassword', passwords),
};

// --- Service pour les SmartLinks ---
export const smartLinkService = {
  create: async (data) => apiClient.post("/smartlinks", data),
  getAll: async (params) => apiClient.get("/smartlinks", { params }), // Pour la liste admin (protégée)
  getById: async (id) => apiClient.get(`/smartlinks/${id}`),          // Pour l'édition admin (protégée)
  update: async (id, data) => apiClient.put(`/smartlinks/${id}`, data),
  deleteById: async (id) => apiClient.delete(`/smartlinks/${id}`),
  // Pour la page publique SmartLink (utilise les slugs, non protégée, appelle le middleware logClick côté backend)
  getBySlugs: async (artistSlug, trackSlug) => apiClient.get(`/smartlinks/details/${artistSlug}/${trackSlug}`),
};

// --- Service pour les Artistes ---
export const artistService = {
  createArtist: async (artistData) => apiClient.post('/artists', artistData),
  getAllArtists: async (params) => apiClient.get('/artists', { params }), // La protection est gérée par le backend si besoin
  getArtistBySlug: async (slug) => apiClient.get(`/artists/${slug}`), // Route publique
  updateArtist: async (slug, artistData) => apiClient.put(`/artists/${slug}`, artistData), // Nécessite slug, protégée
  deleteArtist: async (slug) => apiClient.delete(`/artists/${slug}`), // Nécessite slug, protégée
  // Si tu as besoin de récupérer un artiste par son ID pour l'admin (par exemple pour SmartLinkForm)
  getArtistById: async (id) => apiClient.get(`/artists/id/${id}`), // Assure-toi que cette route existe sur le backend si tu l'utilises
};

// --- Service pour l'Upload d'Images ---
export const uploadService = {
    uploadImage: async (formData) => { // formData doit être un objet FormData
        return apiClient.post('/upload/image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data', // Important pour l'upload de fichiers
            },
        });
    }
};

// --- Service pour les Reviews (Exemple) ---
export const reviewService = {
    createReview: async (reviewData) => apiClient.post('/reviews', reviewData), // Public
    getReviews: async (params) => apiClient.get('/reviews', { params }), // Public, peut être filtré (ex: status=approved)
    updateReviewStatus: async (id, statusData) => apiClient.put(`/reviews/${id}`, statusData), // Admin
    deleteReview: async (id) => apiClient.delete(`/reviews/${id}`), // Admin
};

// --- Service pour WordPress/Blog Posts (Exemple) ---
// À adapter selon les endpoints réels de ton backend pour WordPress
export const blogService = {
    getLatestPosts: async (limit = 3) => apiClient.get('/wordpress/posts', { params: { limit, sort: '-publishedDate' } }),
    // getAllPosts: async (params) => apiClient.get('/wordpress/posts', { params }),
    // getPostBySlug: async (slug) => apiClient.get(`/wordpress/posts/slug/${slug}`), // Si tu as une route par slug
};


// Exporter un objet contenant tous les services pour un accès facile et typé
const apiService = {
    auth: authService,
    smartlinks: smartLinkService,
    artists: artistService,
    upload: uploadService,
    reviews: reviewService,
    blog: blogService,
    // gemini: geminiService, // Si tu l'importes et le structures ici
    // Permet d'accéder à l'instance apiClient de base si besoin pour des appels non couverts
    // apiClientInstance: apiClient,
};

export default apiService;
