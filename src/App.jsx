// src/App.jsx

import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';

// Styles Globaux (Vérifie les chemins !)
import './App.css';
import './assets/styles/global.css';
import './assets/styles/animations.css';

// --- Services & Config ---
import apiService from './services/api.service'; // Chemin vers ton instance Axios configurée
import { updateMetaTags } from './i18n'; // Assure-toi que le chemin est correct

// --- Composants UI & Layout ---
import { CircularProgress, Box, Typography } from '@mui/material';
import Header from './components/layout/Header'; // Vérifie le chemin
import Footer from './components/layout/Footer'; // Vérifie le chemin
import Simulator from './components/features/Simulator'; // Vérifie le chemin
import CookieBanner from './components/features/CookieBanner'; // Vérifie le chemin

// --- Pages Publiques (Vérifie les chemins !) ---
import Hero from './components/sections/Hero';
import Services from './components/sections/Services';
import About from './components/sections/About';
import Articles from './components/sections/Articles';
import Reviews from './components/sections/Reviews';
import Contact from './components/sections/Contact';
import AllReviews from './components/pages/AllReviews'; // Vérifie le chemin

// --- Pages/Composants Admin (Vérifie les chemins !) ---
import AdminLogin from './components/admin/AdminLogin';
import AdminPanel from './components/admin/AdminPanel'; // Dashboard principal

// --- Pages Admin CRUD Artistes (Vérifie les chemins !) ---
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
        // Utilise la fonction getMe de ton service API
        const response = await apiService.auth.getMe(); // Attend { success: true, data: user }

        if (isMounted) {
          if (response.success && response.data) {
            console.log("ProtectedRoute: Auth check réussi", response.data);
            setAuthStatus({
              isLoading: false,
              isAuthenticated: true,
              isAdmin: response.data.role === 'admin', // Vérifie si l'utilisateur a le rôle 'admin'
            });
            if (response.data.role !== 'admin') {
              console.warn("ProtectedRoute: Utilisateur authentifié mais PAS admin.");
            }
          } else {
            // Ce cas est moins probable si l'API est bien conçue pour lancer une erreur
            // en cas de non-succès ou si la structure de la réponse n'est pas celle attendue.
            console.warn("ProtectedRoute: Auth check a renvoyé success:false ou data manquante (réponse API non conforme attendue).");
            setAuthStatus({ isLoading: false, isAuthenticated: false, isAdmin: false });
          }
        }
      } catch (error) { // L'erreur est déjà structurée par l'intercepteur Axios
        if (isMounted) {
          console.error("ProtectedRoute: Auth check API error:", error.status, error.message, error.data);
          setAuthStatus({ isLoading: false, isAuthenticated: false, isAdmin: false });
        }
      }
    };

    checkAuth();
    // Fonction de nettoyage pour éviter les mises à jour d'état sur un composant démonté
    return () => { isMounted = false; };
  }, [location.key]); // Se ré-exécute si location.key change (utile pour forcer la re-vérification lors de navigations)

  // Affiche un indicateur de chargement pendant la vérification
  if (authStatus.isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Vérification de l'accès...</Typography>
      </Box>
    );
  }

  // Si non authentifié OU non admin, redirige vers la page de login (/admin)
  if (!authStatus.isAuthenticated || !authStatus.isAdmin) {
    console.log(`ProtectedRoute: Redirection vers /admin (login). Auth: ${authStatus.isAuthenticated}, Admin: ${authStatus.isAdmin}`);
    // state={{ from: location }} permet de rediriger l'utilisateur vers la page qu'il essayait d'atteindre après le login.
    return <Navigate to="/admin" state={{ from: location }} replace />;
  }

  // Si authentifié ET admin, rend le contenu protégé (qui sera <AdminLayout />)
  return children;
};

