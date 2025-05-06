// src/App.jsx (Mis à jour avec corrections et suggestions)

import React, { useState, useEffect, useRef } from 'react'; // Remplacé createRef par useRef
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import './App.css';
import './assets/styles/global.css'; // Assurez-vous que ce chemin est correct
import './assets/styles/animations.css'; // Assurez-vous que ce chemin est correct

// --- Services & Config ---
import apiService from './services/api.service'; // Chemin vers votre instance Axios configurée
import { updateMetaTags } from './i18n'; // Assurez-vous que le chemin est correct

// --- Composants UI & Layout ---
import { CircularProgress, Box, Typography } from '@mui/material'; // Ajout de Typography pour AdminLayout placeholder
import Header from './components/layout/Header';   // Vérifiez le chemin
import Footer from './components/layout/Footer';   // Vérifiez le chemin
import Simulator from './components/features/Simulator'; // Vérifiez le chemin
import CookieBanner from './components/features/CookieBanner'; // Vérifiez le chemin

// --- Pages Publiques ---
import Hero from './components/sections/Hero';       // Vérifiez le chemin
import Services from './components/sections/Services'; // Vérifiez le chemin
import About from './components/sections/About';     // Vérifiez le chemin
import Articles from './components/sections/Articles'; // Vérifiez le chemin
import Reviews from './components/sections/Reviews';   // Vérifiez le chemin
import Contact from './components/sections/Contact';   // Vérifiez le chemin
import AllReviews from './components/pages/AllReviews'; // Vérifiez le chemin

// --- Pages/Composants Admin ---
import AdminLogin from './components/admin/AdminLogin'; // Vérifiez le chemin
import AdminPanel from './components/admin/AdminPanel'; // Vérifiez le chemin (Dashboard principal)

// --- NOUVEAUX IMPORTS (Vérifiez les chemins !) ---
import ArtistListPage from './pages/admin/artists/ArtistListPage';
// Assurez-vous que ces fichiers existent aux chemins indiqués :
import ArtistCreatePage from './pages/admin/artists/ArtistCreatePage'; // À CRÉER (Wrapper pour ArtistForm)
import ArtistEditPage from './pages/admin/artists/ArtistEditPage';     // À CRÉER (Wrapper pour ArtistForm + fetch data)
// --- Imports Smartlinks (à décommenter et créer) ---
// import SmartlinkListPage from './pages/admin/smartlinks/SmartlinkListPage';     // À CRÉER
// import SmartlinkCreatePage from './pages/admin/smartlinks/SmartlinkCreatePage'; // À CRÉER (Wrapper pour SmartLinkForm)
// import SmartlinkEditPage from './pages/admin/smartlinks/SmartlinkEditPage';     // À CRÉER (Wrapper pour SmartLinkForm + fetch data)
// --- Composant Sidebar/Layout Admin réel (à créer/importer) ---
// import AdminSidebar from './components/layout/AdminSidebar'; // Exemple

// === ProtectedRoute (vérifie l'authentification via API) ===
const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null = en cours, true = ok, false = non-ok
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;
    const checkAuth = async () => {
      // Note: L'état est seulement réinitialisé au montage ou changement de location.key
      // Si le token expire pendant la session, il faudra gérer cela (ex: intercepteur Axios)
      try {
        console.log("ProtectedRoute: Vérification auth via /api/auth/me...");
        const response = await apiService.getMe(); // Utilise apiService

        if (isMounted) {
          if (response.success && response.data) {
            console.log("ProtectedRoute: Auth check réussi", response.data);
            setIsAuthenticated(true);
            setIsAdmin(response.data.role === 'admin'); // Vérifie le rôle 'admin'
            if (response.data.role !== 'admin') {
              console.warn("ProtectedRoute: Utilisateur authentifié mais PAS admin.");
            }
          } else {
            console.log("ProtectedRoute: Auth check échoué (API success:false ou data manquante).");
            setIsAuthenticated(false);
            setIsAdmin(false);
          }
        }
      } catch (error) {
        if (isMounted) {
          console.error("ProtectedRoute: Auth check échoué (Erreur API)", error.response?.status, error.message);
          setIsAuthenticated(false);
          setIsAdmin(false);
          // TODO: Peut-être afficher une notification d'erreur spécifique ?
        }
      }
    };

    checkAuth();

    return () => { isMounted = false; };
  // Suggestion: Remplacer [location.key] par [] si l'état auth est géré globalement (Zustand)
  // pour éviter les appels API inutiles à chaque navigation interne admin.
  }, [location.key]);

  if (isAuthenticated === null) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Vérification de l'accès...</Typography>
      </Box>
    );
  }

  // Redirige vers le login si non authentifié OU non admin
  if (!isAuthenticated || !isAdmin) {
    console.log(`ProtectedRoute: Redirection vers /admin requis. Auth: ${isAuthenticated}, Admin: ${isAdmin}`);
    return <Navigate to="/admin" state={{ from: location }} replace />;
  }

  // Si authentifié ET admin, affiche le contenu protégé
  return children;
};
// === Fin ProtectedRoute ===


