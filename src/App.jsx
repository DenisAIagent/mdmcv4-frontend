// src/App.jsx

import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';

// Styles Globaux (Vérifiez les chemins !)
import './App.css';
import './assets/styles/global.css';
import './assets/styles/animations.css';

// --- Services & Config ---
import apiService from './services/api.service'; // Chemin vers votre instance Axios configurée
import { updateMetaTags } from './i18n'; // Assurez-vous que le chemin est correct

// --- Composants UI & Layout ---
import { CircularProgress, Box, Typography } from '@mui/material';
import Header from './components/layout/Header'; // Vérifiez le chemin
import Footer from './components/layout/Footer'; // Vérifiez le chemin
import Simulator from './components/features/Simulator'; // Vérifiez le chemin
import CookieBanner from './components/features/CookieBanner'; // Vérifiez le chemin

// --- Pages Publiques (Vérifiez les chemins !) ---
import Hero from './components/sections/Hero';
import Services from './components/sections/Services';
import About from './components/sections/About';
import Articles from './components/sections/Articles';
import Reviews from './components/sections/Reviews';
import Contact from './components/sections/Contact';
import AllReviews from './components/pages/AllReviews'; // Vérifiez le chemin

// --- Pages/Composants Admin (Vérifiez les chemins !) ---
import AdminLogin from './components/admin/AdminLogin';
import AdminPanel from './components/admin/AdminPanel'; // Dashboard principal

// --- Pages Admin CRUD Artistes (Vérifiez les chemins !) ---
import ArtistListPage from './pages/admin/artists/ArtistListPage';
import ArtistCreatePage from './pages/admin/artists/ArtistCreatePage';
import ArtistEditPage from './pages/admin/artists/ArtistEditPage';

// --- Pages Admin CRUD Smartlinks (À créer et décommenter si nécessaire) ---
// import SmartlinkListPage from './pages/admin/smartlinks/SmartlinkListPage';
// import SmartlinkCreatePage from './pages/admin/smartlinks/SmartlinkCreatePage';
// import SmartlinkEditPage from './pages/admin/smartlinks/SmartlinkEditPage';

// === ProtectedRoute (Vérifie l'authentification via API) ===
const ProtectedRoute = ({ children }) => {
  const [authStatus, setAuthStatus] = useState({
    isLoading: true,
    isAuthenticated: false,
    isAdmin: false,
  });
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;
    const checkAuth = async () => {
      if (!isMounted) return;
      setAuthStatus(prev => ({ ...prev, isLoading: true }));
      try {
        console.log("ProtectedRoute: Vérification auth via apiService.auth.getMe()...");
        const response = await apiService.auth.getMe(); // Attend { success: true, data: user }

        if (isMounted) {
          if (response.success && response.data) {
            console.log("ProtectedRoute: Auth check réussi", response.data);
            setAuthStatus({
              isLoading: false,
              isAuthenticated: true,
              isAdmin: response.data.role === 'admin',
            });
            if (response.data.role !== 'admin') {
              console.warn("ProtectedRoute: Utilisateur authentifié mais PAS admin.");
            }
          } else {
            console.warn("ProtectedRoute: Auth check a renvoyé success:false ou data manquante.");
            setAuthStatus({ isLoading: false, isAuthenticated: false, isAdmin: false });
          }
        }
      } catch (error) { // L'erreur est déjà structurée par l'intercepteur Axios
        if (isMounted) {
          console.error("ProtectedRoute: Auth check API error:", error.status, error.message);
          setAuthStatus({ isLoading: false, isAuthenticated: false, isAdmin: false });
        }
      }
    };

    checkAuth();
    return () => { isMounted = false; };
  }, [location.key]); // location.key force une re-vérification si la clé de l'URL change (navigation "profonde")

  if (authStatus.isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Vérification de l'accès...</Typography>
      </Box>
    );
  }

  if (!authStatus.isAuthenticated || !authStatus.isAdmin) {
    console.log(`ProtectedRoute: Redirection vers /admin (login). Auth: ${authStatus.isAuthenticated}, Admin: ${authStatus.isAdmin}`);
    return <Navigate to="/admin" state={{ from: location }} replace />;
  }

  return children; // children sera <AdminLayout />
};

