import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// Import direct des traductions depuis le fichier JS
import frTranslations from './constants/translations';
// Commentez ou supprimez les autres imports
// import enTranslations from './locales/en.json';
// import esTranslations from './locales/es.json';
// import ptTranslations from './locales/pt.json';

// Langues supportées
const supportedLocales = ['fr-fr', 'en-us', 'es-es', 'pt-br'];
const defaultLocale = 'fr-fr';

i18n
  // Module react-i18next
  .use(initReactI18next)
  // Détection automatique de la langue
  .use(LanguageDetector)
  // Initialisation
  .init({
    // Ressources préchargées (obligatoire pour le déploiement)
    resources: {
      fr: { translation: frTranslations },
      // Commentez ou supprimez les autres langues
      // en: { translation: enTranslations },
      // es: { translation: esTranslations },
      // pt: { translation: ptTranslations }
    },
    
    // Langue par défaut
    fallbackLng: 'fr',
    lng: 'fr', // Forcer la langue française
    
    // Détection de la langue
    detection: {
      // Ordre des méthodes de détection
      order: ['navigator', 'querystring', 'htmlTag', 'path', 'cookie'],
      
      // Recherche de correspondance pour les codes de langue partiels
      lookupFromPathIndex: 0,
      
      // Conversion des codes de langue (ex: fr-FR -> fr)
      convertDetectedLanguage: (lng) => lng.split('-')[0],
      
      // Cache la langue détectée
      caches: ['cookie'],
      
      // Expiration du cookie (en jours)
      cookieExpirationDate: 365,
      
      // Nom du cookie
      cookieName: 'i18next',
      
      // Paramètre d'URL pour la langue
      lookupQuerystring: 'lang',
      
      // Détection plus précise de la langue du navigateur
      lookupBrowserLanguage: true,
      
      // Correspondance des codes de langue partiels
      checkWhitelist: true
    },
    
    // Permet l'utilisation de clés imbriquées
    keySeparator: '.',
    
    // Namespace par défaut
    defaultNS: 'translation',
    
    // Interpolation
    interpolation: {
      // Pas besoin d'échapper les valeurs HTML avec React
      escapeValue: false
    },
    
    // Debug
    debug: process.env.NODE_ENV === 'development',
    
    // Réagir aux changements de langue
    react: {
      useSuspense: true,
    }
  });

// Fonction pour mettre à jour les balises meta lors du changement de langue
export const updateMetaTags = (t) => {
  try {
    // Titre de la page
    document.title = t('meta_title');
    
    // Meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', t('meta_description'));
    }
    
    // Open Graph
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    
    if (ogTitle) {
      ogTitle.setAttribute('content', t('meta_title'));
    }
    
    if (ogDescription) {
      ogDescription.setAttribute('content', t('meta_description'));
    }
    
    // Twitter
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    
    if (twitterTitle) {
      twitterTitle.setAttribute('content', t('meta_title'));
    }
    
    if (twitterDescription) {
      twitterDescription.setAttribute('content', t('meta_description'));
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour des meta tags:', error);
  }
};

// Mettre à jour les meta tags lors du chargement et du changement de langue
i18n.on('initialized', () => {
  updateMetaTags(i18n.t.bind(i18n));
});

i18n.on('languageChanged', (lng) => {
  updateMetaTags(i18n.t.bind(i18n));
});

export default i18n;
