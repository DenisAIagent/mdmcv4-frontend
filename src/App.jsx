import { useEffect, useRef, createRef } from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import './assets/styles/global.css';
import './assets/styles/animations.css';

// Import des composants
import Header from './components/layout/Header';
import Hero from './components/sections/Hero';
import Services from './components/sections/Services';
import About from './components/sections/About';
import Articles from './components/sections/Articles';
import Reviews from './components/sections/Reviews';
import Contact from './components/sections/Contact';
import Footer from './components/layout/Footer';
import Simulator from './components/features/Simulator';
import CookieBanner from './components/features/CookieBanner';
import AllReviews from './components/pages/AllReviews';
import AdminLogin from './components/admin/AdminLogin';
import AdminPanel from './components/admin/AdminPanel';

// Import de la configuration i18n
import { updateMetaTags } from './i18n';

// Composant pour la page d'accueil
const HomePage = ({ openSimulator }) => {
  // Animation des sections au défilement
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

// Vérification de l'authentification pour les routes protégées
const ProtectedRoute = ({ children }) => {
  // --- CORRECTION APPLIQUÉE ICI ---
  // Vérifie simplement si un token existe dans localStorage, plutôt que de vérifier s'il est égal à 'true'
  const isAuthenticated = !!localStorage.getItem('mdmc_admin_auth');
  // --- FIN DE LA CORRECTION ---

  if (!isAuthenticated) {
    // Si pas de token trouvé, redirige vers la page de login admin
    return <Navigate to="/admin" replace />;
  }

  // Si un token existe, affiche le composant enfant (AdminPanel)
  return children;
};

function App() {
  const { t, i18n } = useTranslation();
  const simulatorRef = createRef();

  // Mise à jour des balises meta lors du changement de langue
  useEffect(() => {
    updateMetaTags(t);

    // Mise à jour de l'attribut lang de la balise html
    const lang = i18n.language.split('-')[0];
    document.documentElement.setAttribute('lang', lang);

    // Mise à jour de la balise meta og:locale
    const ogLocaleValue = i18n.language.replace('-', '_');
    const ogLocaleElement = document.querySelector('meta[property="og:locale"]');
    if (ogLocaleElement) {
      ogLocaleElement.setAttribute('content', ogLocaleValue);
    }
  }, [t, i18n.language]);

  // Fonction pour ouvrir le simulateur
  const openSimulator = () => {
    if (simulatorRef.current) {
      simulatorRef.current.openSimulator();
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage openSimulator={openSimulator} />} />
        <Route path="/all-reviews" element={<AllReviews />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            // La route /admin/dashboard est protégée
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          }
        />
        {/* Redirige toutes les autres routes non définies vers la page d'accueil */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {/* Le simulateur est en dehors des Routes pour pouvoir être ouvert depuis n'importe où */}
      <Simulator ref={simulatorRef} />
    </Router>
  );
}

export default App;
