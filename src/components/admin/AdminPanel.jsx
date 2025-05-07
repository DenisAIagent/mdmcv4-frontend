// src/components/admin/AdminPanel.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Dashboard as DashboardIcon,
  MusicNote as MusicNoteIcon,
  Link as LinkIcon,
  Settings as SettingsIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
} from '@mui/icons-material';
import '@/assets/styles/admin.css';
import { apiService } from '../../services/api.service';

// --- Importer les composants pour chaque section ---
// (Placeholders - remplacez par vos vrais imports)
const MarketingIntegrations = () => <section id="marketing-integrations" className="admin-marketing active"><h2>Intégrations Marketing</h2><p>Contenu...</p></section>;
const WordPressConnector = () => <section id="wordpress" className="admin-wordpress active"><h2>Connecteur WordPress</h2><p>Contenu...</p></section>;
const LandingPageGenerator = () => <section id="landing-pages" className="admin-landing-pages active"><h2>Pages de destination</h2><p>Contenu...</p></section>;
const AdminChatbot = () => <div className="admin-chatbot-placeholder" style={{position: 'fixed', bottom: '20px', right: '20px', width: '50px', height: '50px', background: '#e74c3c', borderRadius: '50%', zIndex: 1001}}></div>; // Placeholder
const AuthenticationSettings = () => <section id="settings" className="admin-settings active"><h2>Paramètres</h2><p>Contenu Authentication Settings...</p></section>;
const WordPressSync = () => <section id="wordpress-sync" className="admin-wordpress-sync active"><h2>Synchronisation WordPress</h2><p>Contenu...</p></section>;
const DashboardContent = ({ pendingReviewsCount, isLoading }) => ( // Composant séparé pour le dashboard
    <section id="dashboard" className="admin-dashboard active">
      <h2>Tableau de bord</h2>
      <div className="dashboard-stats">
        <div className="stat-card"><h3>{isLoading ? '...' : pendingReviewsCount}</h3><p>Avis en attente</p></div>
        <div className="stat-card"><h3>15</h3><p>Avis approuvés</p></div>
        <div className="stat-card"><h3>3</h3><p>Campagnes actives</p></div>
        <div className="stat-card"><h3>8</h3><p>Total campagnes</p></div>
      </div>
      <div className="recent-activity">
        <h3>Activité récente</h3>
        <ul>
          <li><span className="activity-time">14:32</span> <span className="activity-text">Nouvel avis reçu</span></li>
          <li><span className="activity-time">11:15</span> <span className="activity-text">Contenu mis à jour</span></li>
          <li><span className="activity-time">09:45</span> <span className="activity-text">Campagne démarrée</span></li>
        </ul>
      </div>
    </section>
);
const ReviewsContent = ({ pendingReviews, isLoading, error, approveReview, rejectReview, generateReviewLink, actionMessage }) => (
  <section id="reviews" className="admin-reviews active">
    <h2>{t('admin.reviews_management')}</h2>
    
    {actionMessage.text && (
      <div className={`action-message ${actionMessage.type}`}>
        {actionMessage.text}
      </div>
    )}

    <div className="review-actions">
      <button className="btn btn-primary" onClick={generateReviewLink}>
        {t('admin.generate_review_link')}
      </button>
    </div>

    <h3>{t('admin.pending_reviews')} ({isLoading ? '...' : pendingReviews.length})</h3>
    
    {error && <div className="error-message">{error}</div>}
    
    {isLoading ? (
      <div className="loading-spinner">{t('admin.loading')}</div>
    ) : (
      <div className="reviews-list">
        {pendingReviews.length === 0 && !error ? (
          <p className="no-reviews">{t('admin.no_pending_reviews')}</p>
        ) : (
          pendingReviews.map(review => (
            <div key={review._id} className="review-item">
              <div className="review-header">
                <h4>{review.name}</h4>
                <div className="review-rating">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`star ${i < review.rating ? 'filled' : ''}`}>
                      {i < review.rating ? <StarIcon /> : <StarBorderIcon />}
                    </span>
                  ))}
                </div>
              </div>
              <p className="review-email">{review.email}</p>
              <p className="review-date">
                {t('admin.received_on')}: {new Date(review.createdAt).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
              <p className="review-message">{review.message}</p>
              <div className="review-actions">
                <button 
                  className="btn btn-approve" 
                  onClick={() => handleReviewAction(review._id, 'approve')}
                >
                  {t('admin.approve')}
                </button>
                <button 
                  className="btn btn-reject" 
                  onClick={() => handleReviewAction(review._id, 'reject')}
                >
                  {t('admin.reject')}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    )}
  </section>
);
const GenericContent = ({ id, title }) => ( // Composant générique pour les sections non implémentées
    <section id={id} className={`${id} active`}>
      <h2>{title}</h2>
      <p>Contenu en cours de développement...</p>
    </section>
);


// Composants pour le module SmartLink
import SmartlinkListPage from '../../pages/admin/smartlinks/SmartlinkListPage';
import SmartlinkCreatePage from '../../pages/admin/smartlinks/SmartlinkCreatePage';
import SmartlinkEditPage from '../../pages/admin/smartlinks/SmartlinkEditPage';

const VITE_API_URL = import.meta.env.VITE_API_URL;

const AdminPanel = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [smartlinkView, setSmartlinkView] = useState('list');
  const [editingSmartlinkId, setEditingSmartlinkId] = useState(null);

  const [pendingReviews, setPendingReviews] = useState([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarVisible, setIsMobileSidebarVisible] = useState(false);
  const [fetchErrorReviews, setFetchErrorReviews] = useState(null);
  const [actionMessageReviews, setActionMessageReviews] = useState({ type: '', text: '' });
  const [stats, setStats] = useState({
    totalArtists: 0,
    totalSmartLinks: 0,
    totalReviews: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      const mobileCheck = window.innerWidth < 768;
      setIsMobileSidebarVisible(mobileCheck);
      if (!mobileCheck && isSidebarCollapsed && isMobileSidebarVisible) { 
        setIsSidebarCollapsed(false); 
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileSidebarVisible, isSidebarCollapsed]);

  const fetchPendingReviews = useCallback(async () => {
    if (!VITE_API_URL) { console.error("VITE_API_URL non définie"); setFetchErrorReviews("Erreur config API."); return; }
    setIsLoadingReviews(true);
    setFetchErrorReviews(null);
    try {
      const token = localStorage.getItem('mdmc_admin_auth');
      const headers = { 'Content-Type': 'application/json' };
      if (token) { headers['Authorization'] = `Bearer ${token}`; }

      const response = await fetch(`${VITE_API_URL}/reviews?status=pending`, { headers });
      if (!response.ok) { const errorText = await response.text(); throw new Error(`HTTP error! status: ${response.status}, ${errorText}`); }
      const data = await response.json();
      if (data.success && Array.isArray(data.data)) { setPendingReviews(data.data); }
      else { setFetchErrorReviews("Format réponse API invalide pour les avis."); }
    } catch (error) { console.error("Erreur fetch avis:", error); if (!fetchErrorReviews) { setFetchErrorReviews("Impossible charger avis."); } }
    finally { setIsLoadingReviews(false); }
  }, [t]); // Ajout de t comme dépendance si utilisé dans les messages d'erreur

  useEffect(() => {
    if (activeTab === 'reviews' || activeTab === 'dashboard') {
        fetchPendingReviews();
    }
  }, [activeTab, fetchPendingReviews]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [reviewsResponse, statsResponse] = await Promise.all([
        apiService.reviews.getPendingReviews(),
        apiService.getDashboardStats(),
      ]);
      setPendingReviews(reviewsResponse.data);
      setStats(statsResponse.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('mdmc_admin_auth');
    window.location.href = '/admin'; 
  };
  const generateReviewLink = () => { 
    const uniqueId = Math.random().toString(36).substring(2, 10); 
    const link = `${window.location.origin}/review/${uniqueId}`;
    navigator.clipboard.writeText(link).then(() => {
        alert(t('admin.link_copied'));
    }).catch(err => {
        console.error('Erreur copie lien:', err);
        alert(t('admin.link_copy_failed'));
    });
    return link;
  };
  const toggleSidebar = () => { setIsSidebarCollapsed(!isSidebarCollapsed); };

  const handleReviewAction = async (reviewId, action) => {
    try {
      setActionMessageReviews({ type: 'loading', text: t('admin.loading') });
      
      const response = await fetch(`${VITE_API_URL}/reviews/${reviewId}/${action}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('mdmc_admin_auth')}`
        }
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setPendingReviews(prev => prev.filter(review => review._id !== reviewId));
        setActionMessageReviews({ 
          type: 'success', 
          text: action === 'approve' ? t('admin.review_approved') : t('admin.review_rejected') 
        });
      } else {
        throw new Error(data.message || 'Erreur lors de la mise à jour de l\'avis');
      }
    } catch (err) {
      console.error('Erreur lors de la mise à jour de l\'avis:', err);
      setActionMessageReviews({ 
        type: 'error', 
        text: err.message || t('admin.review_update_error') 
      });
    }
  };

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
  };
  
  const handleChangeTab = (tabName) => {
    setActiveTab(tabName);
    if (tabName === 'smartlinks') {
        setSmartlinkView('list'); 
    }
    setEditingSmartlinkId(null);
  };

  // Rendu du contenu principal basé sur activeTab
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardContent pendingReviewsCount={pendingReviews.length} isLoading={isLoadingReviews} />;
      case 'reviews':
        return <ReviewsContent 
                  pendingReviews={pendingReviews} 
                  isLoading={isLoadingReviews} 
                  error={fetchErrorReviews}
                  approveReview={handleReviewAction}
                  rejectReview={handleReviewAction}
                  generateReviewLink={generateReviewLink}
                  actionMessage={actionMessageReviews}
                />;
      case 'smartlinks':
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
      case 'content': return <GenericContent id="content" title={t('admin.content_management')} />;
      case 'media': return <GenericContent id="media" title={t('admin.media_management')} />;
      case 'settings': return <section id="settings" className="admin-settings active"><AuthenticationSettings /></section>;
      case 'wordpress-sync': return <section id="wordpress-sync" className="admin-wordpress-sync active"><WordPressSync /></section>;
      case 'marketing-integrations': return <section id="marketing-integrations" className="admin-marketing active"><MarketingIntegrations /></section>;
      case 'wordpress': return <section id="wordpress" className="admin-wordpress active"><WordPressConnector /></section>;
      case 'landing-pages': return <section id="landing-pages" className="admin-landing-pages active"><LandingPageGenerator /></section>;
      default: return <section className="active"><div>Onglet "{activeTab}" non implémenté.</div></section>;
    }
  };

  if (loading) {
    return <div className="loading-spinner">{t('common.loading')}</div>;
  }

  if (fetchErrorReviews) {
    return <div className="error-message">{fetchErrorReviews}</div>;
  }

  return (
    <div className={`admin-panel ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Mobile Header */}
      <div className="admin-header">
        <button
          className="mobile-menu-toggle"
          onClick={() => setIsMobileSidebarVisible(!isMobileSidebarVisible)}
        >
          <MenuIcon />
        </button>
        <h1>{t('admin.title')}</h1>
      </div>

      {/* Sidebar */}
      <aside className={`admin-sidebar ${isMobileSidebarVisible ? 'mobile-sidebar-visible' : ''}`}>
        <div className="sidebar-header">
          <div className="admin-logo">
            <h1>MDMC</h1>
            <p>{t('admin.subtitle')}</p>
          </div>
          <button
            className="sidebar-toggle"
            onClick={toggleSidebar}
          >
            {isSidebarCollapsed ? <MenuIcon /> : <ChevronLeftIcon />}
          </button>
        </div>

        <nav className="admin-nav">
          {menuItems.map((item) => (
            <button
              key={item.path}
              className={`nav-item ${window.location.pathname === item.path ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              {item.icon}
              <span className="nav-text">{item.text}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="admin-content">
        {renderContent()}
      </main>

      {/* Chatbot Button */}
      <button className="admin-chatbot-placeholder">
        <span>💬</span>
      </button>
    </div>
  );
};

export default AdminPanel;