// === Layout pour les Pages Admin ===
// Ce composant structure la partie administrative de ton application (ex: avec une sidebar)
const AdminLayout = () => {
  // TODO: Implémenter une vraie sidebar de navigation admin ici avec des liens
  // vers /admin/dashboard, /admin/artists, etc.
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Box component="nav" sx={{ width: { sm: 240 }, flexShrink: { sm: 0 }, bgcolor: 'background.paper', borderRight: 1, borderColor: 'divider' }}>
        <Typography variant="h6" sx={{ p: 2 }}>Menu Admin</Typography>
        {/* Exemple de liens (à remplacer par NavLink de react-router-dom et List/ListItem de MUI):
        <ul>
          <li><a href="/admin/dashboard">Dashboard</a></li>
          <li><a href="/admin/artists">Artistes</a></li>
        </ul>
        */}
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - 240px)` } }}
      >
        {/* <Toolbar /> // Décommente et utilise si tu as une AppBar MUI spécifique à l'admin */}
        <Outlet /> {/* C'est ici que les composants des sous-routes admin seront rendus */}
      </Box>
    </Box>
  );
};

// === Composant pour la Page d'Accueil Publique ===
const HomePage = ({ openSimulator }) => {
  useEffect(() => {
    console.warn("HomePage useEffect: La logique d'animation DOM directe (si présente) devrait être refactorisée en utilisant des approches React (refs, state, librairies d'animation).");
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

  // Gérer les meta tags et l'attribut lang de la page pour SEO et accessibilité
  useEffect(() => {
    updateMetaTags(t); // Assure-toi que cette fonction est bien définie et importée
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
      simulatorRef.current.openSimulator(); // Assure-toi que la méthode s'appelle bien openSimulator
    }
  };

  // Si tu utilises TanStack Query (React Query), tu devras envelopper <Router>
  // avec <QueryClientProvider client={queryClient}>
  // const queryClient = new QueryClient();

  return (
    // <QueryClientProvider client={queryClient}>
    <Router>
      <Simulator ref={simulatorRef} /> {/* Composant global, si nécessaire */}

      <Routes>
        {/* --- Routes Publiques --- */}
        <Route path="/" element={<HomePage openSimulator={openSimulator} />} />
        <Route path="/all-reviews" element={<AllReviews />} />
        {/* La page de login pour l'admin est une route publique */}
        <Route path="/admin" element={<AdminLogin />} />

        {/* --- Routes Admin Protégées --- */}
        {/* ProtectedRoute vérifie l'auth et le rôle admin.
            Si OK, il rend AdminLayout. AdminLayout contient un <Outlet />
            où les composants des sous-routes (AdminPanel, ArtistListPage, etc.) seront affichés. */}
        <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          {/* Route index : si un admin authentifié arrive sur /admin/ (improbable car /admin est le login),
              ou une route protégée sans sous-chemin, il est redirigé vers le dashboard.
              La redirection principale vers /admin/dashboard après login est gérée par AdminLogin.jsx. */}
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={<AdminPanel />} />
          
          {/* Routes Artistes */}
          <Route path="/admin/artists" element={<ArtistListPage />} />
          <Route path="/admin/artists/new" element={<ArtistCreatePage />} />
          <Route path="/admin/artists/edit/:slug" element={<ArtistEditPage />} /> {/* ou :id selon ton paramètre de route */}

          {/* Routes Smartlinks (décommentez et implémentez quand elles seront prêtes) */}
          {/* <Route path="/admin/smartlinks" element={<SmartlinkListPage />} /> */}
          {/* <Route path="/admin/smartlinks/new" element={<SmartlinkCreatePage />} /> */}
          {/* <Route path="/admin/smartlinks/edit/:id" element={<SmartlinkEditPage />} /> */}

          {/* Ajoutez d'autres routes spécifiques à l'administration ici */}
          {/* Exemple: <Route path="/admin/settings" element={<AdminSettingsPage />} /> */}
        </Route>

        {/* --- Route Catch-all (404 Not Found) --- */}
        {/* Redirige vers la page d'accueil si aucune autre route ne correspond.
            Tu pourrais aussi créer un composant NotFoundPage dédié. */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
    // </QueryClientProvider>
  );
}

export default App;
