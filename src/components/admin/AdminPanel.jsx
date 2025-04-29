import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import '../../assets/styles/admin.css'; // Vérifie le chemin
import MarketingIntegrations from './MarketingIntegrations';
import WordPressConnector from './WordPressConnector';
import LandingPageGenerator from './LandingPageGenerator';
import AdminChatbot from './AdminChatbot';
import AuthenticationSettings from './AuthenticationSettings';
import WordPressSync from './WordPressSync';

const AdminPanel = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [pendingReviews, setPendingReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [fetchError, setFetchError] = useState(null);
  // Ajout d'un état pour les messages de succès/erreur des actions approve/reject
  const [actionMessage, setActionMessage] = useState({ type: '', text: '' });

  // Détection taille écran (inchangé)
  useEffect(() => { /* ... */ }, []);

  // --- Chargement des avis depuis l'API (inchangé) ---
  const fetchPendingReviews = async () => {
      setIsLoading(true);
      setFetchError(null);
      setActionMessage({ type: '', text: '' }); // Efface les messages d'action précédents
      const apiUrl = import.meta.env.VITE_API_URL;
      if (!apiUrl) { /* ... gestion erreur URL ... */ setIsLoading(false); return; }
      try {
        const response = await fetch(`${apiUrl}/reviews?status=pending`);
        if (!response.ok) { /* ... gestion erreur fetch ... */ throw new Error(`HTTP error! status: ${response.status}`); }
        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
          setPendingReviews(data.data);
        } else { /* ... gestion erreur format ... */ }
      } catch (error) { /* ... gestion erreur catch ... */ }
      finally { setIsLoading(false); }
  };

  useEffect(() => {
    fetchPendingReviews(); // Charge les avis au montage
  }, []); // Tableau vide pour exécution unique

  // --- Fonctions (Logout, GenerateLink, ToggleSidebar - inchangées) ---
  const handleLogout = () => { /* ... */ };
  const generateReviewLink = () => { /* ... */ };
  const toggleSidebar = () => { /* ... */ };

  // --- Fonction pour mettre à jour le statut d'un avis (Appeler l'API) ---
  const updateReview = async (id, newStatus) => {
      setActionMessage({ type: '', text: '' }); // Efface les messages précédents
      const apiUrl = import.meta.env.VITE_API_URL;
      if (!apiUrl) {
          console.error("Erreur: VITE_API_URL non définie.");
          setActionMessage({ type: 'error', text: "Erreur de configuration API." });
          return;
      }

      // Récupère le token d'authentification (si nécessaire pour cette route)
      // Adapte la clé 'mdmc_admin_auth' si elle est différente
      const token = localStorage.getItem('mdmc_admin_auth');
      const headers = {
          'Content-Type': 'application/json',
      };
      if (token) {
          headers['Authorization'] = `Bearer ${token}`;
      } else {
          // Gérer le cas où le token est manquant si la route est protégée
          console.warn("Token d'authentification manquant pour la mise à jour de l'avis.");
          // setActionMessage({ type: 'error', text: "Erreur d'authentification." });
          // return; // Décommente si la route est protégée et que le token est obligatoire
      }


      try {
          console.log(`Appel API: PUT ${apiUrl}/reviews/${id} avec status: ${newStatus}`);
          const response = await fetch(`${apiUrl}/reviews/${id}`, {
              method: 'PUT',
              headers: headers,
              body: JSON.stringify({ status: newStatus }) // Envoie le nouveau statut dans le corps
          });

          if (!response.ok) {
              const errorData = await response.json().catch(() => ({ message: `Erreur serveur ${response.status}` }));
              console.error(`Erreur ${response.status} lors de la mise à jour de l'avis:`, errorData);
              throw new Error(errorData.message || `Erreur ${response.status}`);
          }

          const result = await response.json();
          console.log('Réponse API mise à jour:', result);

          // Met à jour l'UI : retire l'avis de la liste des 'pending'
          setPendingReviews(currentReviews => currentReviews.filter(review => review._id !== id));
          setActionMessage({ type: 'success', text: `Avis ${newStatus === 'approved' ? 'approuvé' : 'rejeté'} avec succès !` });

          // Efface le message de succès après quelques secondes
          setTimeout(() => setActionMessage({ type: '', text: '' }), 3000);

      } catch (error) {
          console.error(`Erreur lors de la mise à jour de l'avis ${id}:`, error);
          setActionMessage({ type: 'error', text: error.message || "Erreur lors de la mise à jour." });
      }
  };


  // --- Fonctions approveReview et rejectReview modifiées pour appeler updateReview ---
  const approveReview = (id) => {
    updateReview(id, 'approved'); // Appelle la fonction générique avec le statut 'approved'
  };

  const rejectReview = (id) => {
     updateReview(id, 'rejected'); // Appelle la fonction générique avec le statut 'rejected'
  };


  // --- Rendu du contenu (inchangé sauf pour l'affichage du message d'action) ---
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return ( /* ... JSX du dashboard ... */ );

      case 'reviews':
        return (
          <div className="admin-reviews">
            <h2>{t('admin.reviews_management')}</h2>
            {/* Affichage des messages de succès/erreur pour les actions */}
            {actionMessage.text && (
              <p className={`action-message ${actionMessage.type}`} style={{ color: actionMessage.type === 'success' ? 'green' : 'red', marginBottom: '15px', fontWeight: 'bold' }}>
                {actionMessage.text}
              </p>
            )}
            <div className="review-actions">
              <button className="btn btn-primary" onClick={() => { /* ... generate link ... */ }}>
                {t('admin.generate_review_link')}
              </button>
            </div>
            <h3>{t('admin.pending_reviews')} ({isLoading ? '...' : pendingReviews.length})</h3>
            {fetchError && <p className="error-message" style={{color: 'red'}}>{fetchError}</p>}
            {isLoading ? (
              <div className="loading-spinner">{t('admin.loading')}</div>
            ) : (
              <div className="reviews-list">
                {pendingReviews.length === 0 && !fetchError ? (
                  <p className="no-reviews">{t('admin.no_pending_reviews')}</p>
                ) : (
                  pendingReviews.map(review => (
                    <div key={review._id} className="review-item">
                      {/* ... Affichage des détails de l'avis ... */}
                      <div className="review-header">...</div>
                      <p className="review-email">{review.email}</p>
                      <p className="review-date">...</p>
                      <p className="review-message">{review.message}</p>
                      <div className="review-actions">
                        {/* Les boutons appellent maintenant les fonctions mises à jour */}
                        <button className="btn btn-approve" onClick={() => approveReview(review._id)}>
                          {t('admin.approve')}
                        </button>
                        <button className="btn btn-reject" onClick={() => rejectReview(review._id)}>
                          {t('admin.reject')}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        );
      // ... autres cases pour les autres sections ...
      case 'content': return ( /* ... */ );
      case 'media': return ( /* ... */ );
      case 'settings': return <AuthenticationSettings />;
      case 'wordpress-sync': return <WordPressSync />;
      case 'marketing-integrations': return <MarketingIntegrations />;
      case 'wordpress': return <WordPressConnector />;
      case 'landing-pages': return <LandingPageGenerator />;
      default: return <div>Section non trouvée</div>;
    }
  };

  // --- Rendu JSX principal (inchangé) ---
  return (
    <div className={`admin-panel ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <AdminChatbot />
      <div className="admin-sidebar">
         {/* ... Sidebar JSX ... */}
      </div>
      <div className="admin-content-wrapper">
        {isMobile && ( <div className="admin-header">...</div> )}
        <div className="admin-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
