// src/App.jsx (Mis à jour avec ProtectedRoute corrigé et structure de routes admin)

import React, { useState, useEffect, useRef, createRef } from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import './App.css';
import './assets/styles/global.css';
import './assets/styles/animations.css';

// --- Services & Config ---
import apiService from './services/api'; // Assurez-vous que ce chemin est correct
import { updateMetaTags } from './i18n';

// --- Composants UI & Layout ---
import { CircularProgress, Box } from '@mui/material'; // Pour l'indicateur de chargement
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Simulator from './components/features/Simulator';
import CookieBanner from './components/features/CookieBanner';

// --- Pages Publiques ---
import Hero from './components/sections/Hero';
import Services from './components/sections/Services';
import About from './components/sections/About';
import Articles from './components/sections/Articles';
import Reviews from './components/sections/Reviews';
import Contact from './components/sections/Contact';
import AllReviews from './components/pages/AllReviews';

// --- Pages/Composants Admin ---
import AdminLogin from './components/admin/AdminLogin';
import AdminPanel from './components/admin/AdminPanel'; // Dashboard principal ?
// Assurez-vous que ces chemins d'importation sont corrects pour vos pages admin
import ArtistListPage from './pages/admin/artists/ArtistListPage';
import ArtistCreatePage from './pages/admin/artists/ArtistCreatePage';
import ArtistEditPage from './pages/admin/artists/ArtistEditPage';
// Importez ou créez les pages SmartLink si nécessaire
// import SmartlinkListPage from './pages/admin/smartlinks/SmartlinkListPage';
// import SmartlinkCreatePage from './pages/admin/smartlinks/SmartlinkCreatePage';
// import SmartlinkEditPage from './pages/admin/smartlinks/SmartlinkEditPage';

// === ProtectedRoute Corrigé (utilise l'API pour vérifier l'auth) ===
const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null = en cours, true = ok, false = non-ok
  const [isAdmin, setIsAdmin] = useState(false); // Pour vérifier le rôle
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;
    const checkAuth = async () => {
      setIsAuthenticated(null); // Commence la vérification
      try {
        console.log("ProtectedRoute: Checking auth via /api/auth/me");
        const response = await apiService.getMe(); // Appel API réel
        // Le cookie est envoyé automatiquement par le navigateur
        if (isMounted && response.success && response.data) {
          console.log("ProtectedRoute: Auth check successful", response.data);
          setIsAuthenticated(true);
          // Vérifier le rôle pour l'accès admin
          setIsAdmin(response.data.role === 'admin');
        } else if (isMounted) {
           // Réponse succès false ou pas de données utilisateur
           console.log("ProtectedRoute: Auth check failed (API success false or no data)");
           setIsAuthenticated(false);
           setIsAdmin(false);
        }
      } catch (error) {
        // Échec de l'appel API (401, 500, etc.)
        if (isMounted) {
           console.log("ProtectedRoute: Auth check failed (API error)", error.response?.status);
           setIsAuthenticated(false);
           setIsAdmin(false);
        }
      }
    };

    checkAuth();

    return () => { isMounted = false; }; // Cleanup
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key]); // Re-vérifie quand la route change

  if (isAuthenticated === null) {
    // Affiche un chargement pendant la vérification
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress /> Vérification...
      </Box>
    );
  }

  // Si authentifié ET admin, affiche la page demandée
  if (isAuthenticated && isAdmin) {
    return children;
  }

  // Si authentifié mais PAS admin (ou si non authentifié) -> redirige vers login
  // (Vous pourriez vouloir une page "Accès Interdit" pour les non-admins authentifiés)
  console.log(`ProtectedRoute: Redirecting. Auth: ${isAuthenticated}, Admin: ${isAdmin}`);
  return <Navigate to="/admin" state={{ from: location }} replace />;
};
// === Fin ProtectedRoute ===


// === Layout Admin (Optionnel mais recommandé) ===
// Ce composant englobe toutes les pages admin et contient le menu/sidebar/header commun
const AdminLayout = () => {
  return (
    <Box sx={{ display: 'flex' }}> {/* Exemple avec MUI */}
      {/* Mettez ici votre Sidebar/Menu Admin commun */}
      {/* <AdminSidebar /> */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}> {/* Contenu principal */}
        {/* Le contenu de la route enfant sera rendu ici */}
        <Outlet />
      </Box>
    </Box>
  );
};
// === Fin AdminLayout ===


