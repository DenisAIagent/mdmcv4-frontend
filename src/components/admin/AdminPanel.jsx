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
  const [actionMessage, setActionMessage] = useState({ type: '', text: '' });

  // Détection taille écran (inchangé)
  useEffect(() => {
      const handleResize = () => {
          const mobileCheck = window.innerWidth < 768;
          setIsMobile(mobileCheck);
          if (!mobileCheck) { setSidebarCollapsed(false); }
      };
      window.addEventListener('resize', handleResize);
      handleResize();
      return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- Chargement des avis depuis l'API ---
  const fetchPendingReviews = async () => {
      setIsLoading(true);
      setFetchError(null);
      setActionMessage({ type: '', text: '' });
      const apiUrl = import.meta.env.VITE_API_URL;
      if (!apiUrl) { console.error("VITE_API_URL non définie"); setFetchError("Erreur config API."); setIsLoading(false); return; }
      try {
          const response = await fetch(`${apiUrl}/reviews?status=pending`);
          if (!response.ok) { const errorText = await response.text(); console.error(`Erreur HTTP ${response.status}: ${errorText}`); setFetchError(`Erreur ${response.status} serveur.`); throw new Error(`HTTP error! status: ${response.status}`); }
          const data = await response.json();
          if (data.success && Array.isArray(data.data)) { setPendingReviews(data.data); }
          else { setFetchError("Format réponse API invalide."); }
      } catch (error) { console.error("Erreur fetch avis:", error); if (!fetchError) { setFetchError("Impossible charger avis."); } }
      finally { setIsLoading(false); }
  };

  useEffect(() => {
    fetchPendingReviews();
  }, []);

  // --- Fonctions (Logout, GenerateLink, ToggleSidebar - inchangées) ---
  const handleLogout = () => { localStorage.removeItem('mdmc_admin_auth'); window.location.href = '/admin'; };
  const generateReviewLink = () => { const uniqueId = Math.random().toString(36).substring(2, 10); return `${window.location.origin}/review/${uniqueId}`; };
  const toggleSidebar = () => { setSidebarCollapsed(!sidebarCollapsed); };

  // --- Fonction pour mettre à jour le statut d'un avis (Appel API) ---
  const updateReview = async (id, newStatus) => {
      setActionMessage({ type: '', text: '' });
      const apiUrl = import.meta.env.VITE_API_URL;
      if (!apiUrl) { setActionMessage({ type: 'error', text: "Erreur config API." }); return; }
      const token = localStorage.getItem('mdmc_admin_auth'); // Adapte si clé différente
      const headers = { 'Content-Type': 'application/json', };
      if (token) { headers['Authorization'] = `Bearer ${token}`; }
      else { console.warn("Token manquant pour màj avis."); /* Gérer si route protégée */ }

      try {
          const response = await fetch(`${apiUrl}/reviews/${id}`, { method: 'PUT', headers: headers, body: JSON.stringify({ status: newStatus }) });
          if (!response.ok) { const errorData = await response.json().catch(() => ({ message: `Erreur serveur ${response.status}` })); throw new Error(errorData.message || `Erreur ${response.status}`); }
          const result = await response.json();
          setPendingReviews(currentReviews => currentReviews.filter(review => review._id !== id));
          setActionMessage({ type: 'success', text: `Avis ${newStatus === 'approved' ? 'approuvé' : 'rejeté'} !` });
          setTimeout(() => setActionMessage({ type: '', text: '' }), 3000);
      } catch (error) { console.error(`Erreur màj avis ${id}:`, error); setActionMessage({ type: 'error', text: error.message || "Erreur màj." }); }
  };

  const approveReview = (id) => { updateReview(id, 'approved'); };
  const rejectReview = (id) => { updateReview(id, 'rejected'); };

  // --- Rendu du contenu avec TOUTES les sections ---
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        // === JSX POUR LE DASHBOARD RESTAURÉ ===
        return (
          <div className="admin-dashboard">
            <h2>{t('admin.dashboard')}</h2>
            <div className="dashboard-stats">
              <div className="stat-card">
                <h3>{isLoading ? '...' : pendingReviews.length}</h3>
                <p>{t('admin.pending_reviews')}</p>
              </div>
              <div className="stat-card"><h3>15</h3><p>{t('admin.approved_reviews')}</p></div>
              <div className="stat-card"><h3>3</h3><p>{t('admin.active_campaigns')}</p></div>
              <div className="stat-card"><h3>8</h3><p>{t('admin.total_campaigns')}</p></div>
            </div>
            <div className="recent-activity">
              <h3>{t('admin.recent_activity')}</h3>
              <ul>
                <li><span className="activity-time">14:32</span> <span className="activity-text">{t('admin.new_review_received')}</span></li>
                <li><span className="activity-time">11:15</span> <span className="activity-text">{t('admin.content_updated')}</span></li>
                <li><span className="activity-time">09:45</span> <span className="activity-text">{t('admin.campaign_started')}</span></li>
              </ul>
            </div>
          </div>
        ); // <<< Point-virgule était manquant ici après la parenthèse fermante du return
        // === FIN JSX DASHBOARD ===

      case 'reviews':
        return (
          <div className="admin-reviews">
            <h2>{t('admin.reviews_management')}</h2>
            {actionMessage.text && ( <p className={`action-message ${actionMessage.type}`} style={{ color: actionMessage.type === 'success' ? 'green' : 'red', fontWeight: 'bold' }}>{actionMessage.text}</p> )}
            <div className="review-actions"> <button className="btn btn-primary" onClick={() => { const link = generateReviewLink(); navigator.clipboard.writeText(link); alert(t('admin.link_copied')); }}>{t('admin.generate_review_link')}</button> </div>
            <h3>{t('admin.pending_reviews')} ({isLoading ? '...' : pendingReviews.length})</h3>
            {fetchError && <p className="error-message" style={{color: 'red'}}>{fetchError}</p>}
            {isLoading ? ( <div className="loading-spinner">{t('admin.loading')}</div> ) : (
              <div className="reviews-list">
                {pendingReviews.length === 0 && !fetchError ? ( <p className="no-reviews">{t('admin.no_pending_reviews')}</p> ) : (
                  pendingReviews.map(review => (
                    <div key={review._id} className="review-item">
                      <div className="review-header"> <h4>{review.name}</h4> <div className="review-rating">{[...Array(5)].map((_, i) => (<span key={i} className={`star ${i < review.rating ? 'filled' : 'empty'}`}>★</span>))}</div> </div>
                      <p className="review-email">{review.email}</p>
                      <p className="review-date">Reçu le: {new Date(review.createdAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                      <p className="review-message">{review.message}</p>
                      <div className="review-actions"> <button className="btn btn-approve" onClick={() => approveReview(review._id)}>{t('admin.approve')}</button> <button className="btn btn-reject" onClick={() => rejectReview(review._id)}>{t('admin.reject')}</button> </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        );
      case 'content': return ( <div className="admin-content-section"> <h2>{t('admin.content_management')}</h2> {/* ... Structure JSX Content ... */} </div> );
      case 'media': return ( <div className="admin-media"> <h2>{t('admin.media_management')}</h2> {/* ... Structure JSX Media ... */} </div> );
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
