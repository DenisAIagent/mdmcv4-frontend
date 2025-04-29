// src/locales/fr.js

export const fr = {
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
      title: 'Ce que disent nos clients',
      subtitle: 'Témoignages d\'artistes et de labels',
      view_all: 'Voir tous les avis', // Clé pour le bouton "Voir tous les avis"
      submit_review: 'Laisser un avis', // Clé pour le bouton "Laisser un avis"
      // === Clés AJOUTÉES pour le formulaire d'avis ===
      form: {
        title: 'Laissez votre avis',
        name: 'Votre nom',
        // Ajoutez ici d'autres clés si nécessaire (ex: rating, comment, submit_button)
      }
      // ============================================
    },

    // Contact Section
    contact: {
      title: 'Contactez-nous', // Titre principal de la section
      partners: {
        title: 'Nos Partenaires', // Titre de la sous-section partenaires
        fmm: 'Fédération des Musiques Métalliques', // Utilisé pour alt et h4
        fmm_description: 'Partenaire officiel', // Exemple
        google: 'Google Partner', // Utilisé pour alt et h4
        google_description: 'Certification publicitaire', // Exemple
        mhl: 'MHL Agency & Co', // Utilisé pour alt et h4
        mhl_description: 'Agence partenaire marketing', // Exemple
        algorythme: 'Algorythme', // Utilisé pour alt et h4
        algorythme_description: 'Partenaire technologique' // Exemple
      },
      form: {
        platform_label: 'Plateforme principale ciblée', // AJOUTÉ/VÉRIFIÉ
        option_select: '-- Sélectionner --', // AJOUTÉ/VÉRIFIÉ
        platform_youtube: 'YouTube Ads', // AJOUTÉ/VÉRIFIÉ
        platform_meta: 'Meta Ads (Facebook/Instagram)', // AJOUTÉ/VÉRIFIÉ
        platform_tiktok: 'TikTok Ads', // AJOUTÉ/VÉRIFIÉ
        name: 'Nom complet', // Clé existante probable
        email: 'Adresse Email', // Clé existante probable
        message: 'Votre message', // Clé existante probable
        submit: 'Envoyer le message', // Clé existante probable
        submitting: 'Envoi en cours...', // AJOUTÉ/VÉRIFIÉ
        success: 'Message envoyé avec succès !', // AJOUTÉ/VÉRIFIÉ
        error: 'Une erreur s\'est produite. Veuillez réessayer.', // Peut être surchargé par l'API
        book_call: 'Réserver un appel', // AJOUTÉ/VÉRIFIÉ
      }
    },

    // Simulator Section
    simulator: {
      title: 'Simulateur de campagne', // Clé existante probable (bouton + titre modal)
      step1_label: 'Objectif Principal', // Exemple, adaptez si clé différente pour étape 1
      // === Clés AJOUTÉES pour le simulateur ===
      step2_label: 'Type de Campagne',
      step2_placeholder: 'Choisissez le type de campagne',
      step3_label: 'Budget Mensuel Estimé (€)', // Précision devise ajoutée
      step3_budget_placeholder: 'Entrez votre budget (ex: 500)', // Placeholder plus clair
      step4_label: 'Objectif Principal', // Répété ? Vérifiez si nécessaire
      step5_label: 'Vos Informations',
      step5_artist_label: 'Nom d\'artiste / Label',
      step5_artist_placeholder: 'Votre nom de scène ou label',
      step5_email_label: 'Votre Email',
      step5_email_placeholder: 'nom@exemple.com',
      button_prev: 'Précédent',
      button_next: 'Suivant', // Clé pour le bouton "Suivant" traduit
      button_show_results: 'Voir les résultats',
      // Ajoutez ici d'autres clés pour les options, les résultats, etc. si nécessaire
      // =========================================
    },

    // Footer (Exemple)
    footer: {
      description: 'Amplifiez votre musique avec MDMC Music Ads.',
      copyright: `© ${new Date().getFullYear()} MDMC Music Ads. Tous droits réservés.`,
      nav: {
        // Reprendre les clés de nav ou en définir de nouvelles si besoin
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

    // Ajoutez d'autres sections globales si nécessaire
  }
};
