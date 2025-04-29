// src/locales/fr.js - VERSION FINALE CORRIGÉE
export default {
  "meta_title": "MDMC Music Ads - Marketing musical qui convertit",
  "meta_description": "Agence spécialisée en marketing musical. Expertise en YouTube Ads, Meta Ads, TikTok Ads et stratégie de contenu pour artistes et labels.",
  "language": {
    "fr": "Français",
    "en": "Anglais",
    "es": "Espagnol",
    "pt": "Portugais"
  },
  "nav": {
    "home": "Accueil",
    "services": "Services",
    "about": "À propos",
    "articles": "Articles",
    "contact": "Contact"
  },
  "header": {
    "home": "Accueil",
    "services": "Services",
    "about": "À propos",
    "contact": "Contact",
    "reviews": "Avis",
    "simulator": "Simulateur"
  },
  "hero": {
    "title": "Propulsez votre musique avec des campagnes publicitaires qui convertissent",
    "subtitle": "Push. Play. Blow up.",
    "slogan": "Push. Play. Blow up.",
    "description": "Expertise en YouTube Ads, Meta Ads, TikTok Ads et stratégie de contenu pour artistes et labels.",
    "cta": "Démarrer le simulateur",
    "stats": {
      "campaigns": "Campagnes réalisées",
      "artists": "Artistes accompagnés",
      "views": "Vues générées",
      "countries": "Pays couverts"
    }
  },
  "simulator": {
    "title": "Simulateur de campagne",
    "subtitle": "Découvrez combien vous pourriez gagner",
    "step1": { // Utilisé par la structure de votre en.js, gardé pour référence
      "title": "Quel est votre objectif principal ?",
      "option1": "Augmenter les streams",
      "option2": "Vendre des produits dérivés",
      "option3": "Promouvoir un concert/événement",
      "option4": "Développer ma communauté"
    },
    "step2": { // Utilisé par la structure de votre en.js, gardé pour référence
      "title": "Quel est votre budget mensuel ?",
      "option1": "500€ - 1000€",
      "option2": "1000€ - 3000€",
      "option3": "3000€ - 5000€",
      "option4": "5000€+"
    },
    "step3": { // Utilisé par la structure de votre en.js, gardé pour référence
      "title": "Quel est votre genre musical ?",
      "option1": "Pop",
      "option2": "Hip-Hop/Rap",
      "option3": "Électronique",
      "option4": "Rock/Métal",
      "option5": "R&B/Soul",
      "option6": "Autre"
    },
    "step4": { // Utilisé par la structure de votre en.js, gardé pour référence
      "title": "Où est basée votre audience principale ?",
      "option1": "France",
      "option2": "Europe",
      "option3": "Amérique du Nord",
      "option4": "Mondial"
    },
    "step5": { // Utilisé par la structure de votre en.js, gardé pour référence
      "title": "Avez-vous déjà fait de la publicité en ligne ?",
      "option1": "Jamais",
      "option2": "Quelques campagnes",
      "option3": "Régulièrement",
      "option4": "Expert"
    },
    "step6": { // Utilisé par la structure de votre en.js, gardé pour référence
      "title": "Voici votre estimation personnalisée",
      "roi_title": "ROI estimé",
      "monthly_streams": "Streams mensuels potentiels",
      "monthly_sales": "Ventes mensuelles potentielles",
      "ticket_sales": "Ventes de billets potentielles",
      "followers_growth": "Croissance d'abonnés potentielle",
      "cta": "Parler avec un expert",
      "disclaimer": "Ces chiffres sont des estimations basées sur nos données historiques et peuvent varier en fonction de nombreux facteurs."
    },
    // === CLÉS AJOUTÉES/MISES A JOUR POUR CORRESPONDRE AU JSX DE SIMULATOR.JSX ===
    step1_title: "Quel est votre objectif principal ?", // Pour H3 Étape 1
    step1_platform_label: "Plateforme publicitaire", // Pour label Étape 1
    option_select: "-- Sélectionner --", // Pour select
    platform_youtube: "YouTube Ads", // Pour select
    platform_meta: "Meta Ads (Facebook/Instagram)", // Pour select
    platform_tiktok: "TikTok Ads", // Pour select
    platform_error: "Veuillez sélectionner une plateforme.", // Pour validation

    step2_title: "Étape 2 : Type de Campagne", // Pour H3 Étape 2
    step2_label: "Choisissez le type de campagne", // Pour label Étape 2
    step2_placeholder: "Choisissez le type de campagne", // Placeholder Étape 2 (si besoin)
    campaignType_awareness: "Awareness (Notoriété)", // Option select Étape 2
    campaignType_engagement: "Engagement", // Option select Étape 2
    campaignType_conversion: "Conversion", // Option select Étape 2
    campaignType_error: "Veuillez sélectionner un type de campagne.", // Pour validation

    step3_title: "Étape 3 : Budget Mensuel Estimé", // Pour H3 Étape 3
    step3_label: 'Budget mensuel estimé', // Label correct pour Étape 3
    step2_budget_label: 'Budget mensuel estimé', // !! Clé utilisée dans JSX (label Budget) !!
    step3_budget_placeholder: 'Votre budget', // Placeholder correct pour Étape 3
    step2_budget_placeholder: 'Votre budget', // !! Clé utilisée dans JSX (placeholder Budget) !!
    budget_error": "Le budget doit être d'au moins 500€.", // Pour validation

    step4_title: "Étape 4 : Pays Cible", // Pour H3 Étape 4
    step4_label: 'Pays cible', // Label correct pour Étape 4
    step3_region_label: 'pays ciblés', // !! Clé utilisée dans JSX (label Pays) !!
    region_error": "Veuillez sélectionner un pays/région.", // Pour validation
    region_europe: "Europe", // Option select Étape 4
    region_usa: "USA", // Option select Étape 4
    region_canada: "Canada", // Option select Étape 4
    region_south_america: "Amérique du Sud", // Option select Étape 4
    region_asia: "Asie", // Option select Étape 4

    step5_title: "Étape 5 : Vos Informations", // Pour H3 Étape 5
    step5_label: 'Vos Informations', // Label correct pour Étape 5
    step4_artist_label: 'Nom d\'artiste / Label', // !! Clé utilisée dans JSX (label Artiste) !!
    step5_artist_label: 'Nom d\'artiste / Label', // Clé correcte ajoutée aussi
    step4_artist_placeholder: 'nom de l\'artiste', // !! Clé utilisée dans JSX (placeholder Artiste) !!
    step5_artist_placeholder: 'nom de l\'artiste', // Clé correcte ajoutée aussi
    artist_error": "Veuillez entrer un nom d'artiste ou de label.", // Pour validation
    step4_email_label: 'Votre Email', // !! Clé utilisée dans JSX (label Email) !!
    step5_email_label: 'Votre Email', // Clé correcte ajoutée aussi
    step4_email_placeholder": 'votre email', // !! Clé utilisée dans JSX (placeholder Email) !!
    step5_email_placeholder": 'votre email', // Clé correcte ajoutée aussi
    email_error": "Veuillez entrer une adresse email valide.", // Pour validation

    results_title": "Vos Résultats Estimés", // Pour H3 Étape 6
    results_views_label": "Vues Estimées", // Label résultat
    results_cpv_label": "Coût Estimé", // Label résultat
    results_reach_label": "Portée Estimée", // Label résultat
    results_disclaimer": "Ces chiffres sont des estimations basées sur nos données historiques et peuvent varier en fonction de nombreux facteurs.", // Clé pour le disclaimer des résultats
    button_modify": "Modifier les sélections", // Bouton étape 6
    results_cta_expert": "Réserver un appel pour discuter des résultats", // Aria-label bouton étape 6

    button_prev": 'précédent', // Utilisé dans JSX
    button_next": "Suivant", // Utilisé dans JSX
    button_show_results": 'voir le résultat', // Utilisé dans JSX
    previous": "Précédent", // Existe dans l'original
    close": "Fermer", // Existe dans l'original
    close_button_aria_label": "Fermer le simulateur" // Pour bouton X
    // ==================================================
  },
  "services": {
    "title": "Nos services",
    "subtitle": "Solutions marketing complètes pour l'industrie musicale",
    "youtube": {
      "title": "YouTube Ads",
      "description": "Campagnes vidéo ciblées pour maximiser les vues et l'engagement."
    },
    "meta": {
      "title": "Meta Ads",
      "description": "Stratégies Facebook et Instagram pour développer votre audience."
    },
    "tiktok": {
      "title": "TikTok Ads",
      "description": "Campagnes virales pour toucher la génération Z et au-delà."
    },
    "content": {
      "title": "Stratégie de contenu",
      "description": "Création et optimisation de contenu qui convertit."
    }
  },
  "about": {
    "title": "À propos de nous",
    "subtitle": "Experts en marketing musical depuis 2018",
    "description": "MDMC est une agence spécialisée dans le marketing digital pour l'industrie musicale. Nous aidons les artistes et labels à atteindre leurs objectifs grâce à des stratégies publicitaires sur mesure et des campagnes optimisées pour maximiser le ROI.",
    "advantages": {
      "expertise": "Expertise spécialisée dans l'industrie musicale",
      "campaigns": "Campagnes optimisées pour maximiser le ROI",
      "targeting": "Ciblage précis des audiences pertinentes",
      "analytics": "Analyses détaillées et rapports transparents"
    },
    "stats": {
      "artists": "Artistes accompagnés",
      "campaigns": "Campagnes réalisées",
      "streams": "Streams générés",
      "roi": "ROI moyen"
    }
  },
  "articles": {
    "title": "Articles récents",
    "subtitle": "Conseils et actualités du marketing musical",
    "view_all": "Voir tous les articles",
    "read_more": "Lire la suite",
    "error_loading": "Erreur lors du chargement des articles.",
    "categories": {
       "strategy": "Stratégie",
       "youtube": "YouTube",
       "meta": "Meta",
       "tiktok": "TikTok",
       "default": "Actualités"
     }
  },
  "contact": {
    "title": "Contactez-nous",
    "subtitle": "Prêt à propulser votre musique ?",
    "description": "Discutons de votre projet et de la façon dont nous pouvons vous aider à atteindre vos objectifs.",
    "name": "Nom",
    "email": "Email",
    "message": "Message",
    "submit": "Envoyer",
    "success": "Message envoyé avec succès !",
    "error": "Une erreur s'est produite. Veuillez réessayer.",
    "form": {
      platform_label: "Plateforme principale ciblée",
      option_select: "-- Sélectionner --",
      platform_youtube: "YouTube Ads",
      platform_meta: "Meta Ads (Facebook/Instagram)",
      platform_tiktok: "TikTok Ads",
      book_call: "parler à un expert",
      submitting: "Envoi en cours...",
      success: "Message envoyé avec succès !",
      error: "Une erreur s'est produite. Veuillez réessayer.",
      name: "Votre nom",
      email: "Votre email",
      message: "Votre message",
      submit: "Envoyer le message",
      error_fields": "Veuillez remplir tous les champs requis.",
      error_email": "Veuillez entrer une adresse email valide."
    },
    "partners": {
      "title": "Ils nous font confiance",
      "fmm": "Fédération des Musiques Métalliques",
      "fmm_description": "Partenaire officiel pour la promotion des artistes métal",
      "google": "Google Partner",
      "google_description": "Agence certifiée Google Ads",
      "google_badge_alt": "Badge Google Partner",
      "mhl": "MHL Agency & Co",
      "mhl_description": "Collaboration sur les campagnes internationales",
      "algorythme": "Algorythme",
      "algorythme_description": "Partenaire technologique pour l'analyse de données"
    }
  },
  "reviews": {
    "title": "Ce que disent nos clients",
    "subtitle": "Témoignages d'artistes et de labels",
    "cta": "Voir tous les avis",
    "leave_review": "Laisser un avis",
    "view_all": "Voir tous les avis",
    // === AJOUT SECTION FORM ===
    form: {
      title: 'Laisse un avis',
      name: 'Votre nom'
    }
    // =======================
  },
  "footer": {
    "rights": "Tous droits réservés",
    "privacy": "Politique de confidentialité",
    "terms": "Conditions d'utilisation",
    "copyright": "MDMC Music Ads. Tous droits réservés.",
    "logo_p": "Marketing musical qui convertit",
    "nav_title": "Navigation",
    "nav_home": "Accueil",
    "resources_title": "Ressources",
    "resources_blog": "Blog",
    "resources_simulator": "Simulateur",
    "resources_faq": "FAQ",
    "resources_glossary": "Glossaire",
    "legal_title": "Mentions légales",
    "legal_privacy": "Confidentialité",
    "legal_terms": "Conditions",
    "legal_cookies": "Cookies"
  },
  "admin": { /* Gardé en français */ },
  "chatbot": { /* Gardé en français */ }
};
