// src/components/admin/AdminPanel.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
// Assurez-vous que ce chemin est correct par rapport à l'emplacement de AdminPanel.jsx
// Si AdminPanel.jsx est dans src/components/admin/ et admin.css dans src/assets/styles/
// alors le chemin est '../../assets/styles/admin.css'
import '../../../assets/styles/admin.css'; 

// Importer les composants des sections
import MarketingIntegrations from './MarketingIntegrations'; // Assurez-vous que le chemin est correct
import WordPressConnector from './WordPressConnector';     // Assurez-vous que le chemin est correct
import LandingPageGenerator from './LandingPageGenerator'; // Assurez-vous que le chemin est correct
import AdminChatbot from './AdminChatbot';                 // Assurez-vous que le chemin est correct
import AuthenticationSettings from './AuthenticationSettings'; // Assurez-vous que le chemin est correct
import WordPressSync from './WordPressSync';             // Assurez-vous que le chemin est correct

// Composants pour le module SmartLink
// Adaptez ces chemins si AdminPanel.jsx n'est pas dans src/components/admin/
// Par exemple, si AdminPanel.jsx est à la racine de src/components/
// alors ce serait '../pages/admin/smartlinks/...'
import SmartlinkListPage from '../../pages/admin/smartlinks/SmartlinkListPage';
import SmartlinkCreatePage from '../../pages/admin/smartlinks/SmartlinkCreatePage';
import SmartlinkEditPage from '../../pages/admin/smartlinks/SmartlinkEditPage';

// Simuler apiService pour les reviews pour cet exemple si non centralisé
const VITE_API_URL = import.meta.env.VITE_API_URL;

