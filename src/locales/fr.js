// src/locales/fr.js

export default { // <<< CHANGEMENT ICI : export default au lieu de export const fr
  translation: {
    // Navigation Header
    nav: {
      home: 'Accueil',
      services: 'Services',
      about: 'À propos',
      articles: 'Articles',
      reviews: 'Avis', // Assurez-vous que cette clé est utilisée si vous avez un lien Avis
      contact: 'Contact',
    },

    // Hero Section
    hero: {
      title: 'Propulsez votre musique avec des campagnes publicitaires qui convertissent',
      slogan: 'PUSH. PLAY. BLOW UP.',
      description: 'Expertise en YouTube Ads, Meta Ads, TikTok Ads et stratégie de contenu pour artistes et labels.',
      stats: {
        campaigns: 'Campagnes réalisées',
        artists: 'Artistes accompagnés',
        views: 'M+ Vues générées', // M pour Millions
        countries: 'Pays couverts'
      }
    },

    // Services Section
    services: {
      title: 'Nos services',
      youtube: {
        title: 'YouTube Ads',
        description: 'Campagnes vidéo ciblées pour maximiser les vues et l\'engagement.'
      },
      meta: {
        title: 'Meta Ads',
        description: 'Stratégies Facebook et Instagram pour développer votre audience.'
      },
      tiktok: {
        title: 'TikTok Ads',
        description: 'Campagnes virales pour toucher la Génération Z et au-delà.'
      },
      content: {
        title: 'Stratégie de contenu',
        description: 'Création et optimisation de contenu qui convertit.'
      }
    },

    // About Section
    about: {
      title: 'À propos de nous',
      subtitle: 'Experts en Marketing Musical Digital', // Exemple
      description: 'Nous aidons les artistes et labels indépendants à naviguer le paysage digital complexe pour atteindre leur public cible et amplifier leur portée.', // Exemple
      advantages: {
        expertise: 'Expertise musicale et marketing combinée.', // Exemple
        campaigns: 'Campagnes publicitaires sur mesure et optimisées.', // Exemple
        targeting: 'Ciblage précis des audiences fans.', // Exemple
        analytics: 'Suivi et analyse des performances détaillés.' // Exemple
      }
    },

    // Articles Section (Exemple)
    articles: {
      title: 'Nos Derniers Articles',
      read_more: 'Lire la suite'
    },

    // Reviews Section
    reviews: {
      title: "Ce que disent nos clients",
      subtitle: "Témoignages d'artistes et de labels",
      view_all: 'Voir tous les avis',
      submit_review: 'Laisser un avis',
      // === Clés AJOUTÉES pour le formulaire d'avis ===
      form: {
        title: 'Laisse un avis',
        name: 'Votre nom'
        // Ajoutez ici d'autres clés si nécessaire (ex: rating, comment, submit_button)
      }
      // ============================================
    },

    // Contact Section
    contact: {
      title: "Contactez-nous", // Titre principal de la section
      partners: {
        title: "Nos Partenaires", // Titre de la sous-section partenaires
        fmm: 'Fédération des Musiques Métalliques',
        fmm_description: 'Partenaire officiel', // Exemple
        google: 'Google Partner',
        google_description: 'Certification publicitaire', // Exemple
        mhl: 'MHL Agency & Co',
        mhl_description: 'Agence partenaire marketing', // Exemple
        algorythme: 'Algorythme',
        algorythme_description: 'Partenaire technologique' // Exemple
      },
      form: {
        platform_label: 'Plateforme principale ciblée',
        option_select: '-- Sélectionner --',
        platform_youtube: 'YouTube Ads',
        platform_meta: 'Meta Ads (Facebook/Instagram)',
        platform_tiktok: 'TikTok Ads',
        name: 'Nom complet',
        email: 'Adresse Email',
        message: 'Votre message',
        submit: 'Envoyer le message',
        submitting: 'Envoi en cours...',
        success: 'Message envoyé avec succès !',
        error: 'Une erreur s\'est produite. Veuillez réessayer.', // Texte par défaut
        book_call: 'parler à un expert', // Mis à jour
      }
    },

    // Simulator Section
    simulator: {
      title: 'Simulateur de campagne',
      // === Clés AJOUTÉES/MISES A JOUR pour le simulateur ===
      step2_label: 'Type de Campagne',
      step2_placeholder: 'Choisissez le type de campagne',
      step3_label: 'Budget mensuel estimé',
      step3_budget_placeholder: 'Votre budget', // Ou 'Entrez votre budget...' ?
      step3_region_label: 'pays ciblés',
      step4_label: 'Pays cible',
      step5_label: 'Vos Informations',
      step5_artist_label: 'Nom d\'artiste / Label',
      step5_artist_placeholder: 'nom de l\'artiste',
      step5_email_label: 'Votre Email',
      step5_email_placeholder: 'votre email', // Ou 'nom@exemple.com' ?
      button_prev: 'précédent',
      button_next: 'Suivant', // Assurez-vous que cette clé est utilisée pour "Suivant"
      button_show_results: 'voir le résultat',
      // =========================================
    },

    // Footer (Exemple)
    footer: {
      description: 'Amplifiez votre musique avec MDMC Music Ads.',
      copyright: `© ${new Date().getFullYear()} MDMC Music Ads. Tous droits réservés.`,
      nav: {
        home: 'Accueil',
        services: 'Services',
        about: 'À propos',
        contact: 'Contact',
        privacy: 'Politique de confidentialité', // Exemple
        terms: 'Conditions d\'utilisation' // Exemple
      }
    },

    // Cookie Banner (Exemple)
    cookie_banner: {
      message: 'Ce site utilise des cookies pour améliorer votre expérience.',
      accept: 'Accepter',
      reject: 'Refuser',
      learn_more: 'En savoir plus'
    }
  }
}; // <<< FIN DU FICHIER
