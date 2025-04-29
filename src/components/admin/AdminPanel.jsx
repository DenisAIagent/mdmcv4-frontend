import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import '../../assets/styles/admin.css'; // Vérifie si ce chemin est correct
import MarketingIntegrations from './MarketingIntegrations'; // Assure-toi que ces composants existent au bon endroit
import WordPressConnector from './WordPressConnector';
import LandingPageGenerator from './LandingPageGenerator';
import AdminChatbot from './AdminChatbot';
import AuthenticationSettings from './AuthenticationSettings';
import WordPressSync from './WordPressSync';

const AdminPanel = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('dashboard'); // Onglet actif par défaut
  const [pendingReviews, setPendingReviews] = useState([]); // État pour stocker les avis récupérés
  const [isLoading, setIsLoading] = useState(true); // Pour l'indicateur de chargement
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  // Ajout d'un état pour les erreurs potentielles de fetch
  const [fetchError, setFetchError] = useState(null);

  // Détecter la taille de l'écran pour la responsivité de la sidebar
  useEffect(() => {
    const handleResize = () => {
      const mobileCheck = window.innerWidth < 768;
      setIsMobile(mobileCheck);
      if (!mobileCheck) { // Si on n'est plus en mobile, on déplie la sidebar par défaut
        setSidebarCollapsed(false);
      }
    };
    window.addEventListener('resize', handleResize);
    // Appel initial pour définir l'état au chargement
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- NOUVEAU useEffect pour charger les vrais avis depuis l'API ---
  useEffect(() => {
    const fetchPendingReviews = async () => {
      setIsLoading(true); // Démarre l'indicateur de chargement
      setFetchError(null); // Réinitialise les erreurs précédentes
      setPendingReviews([]); // Vide la liste précédente pendant le chargement
      const apiUrl = import.meta.env.VITE_API_URL; // Récupère l'URL de base de l'API backend

      // Vérifie si l'URL est définie
      if (!apiUrl) {
        console.error("Erreur: VITE_API_URL n'est pas définie dans les variables d'environnement du frontend.");
        setFetchError("Erreur de configuration : URL de l'API manquante.");
        setIsLoading(false);
        return;
      }

      try {
        console.log(`Appel API vers: ${apiUrl}/reviews?status=pending`); // Log pour vérifier l'URL appelée
        // Appelle l'API pour récupérer les avis avec le statut 'pending'
        const response = await fetch(`${apiUrl}/reviews?status=pending`);

        if (!response.ok) {
          // Si la réponse HTTP n'est pas OK (ex: 404, 500)
          const errorText = await response.text(); // Tente de lire le corps de l'erreur
          console.error(`Erreur HTTP ${response.status} lors de la récupération des avis: ${errorText}`);
          setFetchError(`Erreur ${response.status} du serveur lors du chargement des avis.`);
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json(); // Extrait les données JSON de la réponse

        if (data.success && Array.isArray(data.data)) {
          // Met à jour l'état avec les données reçues du backend
          setPendingReviews(data.data);
          console.log('Avis en attente chargés:', data.data); // Log pour vérifier
        } else {
          console.error('La réponse de l\'API n\'a pas le format attendu:', data);
          setFetchError("Format de réponse invalide reçu de l'API.");
        }

      } catch (error) {
        // Attrape les erreurs réseau (fetch échoué) ou les erreurs lancées manuellement
        console.error("Erreur lors du fetch des avis en attente:", error);
        if (!fetchError) { // N'écrase pas une erreur plus spécifique déjà définie
             setFetchError("Impossible de contacter le serveur pour charger les avis.");
        }
      } finally {
        setIsLoading(false); // Arrête l'indicateur de chargement (succès ou erreur)
      }
    };

    fetchPendingReviews(); // Appelle la fonction de fetch au montage du composant

  }, []); // Le tableau vide [] signifie que cet effet ne s'exécute qu'une fois au montage

  // --- Fin du NOUVEAU useEffect ---

  // Fonction pour se déconnecter (inchangée)
  const handleLogout = () => {
    localStorage.removeItem('mdmc_admin_auth'); // Adapte si le nom de la clé est différent
    window.location.href = '/admin'; // Redirige vers la page de login admin
  };

  // Fonction pour approuver un avis (logique API à ajouter)
  const approveReview = (id) => {
    console.log(`Approbation demandée pour l'avis ID: ${id}`);
    // --- LOGIQUE API MANQUANTE ---
    // Ici, il faudra appeler PUT /api/reviews/:id avec { status: 'approved' }
    // Puis, idéalement, rafraîchir la liste ou enlever l'élément de pendingReviews
    alert(`API call to APPROVE review ${id} not implemented yet.`);
    // Pour l'instant, on le retire de la liste pour simuler l'effet
    setPendingReviews(currentReviews => currentReviews.filter(review => review._id !== id)); // Utilise _id de MongoDB
  };

  // Fonction pour rejeter un avis (logique API à ajouter)
  const rejectReview = (id) => {
     console.log(`Rejet demandé pour l'avis ID: ${id}`);
    // --- LOGIQUE API MANQUANTE ---
    // Ici, il faudra appeler PUT /api/reviews/:id avec { status: 'rejected' }
    // Puis, idéalement, rafraîchir la liste ou enlever l'élément de pendingReviews
     alert(`API call to REJECT review ${id} not implemented yet.`);
     // Pour l'instant, on le retire de la liste pour simuler l'effet
     setPendingReviews(currentReviews => currentReviews.filter(review => review._id !== id)); // Utilise _id de MongoDB
  };

  // Fonction pour générer un lien d'avis (inchangée, logique locale/fictive)
  const generateReviewLink = () => {
    const uniqueId = Math.random().toString(36).substring(2, 10);
    return `${window.location.origin}/review/${uniqueId}`; // Adapte ce chemin si nécessaire
  };

  // Fonction pour basculer l'état de la barre latérale (inchangée)
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Rendu du contenu en fonction de l'onglet actif (inchangé, mais la section 'reviews' utilisera les données réelles)
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        // ... (contenu du dashboard inchangé, utilise peut-être des données simulées)
        return (
          <div className="admin-dashboard">
            <h2>{t('admin.dashboard')}</h2>
             {/* Note: Les stats ici sont toujours codées en dur */}
            <div className="dashboard-stats">
              <div className="stat-card">
                <h3>{pendingReviews.length}</h3> {/* On peut utiliser la longueur réelle */}
                <p>{t('admin.pending_reviews')}</p>
              </div>
               {/* Les autres stats sont encore simulées */}
              <div className="stat-card"><h3>15</h3><p>{t('admin.approved_reviews')}</p></div>
              <div className="stat-card"><h3>3</h3><p>{t('admin.active_campaigns')}</p></div>
              <div className="stat-card"><h3>8</h3><p>{t('admin.total_campaigns')}</p></div>
            </div>
             {/* L'activité récente est aussi simulée */}
            <div className="recent-activity">
               <h3>{t('admin.recent_activity')}</h3>
               <ul><li>...</li></ul>
             </div>
          </div>
        );

      case 'reviews':
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

            {/* Affiche une erreur si le fetch a échoué */}
            {fetchError && <p className="error-message" style={{color: 'red'}}>{fetchError}</p>}

            {/* Affiche un spinner pendant le chargement */}
            {isLoading ? (
              <div className="loading-spinner">{t('admin.loading')}</div>
            ) : (
              <div className="reviews-list">
                {/* Affiche un message si aucune donnée après chargement */}
                {pendingReviews.length === 0 && !fetchError ? (
                  <p className="no-reviews">{t('admin.no_pending_reviews')}</p>
                ) : (
                  // Affiche la liste des avis récupérés
                  pendingReviews.map(review => (
                    // Utilise review._id car c'est l'ID de MongoDB
                    <div key={review._id} className="review-item">
                      <div className="review-header">
                        <h4>{review.name}</h4>
                        <div className="review-rating">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={`star ${i < review.rating ? 'filled' : 'empty'}`}>★</span>
                          ))}
                        </div>
                      </div>
                      <p className="review-email">{review.email}</p>
                      {/* Formate la date pour être plus lisible */}
                      <p className="review-date">Reçu le: {new Date(review.createdAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                      <p className="review-message">{review.message}</p>
                      <div className="review-actions">
                         {/* Assure-toi que review._id est passé */}
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
      // Les autres cas restent inchangés et utilisent leurs propres composants/logiques
      case 'content': return (<div className="admin-content-section">...</div>); // Contenu simplifié pour l'exemple
      case 'media': return (<div className="admin-media">...</div>); // Contenu simplifié pour l'exemple
      case 'settings': return <AuthenticationSettings />;
      case 'wordpress-sync': return <WordPressSync />;
      case 'marketing-integrations': return <MarketingIntegrations />;
      case 'wordpress': return <WordPressConnector />;
      case 'landing-pages': return <LandingPageGenerator />;
      default: return <div>Section non trouvée</div>; // Message par défaut
    }
  };

  // Le JSX principal de AdminPanel reste globalement inchangé
  return (
    <div className={`admin-panel ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Le chatbot est probablement indépendant */}
      <AdminChatbot />
      {/* Barre latérale */}
      <div className="admin-sidebar">
         {/* ... (contenu de la sidebar : header, nav, logout - inchangé) ... */}
         <div className="sidebar-header">...</div>
         <div className="admin-nav">
             <button className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>...</button>
             <button className={`nav-item ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveTab('reviews')}>
                 {/* ... icone ... */}
                 <span className="nav-text">
                     {t('admin.reviews')}
                     {/* Affiche le nombre réel d'avis en attente dans le badge */}
                     {!isLoading && pendingReviews.length > 0 && (
                         <span className="badge">{pendingReviews.length}</span>
                     )}
                 </span>
             </button>
             {/* ... autres boutons de navigation ... */}
             <button className={`nav-item ${activeTab === 'content' ? 'active' : ''}`} onClick={() => setActiveTab('content')}>...</button>
             {/* ... etc ... */}
         </div>
         <div className="admin-logout">...</div>
       </div>
      {/* Wrapper pour le contenu principal */}
      <div className="admin-content-wrapper">
        {/* En-tête pour mobile (si nécessaire) */}
        {isMobile && ( <div className="admin-header">...</div> )}
        {/* Contenu dynamique rendu par renderContent() */}
        <div className="admin-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
