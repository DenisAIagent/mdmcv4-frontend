import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
// Supprimer l'import de Backend car non utilisé avec les ressources locales
// import Backend from 'i18next-http-backend';

// Import correct de l'export nommé TRANSLATIONS en l'aliasant en frTranslations
import { TRANSLATIONS as frTranslations } from './constants/translations';
// Les autres imports de langues peuvent rester commentés si vous ne les utilisez pas encore

// Langues supportées (vous pouvez les garder si vous prévoyez de les ajouter plus tard)
// const supportedLocales = ['fr-fr', 'en-us', 'es-es', 'pt-br'];
// const defaultLocale = 'fr-fr';

i18n
  // Module react-i18next
  .use(initReactI18next)
  // Détection automatique de la langue
  .use(LanguageDetector)
  // Initialisation
  .init({
    // Ressources préchargées
    resources: {
      // Utilisation de la variable frTranslations correctement importée
      fr: { translation: frTranslations },
      // Les autres langues restent commentées
      // en: { translation: enTranslations },
      // es: { translation: esTranslations },
      // pt: { translation: ptTranslations }
    },

    // Langue par défaut
    fallbackLng: 'fr',
    // lng: 'fr', // Vous pouvez décommenter ceci pour forcer le français si besoin

    // Détection de la langue
    detection: {
      order: ['navigator', 'querystring', 'htmlTag', 'path', 'cookie'],
      lookupFromPathIndex: 0,
      convertDetectedLanguage: (lng) => lng.split('-')[0],
      caches: ['cookie'],
      cookieExpirationDate: 365,
      cookieName: 'i18next',
      lookupQuerystring: 'lang',
      lookupBrowserLanguage: true,
      checkWhitelist: true // Assurez-vous que 'fr' est implicitement autorisé ou ajoutez une whitelist explicite si besoin
    },

    // Permet l'utilisation de clés imbriquées
    keySeparator: '.',

    // Namespace par défaut
    defaultNS: 'translation',

    // Interpolation
    interpolation: {
      escapeValue: false // React s'en charge déjà
    },

    // Debug (activé uniquement en développement)
    debug: process.env.NODE_ENV === 'development',

    // Réagir aux changements de langue
    react: {
      useSuspense: true, // Recommandé pour React >= 16.8
    }
  });

// Fonction pour mettre à jour les balises meta (inchangée)
export const updateMetaTags = (t) => {
  try {
    document.title = t('meta_title');
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', t('meta_description'));
    }
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', t('meta_title'));
    }
    if (ogDescription) {
      ogDescription.setAttribute('content', t('meta_description'));
    }
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

// Écouteurs d'événements (inchangés)
i18n.on('initialized', () => {
  // Vérifier si i18n.t est défini avant de l'utiliser
  if (typeof i18n.t === 'function') {
    updateMetaTags(i18n.t.bind(i18n));
  }
});

i18n.on('languageChanged', (lng) => {
   // Vérifier si i18n.t est défini avant de l'utiliser
  if (typeof i18n.t === 'function') {
    updateMetaTags(i18n.t.bind(i18n));
  }
});

export default i18n;