// === Layout pour les Pages Admin ===
const AdminLayout = () => {
  // TODO: Implémenter une vraie sidebar de navigation admin ici
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Box component="nav" sx={{ width: { sm: 240 }, flexShrink: { sm: 0 }, bgcolor: 'background.paper', borderRight: 1, borderColor: 'divider' }}>
        <Typography variant="h6" sx={{ p: 2 }}>Menu Admin</Typography>
        {/* Exemple de liens de navigation (à remplacer par vos NavLink réels) :
        <List>
          <ListItem button component={RouterLink} to="/admin/dashboard">
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem button component={RouterLink} to="/admin/artists">
            <ListItemText primary="Artistes" />
          </ListItem>
        </List>
        */}
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - 240px)` } }}
      >
        {/* <Toolbar /> // Si vous avez une AppBar MUI spécifique à l'admin */}
        <Outlet /> {/* C'est ici que les composants de page admin (AdminPanel, ArtistListPage, etc.) seront rendus */}
      </Box>
    </Box>
  );
};

// === Composant pour la Page d'Accueil Publique ===
const HomePage = ({ openSimulator }) => {
  useEffect(() => {
    // La manipulation DOM directe pour les animations devrait être refactorisée.
    // Idéalement, chaque section gère ses propres animations/observations.
    console.warn("HomePage useEffect: La logique d'animation DOM directe doit être refactorisée.");
  }, []);

  return (
    <>
      <Header /> {/* Header public */}
      <main>
        <Hero openSimulator={openSimulator} />
        <Services />
        <About />
        <Articles />
        <Reviews />
        <Contact />
      </main>
      <Footer openSimulator={openSimulator} /> {/* Footer public */}
      <CookieBanner />
    </>
  );
};

// === Composant Principal de l'Application ===
function App() {
  const { t, i18n } = useTranslation();
  const simulatorRef = useRef(null);

  // Gérer les meta tags et l'attribut lang de la page
  useEffect(() => {
    updateMetaTags(t); // Fonction à définir dans i18n.js ou un utilitaire SEO
    const lang = i18n.language.split('-')[0];
    document.documentElement.setAttribute('lang', lang);
    const ogLocaleValue = i18n.language.replace('-', '_');
    const ogLocaleElement = document.querySelector('meta[property="og:locale"]');
    if (ogLocaleElement) {
      ogLocaleElement.setAttribute('content', ogLocaleValue);
    }
  }, [t, i18n.language]);

  const openSimulator = () => {
    if (simulatorRef.current) {
      simulatorRef.current.openSimulator();
    }
  };

  // TODO: Si vous utilisez TanStack Query, enveloppez <Router> avec <QueryClientProvider client={queryClient}>
  // const queryClient = new QueryClient();

  return (
    // <QueryClientProvider client={queryClient}>
    <Router>
      <Simulator ref={simulatorRef} /> {/* Composant global */}

      <Routes>
        {/* --- Routes Publiques --- */}
        <Route path="/" element={<HomePage openSimulator={openSimulator} />} />
        <Route path="/all-reviews" element={<AllReviews />} />
        {/* La page de login pour l'admin est publique */}
        <Route path="/admin" element={<AdminLogin />} />

        {/* --- Routes Admin Protégées --- */}
        {/* ProtectedRoute vérifie l'auth et le rôle admin. Si OK, rend AdminLayout qui contient <Outlet /> */}
        <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          {/* Si un admin authentifié arrive sur une route de base comme /admin/ (improbable), redirige vers dashboard */}
          {/* AdminLogin gère la redirection vers /admin/dashboard après un login réussi. */}
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={<AdminPanel />} />
          
          {/* Routes Artistes */}
          <Route path="/admin/artists" element={<ArtistListPage />} />
          <Route path="/admin/artists/new" element={<ArtistCreatePage />} />
          <Route path="/admin/artists/edit/:slug" element={<ArtistEditPage />} /> {/* ou :id selon votre param */}

          {/* Routes Smartlinks (décommentez et implémentez si nécessaire) */}
          {/* <Route path="/admin/smartlinks" element={<SmartlinkListPage />} /> */}
          {/* <Route path="/admin/smartlinks/new" element={<SmartlinkCreatePage />} /> */}
          {/* <Route path="/admin/smartlinks/edit/:id" element={<SmartlinkEditPage />} /> */}

          {/* Ajoutez d'autres routes admin ici. Elles seront rendues dans l'<Outlet /> d'AdminLayout */}
          {/* Exemple: <Route path="/admin/settings" element={<AdminSettingsPage />} /> */}
        </Route>

        {/* --- Route Catch-all (404) --- */}
        {/* Redirige vers la page d'accueil si aucune autre route ne correspond */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
    // </QueryClientProvider>
  );
}

export default App;
