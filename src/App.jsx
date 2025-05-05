// src/App.jsx (Mis à jour avec ProtectedRoute corrigé et structure de routes admin)

import React, { useState, useEffect, useRef, createRef } from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom'; // Ajout de Outlet, useLocation
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
// Créez ces fichiers s'ils n'existent pas encore
import ArtistListPage from './pages/admin/artists/ArtistListPage';
import ArtistCreatePage from './pages/admin/artists/ArtistCreatePage';
import ArtistEditPage from './pages/admin/artists/ArtistEditPage';
// Importez ou créez les pages SmartLink si nécessaire
// import SmartlinkListPage from './pages/admin/smartlinks/SmartlinkListPage';
// import SmartlinkCreatePage from './pages/admin/smartlinks/SmartlinkCreatePage';
// import SmartlinkEditPage from './pages/admin/smartlinks/SmartlinkEditPage';

// === ProtectedRoute Corrigé (utilise l'API pour vérifier l'auth) ===
// Vous pouvez mettre ce composant dans son propre fichier si vous préférez
const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null = en cours, true = ok, false = non-ok
  const [isAdmin, setIsAdmin] = useState(false); // Pour vérifier le rôle
  const location = useLocation(); // Pour la redirection après login

  useEffect(() => {
    let isMounted = true; // Gère le cas où le composant est démonté avant la fin de l'appel API
    const checkAuth = async () => {
      // Réinitialise l'état au début de chaque vérification
      // setIsAuthenticated(null); // Peut causer un flash de chargement, à tester
      try {
        console.log("ProtectedRoute: Vérification auth via /api/auth/me...");
        const response = await apiService.getMe(); // Appel API réel
        // Le cookie HttpOnly est envoyé automatiquement grâce à withCredentials: true dans api.js

        if (isMounted && response.success && response.data) {
          // L'utilisateur est connecté ET on a ses infos
          console.log("ProtectedRoute: Auth check réussi", response.data);
          setIsAuthenticated(true);
          // Vérifie si l'utilisateur a le rôle 'admin'
          setIsAdmin(response.data.role === 'admin');
          if (response.data.role !== 'admin') {
              console.warn("ProtectedRoute: Utilisateur authentifié mais PAS admin.");
          }
        } else if (isMounted) {
           // L'API a répondu mais sans succès ou sans données utilisateur
           console.log("ProtectedRoute: Auth check échoué (API success:false ou pas de data).");
           setIsAuthenticated(false);
           setIsAdmin(false);
        }
      } catch (error) {
        // L'appel API a échoué (typiquement 401 si pas de cookie valide, ou 500)
        if (isMounted) {
           console.log("ProtectedRoute: Auth check échoué (Erreur API)", error.response?.status);
           setIsAuthenticated(false);
           setIsAdmin(false);
        }
      }
    };

    checkAuth();

    // Fonction de nettoyage pour éviter les mises à jour d'état si le composant est démonté
    return () => { isMounted = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key]); // Relance la vérification si l'URL change (utile dans certains cas)

  // Affiche un indicateur de chargement pendant la vérification initiale
  if (isAuthenticated === null) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress /> Vérification de l'accès...
      </Box>
    );
  }

  // Si l'utilisateur est authentifié ET admin, on affiche le contenu protégé (children)
  if (isAuthenticated && isAdmin) {
    return children;
  }

  // Si l'utilisateur n'est pas authentifié OU n'est pas admin, on redirige vers la page de login
  // On passe l'URL d'origine dans 'state' pour pouvoir y revenir après le login
  console.log(`ProtectedRoute: Redirection vers /admin. Auth: ${isAuthenticated}, Admin: ${isAdmin}`);
  return <Navigate to="/admin" state={{ from: location }} replace />;
};
// === Fin ProtectedRoute ===


// === Layout Admin (Optionnel mais recommandé) ===
// Ce composant contient les éléments communs aux pages admin (menu, sidebar, header...)
const AdminLayout = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      {/* Exemple: <AdminSidebar /> */}
      <Typography variant="h6" sx={{ p: 2, borderRight: 1, borderColor: 'divider', minWidth: 180 }}>Menu Admin</Typography>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {/* Les composants de page (ArtistListPage, etc.) seront affichés ici */}
        <Outlet />
      </Box>
    </Box>
  );
};
// === Fin AdminLayout ===


// === Composant HomePage (votre code existant) ===
const HomePage = ({ openSimulator }) => {
   useEffect(() => {
     const observer = new IntersectionObserver((entries) => {
       entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); } });
     }, { threshold: 0.1 });
     const sections = document.querySelectorAll('section');
     sections.forEach(section => { section.classList.add('section-fade-in'); observer.observe(section); });
     return () => { sections.forEach(section => { observer.unobserve(section); }); };
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

  // Effet pour les meta tags et lang (votre code existant)
  useEffect(() => {
    updateMetaTags(t);
    const lang = i18n.language.split('-')[0];
    document.documentElement.setAttribute('lang', lang);
    const ogLocaleValue = i18n.language.replace('-', '_');
    const ogLocaleElement = document.querySelector('meta[property="og:locale"]');
    if (ogLocaleElement) { ogLocaleElement.setAttribute('content', ogLocaleValue); }
  }, [t, i18n.language]);

  // Fonction pour ouvrir le simulateur (votre code existant)
  const openSimulator = () => {
    if (simulatorRef.current) { simulatorRef.current.openSimulator(); }
  };

  return (
    <Router>
      {/* Le simulateur reste global */}
      <Simulator ref={simulatorRef} />

      <Routes>
        {/* --- Routes Publiques --- */}
        <Route path="/" element={<HomePage openSimulator={openSimulator} />} />
        <Route path="/all-reviews" element={<AllReviews />} />
        <Route path="/admin" element={<AdminLogin />} /> {/* Page de Login Admin, publique */}

        {/* --- Routes Admin Protégées --- */}
        {/* La route parente applique ProtectedRoute ET AdminLayout */}
        <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
           {/* Les routes enfants héritent de la protection et du layout */}
           {/* Définissez ici TOUTES les pages de votre panel admin */}
           <Route path="/admin/dashboard" element={<AdminPanel />} />
           <Route path="/admin/artists" element={<ArtistListPage />} />
           <Route path="/admin/artists/new" element={<ArtistCreatePage />} />
           <Route path="/admin/artists/edit/:slugOrId" element={<ArtistEditPage />} />
           {/* Décommentez et importez les composants quand ils seront prêts */}
           {/* <Route path="/admin/smartlinks" element={<SmartlinkListPage />} /> */}
           {/* <Route path="/admin/smartlinks/new" element={<SmartlinkCreatePage />} /> */}
           {/* <Route path="/admin/smartlinks/edit/:id" element={<SmartlinkEditPage />} /> */}
           {/* Ajoutez d'autres routes admin ici (ex: /admin/settings, /admin/users...) */}

           {/* Optionnel: si on tape juste /admin/* sans chemin spécifique après login */}
           {/* <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} /> */}
        </Route> {/* Fin des routes protégées */}

        {/* --- Route Catch-all (404) --- */}
        <Route path="*" element={<Navigate to="/" replace />} /> {/* Redirige vers l'accueil si URL inconnue */}

      </Routes>
    </Router>
  );
}

export default App;