const AdminPanel = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('dashboard'); // Onglet principal par défaut
  
  // États pour la sous-navigation de la section SmartLinks
  const [smartlinkView, setSmartlinkView] = useState('list'); // 'list', 'create', 'edit'
  const [editingSmartlinkId, setEditingSmartlinkId] = useState(null);

  const [pendingReviews, setPendingReviews] = useState([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [fetchErrorReviews, setFetchErrorReviews] = useState(null);
  const [actionMessageReviews, setActionMessageReviews] = useState({ type: '', text: '' });

  // Effet pour la gestion de la taille de l'écran et de la sidebar
  useEffect(() => {
    const handleResize = () => {
      const mobileCheck = window.innerWidth < 768;
      setIsMobile(mobileCheck);
      // Si on passe en mode desktop et que la sidebar était collapsée (pour mobile)
      if (!mobileCheck && sidebarCollapsed && isMobile) { 
        setSidebarCollapsed(false); 
      }
      // Optionnel: replier la sidebar par défaut sur mobile si elle n'est pas déjà gérée par CSS
      // else if (mobileCheck && !sidebarCollapsed) {
      //   setSidebarCollapsed(true); 
      // }
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Appel initial
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile, sidebarCollapsed]); // Mettre à jour si isMobile ou sidebarCollapsed change

  // Logique de chargement des données pour les reviews (exemple)
  const fetchPendingReviews = useCallback(async () => {
    if (!VITE_API_URL) { console.error("VITE_API_URL non définie"); setFetchErrorReviews("Erreur config API."); return; }
    setIsLoadingReviews(true);
    setFetchErrorReviews(null);
    try {
      const token = localStorage.getItem('mdmc_admin_auth'); // Ou votre méthode de récupération de token
      const headers = { 'Content-Type': 'application/json' };
      if (token) { headers['Authorization'] = `Bearer ${token}`; }

      const response = await fetch(`${VITE_API_URL}/reviews?status=pending`, { headers });
      if (!response.ok) { const errorText = await response.text(); throw new Error(`HTTP error! status: ${response.status}, ${errorText}`); }
      const data = await response.json();
      if (data.success && Array.isArray(data.data)) { setPendingReviews(data.data); }
      else { setFetchErrorReviews("Format réponse API invalide pour les avis."); }
    } catch (error) { console.error("Erreur fetch avis:", error); if (!fetchErrorReviews) { setFetchErrorReviews("Impossible charger avis."); } }
    finally { setIsLoadingReviews(false); }
  }, []); // useCallback pour éviter de recréer la fonction à chaque rendu

  useEffect(() => {
    if (activeTab === 'reviews') {
        fetchPendingReviews();
    }
    // Le dashboard pourrait avoir ses propres données à charger
    if (activeTab === 'dashboard') {
        // Exemple: fetchDashboardStats();
        // Pour l'instant, il affiche aussi les stats des reviews
        fetchPendingReviews();
    }
  }, [activeTab, fetchPendingReviews]); // fetchPendingReviews est maintenant une dépendance stable

  // Fonctions de gestion
  const handleLogout = () => {
    localStorage.removeItem('mdmc_admin_auth'); // Adaptez à votre système d'auth
    window.location.href = '/admin'; // Redirige vers la page de login admin
  };
  const generateReviewLink = () => { const uniqueId = Math.random().toString(36).substring(2, 10); navigator.clipboard.writeText(link); alert(t('admin.link_copied')); return `${window.location.origin}/review/${uniqueId}`; };
  const toggleSidebar = () => { setSidebarCollapsed(!sidebarCollapsed); };

  const updateReview = async (id, newStatus) => { /* ... votre logique ... */ };
  const approveReview = (id) => updateReview(id, 'approved');
  const rejectReview = (id) => updateReview(id, 'rejected');

  // Navigation interne pour SmartLinks
  const handleNavigateToCreateSmartlink = () => {
    setEditingSmartlinkId(null);
    setSmartlinkView('create');
  };
  const handleNavigateToEditSmartlink = (id) => {
    setEditingSmartlinkId(id);
    setSmartlinkView('edit');
  };
  const handleSmartlinkFormSuccess = () => {
    setSmartlinkView('list'); 
    setEditingSmartlinkId(null);
    // Vous pourriez vouloir rafraîchir la liste des smartlinks ici si SmartlinkListPage ne le fait pas
  };
  
  // Changement d'onglet principal
  const handleChangeTab = (tabName) => {
    setActiveTab(tabName);
    // Si on sélectionne l'onglet SmartLinks, s'assurer qu'on affiche la liste
    if (tabName === 'smartlinks') {
      setSmartlinkView('list');
    }
    setEditingSmartlinkId(null); // Réinitialiser l'ID d'édition en changeant d'onglet
  };

  // Rendu conditionnel du contenu principal
  const renderContent = () => {
    if (activeTab === 'dashboard') {
      return (
        <section id="dashboard" className="admin-dashboard active"> {/* Correspond à votre HTML */}
          <h2>{t('admin.dashboard')}</h2>
          <div className="dashboard-stats">
            <div className="stat-card"><h3>{isLoadingReviews ? '...' : pendingReviews.length}</h3><p>{t('admin.pending_reviews')}</p></div>
            <div className="stat-card"><h3>15</h3><p>{t('admin.approved_reviews')}</p></div>
            <div className="stat-card"><h3>3</h3><p>{t('admin.active_campaigns')}</p></div>
            <div className="stat-card"><h3>8</h3><p>{t('admin.total_campaigns')}</p></div>
          </div>
          <div className="recent-activity">
            <h3>{t('admin.recent_activity')}</h3>
            <ul>
              <li><span className="activity-time">14:32</span> <span className="activity-text">{t('admin.new_review_received')}</span></li>
              {/* ... autres activités ... */}
            </ul>
          </div>
        </section>
      );
    }
    if (activeTab === 'reviews') {
      return (
        <section id="reviews" className="admin-reviews active"> {/* Correspond à votre HTML */}
          <h2>{t('admin.reviews_management')}</h2>
          {actionMessageReviews.text && ( <p className={`action-message ${actionMessageReviews.type}`} style={{ color: actionMessageReviews.type === 'success' ? 'green' : 'red', fontWeight: 'bold' }}>{actionMessageReviews.text}</p> )}
          <div className="review-actions"> <button className="btn btn-primary" onClick={generateReviewLink}>{t('admin.generate_review_link')}</button> </div>
          <h3>{t('admin.pending_reviews')} ({isLoadingReviews ? '...' : pendingReviews.length})</h3>
          {fetchErrorReviews && <p className="error-message" style={{color: 'red'}}>{fetchErrorReviews}</p>}
          {isLoadingReviews ? ( <div className="loading-spinner">{t('admin.loading')}</div> ) : (
            <div className="reviews-list">
              {pendingReviews.length === 0 && !fetchErrorReviews ? ( <p className="no-reviews">{t('admin.no_pending_reviews')}</p> ) : (
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
        </section>
      );
    }
    if (activeTab === 'smartlinks') {
      // La section SmartLinks aura sa propre classe pour le style si besoin
      // Le `active` est géré par le fait que activeTab === 'smartlinks'
      return (
        <section id="smartlinks" className="admin-smartlinks active">
          {smartlinkView === 'create' && <SmartlinkCreatePage onFormSubmitSuccess={handleSmartlinkFormSuccess} />}
          {smartlinkView === 'edit' && editingSmartlinkId && <SmartlinkEditPage smartlinkId={editingSmartlinkId} onFormSubmitSuccess={handleSmartlinkFormSuccess} />}
          {smartlinkView === 'list' && (
            <SmartlinkListPage 
              onNavigateToCreate={handleNavigateToCreateSmartlink} 
              onNavigateToEdit={handleNavigateToEditSmartlink} 
            />
          )}
        </section>
      );
    }
    // Gérer les autres onglets de la même manière
    if (activeTab === 'content') return ( <section id="content" className="admin-content-section active"> <h2>{t('admin.content_management')}</h2> <p>Contenu pour la gestion de contenu...</p> </section> );
    if (activeTab === 'media') return ( <section id="media" className="admin-media active"> <h2>{t('admin.media_management')}</h2> <p>Contenu pour la gestion des médias...</p> </section> );
    if (activeTab === 'settings') return <section id="settings" className="admin-settings active"><AuthenticationSettings /></section>;
    if (activeTab === 'wordpress-sync') return <section id="wordpress-sync" className="admin-wordpress-sync active"><WordPressSync /></section>;
    if (activeTab === 'marketing-integrations') return <section id="marketing-integrations" className="admin-marketing active"><MarketingIntegrations /></section>;
    if (activeTab === 'wordpress') return <section id="wordpress" className="admin-wordpress active"><WordPressConnector /></section>;
    if (activeTab === 'landing-pages') return <section id="landing-pages" className="admin-landing-pages active"><LandingPageGenerator /></section>;
    
    return <section className="active"><div>Onglet "{activeTab}" non implémenté.</div></section>;
  };

  // JSX Principal qui imite votre structure HTML
  return (
    <div className={`admin-panel ${sidebarCollapsed && !isMobile ? 'sidebar-collapsed' : ''}`}> {/* Ajustement classe pour desktop */}
      <AdminChatbot />
      
      <nav className={`admin-sidebar ${isMobile && sidebarCollapsed ? 'mobile-sidebar-hidden' : isMobile && !sidebarCollapsed ? 'mobile-sidebar-visible' : ''}`}>
        <div className="sidebar-header">
          <div className="admin-logo"><h1>MDMC</h1><p>Admin</p></div>
          {!isMobile && ( // Ne pas afficher le toggle desktop si on est sur mobile
            <button className="sidebar-toggle" onClick={toggleSidebar} aria-label="Basculer la barre latérale">
              {sidebarCollapsed ? '→' : '←'}
            </button>
          )}
        </div>
        <div className="admin-nav">
          {/* Utiliser data-tab pour la sémantique, mais l'action est sur onClick */}
          <button className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => handleChangeTab('dashboard')} data-tab="dashboard">
            <svg width="24" height="24" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="9" rx="2" stroke="currentColor"/><rect x="14" y="3" width="7" height="5" rx="2" stroke="currentColor"/><rect x="14" y="12" width="7" height="9" rx="2" stroke="currentColor"/><rect x="3" y="16" width="7" height="5" rx="2" stroke="currentColor"/></svg>
            <span className="nav-text">{t('admin.dashboard')}</span>
          </button>
          <button className={`nav-item ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => handleChangeTab('reviews')} data-tab="reviews">
            <svg width="24" height="24" viewBox="0 0 24 24"><path d="M11.0489 3.92705C11.3483 3.00574 12.6517 3.00574 12.9511 3.92705L14.0206 7.21885C14.1545 7.63087 14.5385 7.90983 14.9717 7.90983H18.4329C19.4016 7.90983 19.8044 9.14945 19.0207 9.71885L16.2205 11.7533C15.8684 12.0079 15.7234 12.4593 15.8572 12.8713L16.9268 16.1631C17.2261 17.0844 16.1717 17.8506 15.388 17.2812L12.5878 15.2467C12.2356 14.9921 11.7644 14.9921 11.4122 15.2467L8.61204 17.2812C7.82833 17.8506 6.77385 17.0844 7.0732 16.1631L8.14277 12.8713C8.27665 12.4593 8.13162 12.0079 7.77946 11.7533L4.97926 9.71885C4.19555 9.14945 4.59834 7.90983 5.56712 7.90983H9.02832C9.46154 7.90983 9.8455 7.63087 9.97937 7.21885L11.0489 3.92705Z" stroke="currentColor"/></svg>
            <span className="nav-text">{t('admin.reviews')}{!isLoadingReviews && pendingReviews.length > 0 && (<> ({pendingReviews.length})</>)}</span>
          </button>
          <button className={`nav-item ${activeTab === 'smartlinks' ? 'active' : ''}`} onClick={() => handleChangeTab('smartlinks')} data-tab="smartlinks">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span className="nav-text">{t('admin.smartlinks_nav_button') || 'SmartLinks'}</span>
          </button>
          {/* ... autres boutons du menu ... */}
        </div>
        <div className="admin-logout">
          <button onClick={handleLogout} className="nav-item"> {/* Appliquer la classe nav-item pour le style */}
            <svg width="24" height="24" viewBox="0 0 24 24"><path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor"/><path d="M16 17L21 12L16 7" stroke="currentColor"/><path d="M21 12H9" stroke="currentColor"/></svg>
            <span className="nav-text">{t('admin.logout')}</span>
          </button>
        </div>
      </nav>
      
      <main className="admin-content-wrapper">
        {isMobile && (
          <header className="admin-header">
            <div className="header-left">
              <button className="mobile-menu-toggle" onClick={toggleSidebar} aria-label="Ouvrir/Fermer le menu">
                <svg width="24" height="24" viewBox="0 0 24 24"><path d="M3 12H21" stroke="currentColor"/><path d="M3 6H21" stroke="currentColor"/><path d="M3 18H21" stroke="currentColor"/></svg>
              </button>
              <h1>MDMC Admin</h1>
            </div>
            <div className="admin-user"><div className="user-avatar">A</div></div>
          </header>
        )}
        <div className="admin-content">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;
