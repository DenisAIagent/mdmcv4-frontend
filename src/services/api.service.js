// src/services/api.js (Mis à jour avec nouvelles méthodes et config Cookies HttpOnly)

import axios from 'axios';
import API_CONFIG from '../config/api.config'; // Vérifiez ce chemin

// Service pour interagir avec le backend
class ApiService {
  constructor() {
    // Utilise l'URL depuis api.config.js (qui lit VITE_API_URL)
    this.baseURL = API_CONFIG.API_URL;
    if (!this.baseURL) {
        console.error("ERREUR: API_URL n'est pas définie dans API_CONFIG ! Vérifiez api.config.js et .env");
    }

    // Création de l'instance Axios
    this.axios = axios.create({
      baseURL: this.baseURL,
      timeout: API_CONFIG.TIMEOUT || 10000,
      headers: API_CONFIG.HEADERS || {'Content-Type': 'application/json'},
      // *** AJOUT ESSENTIEL pour Option 1 (Cookies HttpOnly) ***
      withCredentials: true,
      // **********************************************************
    });

    // Intercepteur de réponse (utile pour gérer les erreurs globales comme 401)
    this.axios.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('Erreur API interceptée:', error.response?.data || error.message);
        if (error.response && error.response.status === 401) {
          console.warn("Accès non autorisé (401). Le token est peut-être invalide ou expiré.");
          // Ici, vous pourriez déclencher une déconnexion globale ou rediriger vers /login
          // Exemple simple:
          // if (!window.location.pathname.includes('/login')) { // Évite boucle de redirection
          //   setTimeout(() => window.location.href = '/admin/login', 500);
          // }
        }
        return Promise.reject(error); // Important: rejeter l'erreur pour la gestion locale
      }
    );
  }

  // --- Méthodes existantes (vérifiez les chemins si votre base URL inclut déjà /api) ---
  // Si baseURL = https://.../api, alors les chemins ici ne doivent pas commencer par /api

  async submitContactForm(contactData) {
    // Exemple: si la route backend est POST /api/contact/submit
    const response = await this.axios.post('/contact/submit', contactData);
    return response.data;
  }

  async submitSimulatorResults(simulatorData) {
     // Exemple: si la route backend est POST /api/simulator/submit
    const response = await this.axios.post('/simulator/submit', simulatorData);
    return response.data;
  }

  async getLatestBlogPosts(count = 3) {
    // Exemple: si la route backend est GET /api/blog/latest
    const response = await this.axios.get('/blog/latest', { params: { count } });
    // Adaptez la structure de la réponse si nécessaire
    return response.data.posts || response.data.data || response.data;
  }

  // --- NOUVELLES MÉTHODES POUR L'ADMIN / SMARTLINK BUILDER ---

  // == Authentification ==
  async login(credentials) { // { email, password }
    const response = await this.axios.post('/auth/login', credentials);
    return response.data; // Le cookie est géré par le navigateur/serveur
  }

  async register(userData) { // { username, email, password }
    const response = await this.axios.post('/auth/register', userData);
    return response.data; // Le cookie est géré par le navigateur/serveur
  }

  async logout() {
    const response = await this.axios.get('/auth/logout'); // Efface le cookie côté serveur
    return response.data;
  }

  async getMe() {
    const response = await this.axios.get('/auth/me'); // Envoie le cookie automatiquement
    return response.data; // { success: true, data: user }
  }

  // == Artistes ==
  async getAllArtists() {
    // Note: vérifier si cette route nécessite une authentification dans vos routes backend
    const response = await this.axios.get('/artists');
    return response.data; // { success: true, count, data: artists }
  }

  async createArtist(artistData) {
    // Requête authentifiée (cookie envoyé automatiquement)
    const response = await this.axios.post('/artists', artistData);
    return response.data; // { success: true, data: artist }
  }

  async updateArtist(artistSlug, artistData) {
    const response = await this.axios.put(`/artists/${artistSlug}`, artistData);
    return response.data;
  }

  async deleteArtist(artistSlug) {
    const response = await this.axios.delete(`/artists/${artistSlug}`);
    return response.data;
  }

   async getArtistBySlug(artistSlug) { // Ajoutez si nécessaire
      const response = await this.axios.get(`/artists/${artistSlug}`);
      return response.data;
  }

  // == SmartLinks ==
  async getAllSmartLinks() { // Admin requis
      const response = await this.axios.get('/smartlinks');
      return response.data;
  }

   async getSmartLinkById(id) { // Admin requis
      const response = await this.axios.get(`/smartlinks/${id}`);
      return response.data;
  }

  async createSmartLink(smartLinkData) { // Admin requis
    const response = await this.axios.post('/smartlinks', smartLinkData);
    return response.data;
  }

  async updateSmartLink(id, smartLinkData) { // Admin requis
    const response = await this.axios.put(`/smartlinks/${id}`, smartLinkData);
    return response.data;
  }

  async deleteSmartLink(id) { // Admin requis
      const response = await this.axios.delete(`/smartlinks/${id}`);
      return response.data;
  }

  // Routes publiques Smartlink
  async getSmartLinksByArtistSlug(artistSlug) {
      const response = await this.axios.get(`/smartlinks/by-artist/${artistSlug}`);
      return response.data;
  }

  async getSmartLinkBySlugs(artistSlug, trackSlug) {
      const response = await this.axios.get(`/smartlinks/details/${artistSlug}/${trackSlug}`);
      return response.data;
  }


  // == Upload ==
  async uploadImage(formData) { // Admin requis
    // Le cookie est envoyé automatiquement
    const response = await this.axios.post('/upload/image', formData, { // Adaptez '/image' si la route est juste /upload
      headers: {
        // Normalement pas besoin de définir Content-Type pour FormData, Axios le fait.
        // Si ça ne marche pas, décommentez et testez :
        // 'Content-Type': 'multipart/form-data',
      },
    });
    return response.data; // { success: true, data: { imageUrl: '...' }}
  }

} // Fin de la classe ApiService

// Exporte une instance unique (singleton) du service
export default new ApiService();