// === Layout Admin (Placeholder Amélioré) ===
// TODO: Remplacer par votre composant de layout admin réel (ex: avec Sidebar, AppBar MUI)
const AdminLayout = () => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* <AdminSidebar /> */} {/* Placeholder pour la barre latérale réelle */}
      <Box component="nav" sx={{ width: { sm: 240 }, flexShrink: { sm: 0 }, bgcolor: 'background.paper', borderRight: 1, borderColor: 'divider' }}>
          {/* Contenu de la Sidebar ici (Liens, etc.) */}
          <Typography variant="h6" sx={{ p: 2 }}>Menu Admin</Typography>
          {/* Mettez ici vos NavLink ou ListItems pour la navigation admin */}
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - 240px)` } }}
      >
         {/* TODO: Ajouter une Toolbar ou AppBar si le header admin est différent du public */}
         {/* <Toolbar /> */}
        {/* Outlet rendra le composant de la route enfant (ArtistListPage, etc.) */}
        <Outlet />
      </Box>
    </Box>
  );
};
// === Fin AdminLayout ===


// === Composant HomePage (Logique DOM à refactoriser) ===
const HomePage = ({ openSimulator }) => {
   // TODO: La logique ci-dessous utilise une manipulation directe du DOM.
   // Il est préférable de gérer les animations/observations au niveau des composants
   // de section individuels (Hero, Services, etc.) en utilisant l'état React,
   // des refs, ou des librairies d'animation comme Framer Motion.
   useEffect(() => {
     console.warn("HomePage useEffect: La manipulation DOM directe doit être refactorisée en logique React.");
     // const observer = new IntersectionObserver((entries) => {
     //   entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); } });
     // }, { threshold: 0.1 });
     // const sections = document.querySelectorAll('section');
     // sections.forEach(section => { section.classList.add('section-fade-in'); observer.observe(section); });
     // return () => { sections.forEach(section => { observer.unobserve(section); }); };
   }, []);

  return (
    <>
      {/* Utilise les composants Header/Footer publics */}
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
  const simulatorRef = useRef(null); // Corrigé: Utilisation de useRef

  // Effet pour les meta tags et lang (Inchangé)
  useEffect(() => {
    updateMetaTags(t);
    const lang = i18n.language.split('-')[0];
    document.documentElement.setAttribute('lang', lang);
    const ogLocaleValue = i18n.language.replace('-', '_');
    const ogLocaleElement = document.querySelector('meta[property="og:locale"]');
    if (ogLocaleElement) { ogLocaleElement.setAttribute('content', ogLocaleValue); }
  }, [t, i18n.language]);

  // Fonction pour ouvrir le simulateur (Inchangé)
  const openSimulator = () => {
    if (simulatorRef.current) { simulatorRef.current.openSimulator(); }
  };

  return (
    // TODO: Intégrer QueryClientProvider ici si vous utilisez TanStack Query
    // <QueryClientProvider client={queryClient}>
      <Router>
        {/* Le simulateur reste global */}
        <Simulator ref={simulatorRef} />

        <Routes>
          {/* --- Routes Publiques --- */}
          <Route path="/" element={<HomePage openSimulator={openSimulator} />} />
          <Route path="/all-reviews" element={<AllReviews />} />
          {/* TODO: Ajouter la route publique pour les pages artistes */}
          {/* <Route path="/artists/:slug" element={<ArtistPublicPage />} /> */}
          <Route path="/admin" element={<AdminLogin />} /> {/* Page de Login */}

          {/* --- Routes Admin Protégées --- */}
          <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            {/* Les composants sont rendus via <Outlet /> dans AdminLayout */}
            <Route path="/admin/dashboard" element={<AdminPanel />} />
            {/* --- Routes Artistes --- */}
            <Route path="/admin/artists" element={<ArtistListPage />} />
            <Route path="/admin/artists/new" element={<ArtistCreatePage />} />
            <Route path="/admin/artists/edit/:slug" element={<ArtistEditPage />} /> {/* Utilisez :slug si c'est le param */}

            {/* --- Routes Smartlinks (À décommenter quand prêtes) --- */}
            {/* <Route path="/admin/smartlinks" element={<SmartlinkListPage />} /> */}
            {/* <Route path="/admin/smartlinks/new" element={<SmartlinkCreatePage />} /> */}
            {/* <Route path="/admin/smartlinks/edit/:id" element={<SmartlinkEditPage />} /> */}

            {/* Ajoutez d'autres routes admin ici */}
            {/* <Route path="/admin/settings" element={<SettingsPage />} /> */}

            {/* Redirection optionnelle si /admin est accédé directement après login */}
            <Route index element={<Navigate to="/admin/dashboard" replace />} /> {/* Ajouté index route */}
          </Route> {/* Fin des routes protégées */}

          {/* --- Route Catch-all (404) --- */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </Router>
    // </QueryClientProvider>
  );
}

export default App;
