import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import '../../assets/styles/admin.css'; // Vérifie le chemin

// --- Ré-import de TOUS les composants des sections ---
import MarketingIntegrations from './MarketingIntegrations';
import WordPressConnector from './WordPressConnector';
import LandingPageGenerator from './LandingPageGenerator';
import AdminChatbot from './AdminChatbot'; // Assumant que c'est le composant flottant
import AuthenticationSettings from './AuthenticationSettings';
import WordPressSync from './WordPressSync';

const AdminPanel = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [pendingReviews, setPendingReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Chargement des avis
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [fetchError, setFetchError] = useState(null);

  // Détection taille écran
  useEffect(() => {
    const handleResize = () => {
      const mobileCheck = window.innerWidth < 768;
      setIsMobile(mobileCheck);
      if (!mobileCheck) {
        setSidebarCollapsed(false);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- Chargement des avis depuis l'API (Fonctionnel) ---
  useEffect(() => {
    const fetchPendingReviews = async () => {
      setIsLoading(true);
      setFetchError(null);
      const apiUrl = import.meta.env.VITE_API_URL;

      if (!apiUrl) {
        console.error("Erreur: VITE_API_URL non définie.");
        setFetchError("Erreur de configuration API.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${apiUrl}/reviews?status=pending`);
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Erreur HTTP ${response.status}: ${errorText}`);
          setFetchError(`Erreur ${response.status} serveur.`);
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
          setPendingReviews(data.data);
        } else {
          setFetchError("Format réponse API invalide.");
        }
      } catch (error) {
        console.error("Erreur fetch avis:", error);
        if (!fetchError) {
          setFetchError("Impossible de charger les avis.");
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchPendingReviews();
  }, []);

  // --- Fonctions (Logout, Approve/Reject (partiel), GenerateLink, ToggleSidebar) ---
  const handleLogout = () => {
    localStorage.removeItem('mdmc_admin_auth');
    window.location.href = '/admin';
  };

  const approveReview = (id) => {
    console.log(`Approve review ID: ${id}`);
    alert(`API call to APPROVE review ${id} not implemented yet.`);
    setPendingReviews(currentReviews => currentReviews.filter(review => review._id !== id));
  };

  const rejectReview = (id) => {
    console.log(`Reject review ID: ${id}`);
    alert(`API call to REJECT review ${id} not implemented yet.`);
    setPendingReviews(currentReviews => currentReviews.filter(review => review._id !== id));
  };

  const generateReviewLink = () => {
    const uniqueId = Math.random().toString(36).substring(2, 10);
    return `${window.location.origin}/review/${uniqueId}`;
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // --- Rendu du contenu avec TOUTES les sections ---
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        // Remettre ici le JSX complet et détaillé du dashboard si tu l'avais
        return (
          <div className="admin-dashboard">
            <h2>{t('admin.dashboard')}</h2>
            <div className="dashboard-stats">
              <div className="stat-card">
                <h3>{isLoading ? '...' : pendingReviews.length}</h3>
                <p>{t('admin.pending_reviews')}</p>
              </div>
              {/* Autres stats (simulées pour l'instant) */}
              <div className="stat-card"><h3>15</h3><p>{t('admin.approved_reviews')}</p></div>
              <div className="stat-card"><h3>3</h3><p>{t('admin.active_campaigns')}</p></div>
              <div className="stat-card"><h3>8</h3><p>{t('admin.total_campaigns')}</p></div>
            </div>
            <div className="recent-activity">
              <h3>{t('admin.recent_activity')}</h3>
              {/* Activité simulée */}
              <ul>
                <li><span className="activity-time">14:32</span> <span className="activity-text">{t('admin.new_review_received')}</span></li>
                <li><span className="activity-time">11:15</span> <span className="activity-text">{t('admin.content_updated')}</span></li>
                <li><span className="activity-time">09:45</span> <span className="activity-text">{t('admin.campaign_started')}</span></li>
              </ul>
            </div>
          </div>
        );
      case 'reviews': // Section Avis (fonctionnelle pour l'affichage)
        return (
          <div className="admin-reviews">
            <h2>{t('admin.reviews_management')}</h2>
            <div className="review-actions">
              <button className="btn btn-primary" onClick={() => {
                const link = generateReviewLink();
                navigator.clipboard.writeText(link);
                alert(t('admin.link_copied'));
              }}>
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
                      <div className="review-header">
                        <h4>{review.name}</h4>
                        <div className="review-rating">
                          {[...Array(5)].map((_, i) => (<span key={i} className={`star ${i < review.rating ? 'filled' : 'empty'}`}>★</span>))}
                        </div>
                      </div>
                      <p className="review-email">{review.email}</p>
                      <p className="review-date">Reçu le: {new Date(review.createdAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                      <p className="review-message">{review.message}</p>
                      <div className="review-actions">
                        <button className="btn btn-approve" onClick={() => approveReview(review._id)}>{t('admin.approve')}</button>
                        <button className="btn btn-reject" onClick={() => rejectReview(review._id)}>{t('admin.reject')}</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        );
      case 'content': // Section Contenu (structure de base)
        return (
          <div className="admin-content-section">
            <h2>{t('admin.content_management')}</h2>
            {/* Remettre ici le JSX détaillé pour l'éditeur de contenu */}
            <div className="content-editor">
              <div className="language-selector">
                 <label>{t('admin.select_language')}</label>
                 <select>
                   <option value="fr">{t('language.fr')}</option>
                   <option value="en">{t('language.en')}</option>
                   {/* ... autres langues ... */}
                 </select>
               </div>
               <div className="section-selector">
                 <label>{t('admin.select_section')}</label>
                 <select>
                   <option value="hero">{t('admin.section_hero')}</option>
                   {/* ... autres sections ... */}
                 </select>
               </div>
               <div className="content-fields">
                 {/* ... champs de formulaire ... */}
                 <button className="btn btn-primary">{t('admin.save_changes')}</button>
               </div>
            </div>
          </div>
        );
      case 'media': // Section Médias (structure de base)
        return (
          <div className="admin-media">
            <h2>{t('admin.media_management')}</h2>
            {/* Remettre ici le JSX détaillé pour l'upload et la galerie */}
            <div className="media-uploader">
               <div className="upload-zone">...</div>
               <div className="media-gallery">...</div>
             </div>
          </div>
        );
      // --- Sections utilisant des composants externes ---
      case 'settings':
        return <AuthenticationSettings />;
      case 'wordpress-sync':
        return <WordPressSync />;
      case 'marketing-integrations':
        return <MarketingIntegrations />;
      case 'wordpress':
        return <WordPressConnector />;
      case 'landing-pages':
        return <LandingPageGenerator />;
      default:
        return <div>Section non trouvée</div>;
    }
  };

  // --- Rendu JSX principal ---
  return (
    <div className={`admin-panel ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Chatbot flottant */}
      <AdminChatbot />

      {/* Barre latérale */}
      <div className="admin-sidebar">
        <div className="sidebar-header">
          <div className="admin-logo">
            <h1>MDMC</h1>
            <p>Admin</p>
          </div>
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            {sidebarCollapsed ? '→' : '←'}
          </button>
        </div>
        <div className="admin-nav">
          {/* --- Boutons de navigation (vérifier les icônes/classes) --- */}
          <button className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
             {/* Icône Dashboard */} <span className="nav-text">{t('admin.dashboard')}</span>
          </button>
          <button className={`nav-item ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveTab('reviews')}>
             {/* Icône Avis */}
             <span className="nav-text">
               {t('admin.reviews')}
               {!isLoading && pendingReviews.length > 0 && (<span className="badge">{pendingReviews.length}</span>)}
             </span>
          </button>
          <button className={`nav-item ${activeTab === 'content' ? 'active' : ''}`} onClick={() => setActiveTab('content')}>
             {/* Icône Contenu */} <span className="nav-text">{t('admin.content')}</span>
          </button>
          <button className={`nav-item ${activeTab === 'media' ? 'active' : ''}`} onClick={() => setActiveTab('media')}>
             {/* Icône Média */} <span className="nav-text">{t('admin.media')}</span>
          </button>
          <div className="nav-divider"></div>
          <button className={`nav-item ${activeTab === 'marketing-integrations' ? 'active' : ''}`} onClick={() => setActiveTab('marketing-integrations')}>
             {/* Icône Marketing */} <span className="nav-text">{t('admin.marketing_integrations')}</span>
          </button>
          <button className={`nav-item ${activeTab === 'wordpress' ? 'active' : ''}`} onClick={() => setActiveTab('wordpress')}>
             {/* Icône WP */} <span className="nav-text">{t('admin.wordpress_connector')}</span>
          </button>
          <button className={`nav-item ${activeTab === 'wordpress-sync' ? 'active' : ''}`} onClick={() => setActiveTab('wordpress-sync')}>
             {/* Icône Sync */} <span className="nav-text">{t('admin.wordpress_sync')}</span>
          </button>
          <button className={`nav-item ${activeTab === 'landing-pages' ? 'active' : ''}`} onClick={() => setActiveTab('landing-pages')}>
             {/* Icône LP */} <span className="nav-text">{t('admin.landing_pages')}</span>
          </button>
          <button className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
             {/* Icône Paramètres */} <span className="nav-text">{t('admin.settings')}</span>
          </button>
        </div>
        <div className="admin-logout">
          <button onClick={handleLogout}>
            {/* Icône Logout */} <span className="nav-text">{t('admin.logout')}</span>
          </button>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="admin-content-wrapper">
        {isMobile && (
          <div className="admin-header">
            <div className="header-left">
              <button className="mobile-menu-toggle" onClick={toggleSidebar}>
                {/* Icône Menu Mobile */}
              </button>
              <h1>MDMC Admin</h1>
            </div>
            <div className="admin-user">
              <div className="user-avatar">A</div> {/* Placeholder */}
            </div>
          </div>
        )}
        <div className="admin-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