// === Composant HomePage (inchangé) ===
const HomePage = ({ openSimulator }) => {
  // ... (votre code existant pour HomePage avec les sections et l'effet d'animation)
   useEffect(() => {
     const observer = new IntersectionObserver((entries) => {
       entries.forEach(entry => {
         if (entry.isIntersecting) {
           entry.target.classList.add('visible');
         }
       });
     }, { threshold: 0.1 });

     const sections = document.querySelectorAll('section');
     sections.forEach(section => {
       section.classList.add('section-fade-in');
       observer.observe(section);
     });

     return () => {
       sections.forEach(section => {
         observer.unobserve(section);
       });
     };
   }, []);

  return (
    <>
      <Header />
      <main>
        <Hero openSimulator={openSimulator} />
        <Services />
        <About />
        <Articles />
        <Reviews />
        <Contact />
      </main>
      <Footer openSimulator={openSimulator} />
      <CookieBanner />
    </>
  );
};
// === Fin HomePage ===


// === Composant Principal App ===
function App() {
  const { t, i18n } = useTranslation();
  const simulatorRef = createRef();

  // Effet pour les meta tags et lang (inchangé)
  useEffect(() => {
    updateMetaTags(t);
    const lang = i18n.language.split('-')[0];
    document.documentElement.setAttribute('lang', lang);
    const ogLocaleValue = i18n.language.replace('-', '_');
    const ogLocaleElement = document.querySelector('meta[property="og:locale"]');
    if (ogLocaleElement) {
      ogLocaleElement.setAttribute('content', ogLocaleValue);
    }
  }, [t, i18n.language]);

  // Fonction pour ouvrir le simulateur (inchangée)
  const openSimulator = () => {
    if (simulatorRef.current) {
      simulatorRef.current.openSimulator();
    }
  };

  return (
    <Router>
      {/* Le simulateur reste en dehors pour être global */}
      <Simulator ref={simulatorRef} />

      <Routes>
        {/* --- Routes Publiques --- */}
        <Route path="/" element={<HomePage openSimulator={openSimulator} />} />
        <Route path="/all-reviews" element={<AllReviews />} />
        <Route path="/admin" element={<AdminLogin />} /> {/* Page de Login Admin */}

        {/* --- Routes Admin Protégées --- */}
        {/* Toutes les routes imbriquées ici nécessiteront une authentification admin */}
        {/* Elles utiliseront aussi AdminLayout pour l'affichage commun (menu, etc.) */}
        <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          {/* Le dashboard est souvent la page par défaut après /admin */}
          <Route path="/admin/dashboard" element={<AdminPanel />} />
          {/* Routes pour les Artistes */}
          <Route path="/admin/artists" element={<ArtistListPage />} />
          <Route path="/admin/artists/new" element={<ArtistCreatePage />} />
          <Route path="/admin/artists/edit/:slugOrId" element={<ArtistEditPage />} />
          {/* Routes pour les Smartlinks ( Ajoutez les imports des composants correspondants ) */}
          {/* <Route path="/admin/smartlinks" element={<SmartlinkListPage />} /> */}
          {/* <Route path="/admin/smartlinks/new" element={<SmartlinkCreatePage />} /> */}
          {/* <Route path="/admin/smartlinks/edit/:id" element={<SmartlinkEditPage />} /> */}

          {/* Ajoutez d'autres routes admin ici si nécessaire */}

          {/* Optionnel: Redirection si on arrive sur une route admin non spécifiée */}
          {/* <Route path="/admin/*" element={<Navigate to="/admin/dashboard" replace />} /> */}

        </Route> {/* Fin des routes protégées */}


        {/* --- Route Catch-all (404) --- */}
        {/* Si aucune route ci-dessus ne correspond, redirige vers l'accueil */}
        {/* Vous pourriez aussi avoir un composant PageNotFound ici */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
}

export default App;
