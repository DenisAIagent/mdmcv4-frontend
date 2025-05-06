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
    // Le backend renvoie généralement { success: true, data: ... } ou { success: true, error: ... }
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
      structuredError.message = error.response.data?.error || //  Notre backend utilise { success: false, error: 'message' }
                                error.response.data?.message || // Au cas où la structure changerait
                                error.message || // Message d'erreur Axios par défaut
                                `Request failed with status ${
