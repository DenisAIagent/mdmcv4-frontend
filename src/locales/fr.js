// src/locales/fr.js
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
    "title": "Simulateur de campagne", // Clé existante utilisée pour H2 principal
    "subtitle": "Découvrez combien vous pourriez gagner", // Clé existante (non utilisée dans le code fourni?)

    // === CLÉS AJOUTÉES/MODIFIÉES POUR CORRESPONDRE AU JSX ===
    // --- Étape 1 ---
    "step1_title": "Quel est votre objectif principal ?", // Texte utilisé pour H3 Étape 1 (clé reprise de votre en.js)
    "step1_platform_label": "Plateforme publicitaire", // Utilisé pour label Étape 1 (clé reprise de votre en.js)
    "option_select": "-- Sélectionner --", // Utilisé dans tous les selects
    "platform_youtube": "YouTube Ads", // Option du select
    "platform_meta": "Meta Ads (Facebook/Instagram)", // Option du select
    "platform_tiktok": "TikTok Ads", // Option du select
    "platform_error": "Veuillez sélectionner une plateforme.", // Message validation (AJOUTÉ)

    // --- Étape 2 ---
    "step2_title": "Étape 2 : Type de Campagne", // AJOUTÉ (basé sur H3 en dur)
    "step2_label": "Choisissez le type de campagne", // AJOUTÉ (basé sur label en dur) -> Note: Renommé step2_select_label serait mieux
    "step2_placeholder": "Choisissez le type de campagne", // AJOUTÉ (si besoin pour placeholder)
    "campaignType_awareness": "Awareness (Notoriété)", // AJOUTÉ (pour option select)
    "campaignType_engagement": "Engagement", // AJOUTÉ (pour option select)
    "campaignType_conversion": "Conversion", // AJOUTÉ (pour option select)
    "campaignType_error": "Veuillez sélectionner un type de campagne.", // Message validation (AJOUTÉ)

    // --- Étape 3 ---
    "step3_title": "Étape 3 : Budget Mensuel Estimé", // AJOUTÉ (basé sur H3 en dur)
    "step3_label": 'Budget mensuel estimé', // Texte confirmé par vous
    "step2_budget_label": 'Budget mensuel estimé', // !! CLÉ INCORRECTE utilisée dans le JSX pour le label Budget !! - Ajoutée pour correspondre
    "step3_budget_placeholder": 'Votre budget', // Texte confirmé par vous
    "step2_budget_placeholder": 'Votre budget', // !! CLÉ INCORRECTE utilisée dans le JSX pour le placeholder Budget !! - Ajoutée pour correspondre
    "budget_error": "Le budget doit être d'au moins 500€.", // Message validation (AJOUTÉ)

    // --- Étape 4 ---
    "step4_title": "Étape 4 : Pays Cible", // AJOUTÉ (basé sur H3 en dur)
    "step4_label": 'Pays cible', // Texte confirmé par vous
    "step3_region_label": 'pays ciblés', // !! CLÉ INCORRECTE utilisée dans le JSX pour le label Pays !! - Ajoutée pour correspondre
    "region_error": "Veuillez sélectionner un pays/région.", // Message validation (AJOUTÉ)
    "region_europe": "Europe", // AJOUTÉ (pour option select)
    "region_usa": "USA", // AJOUTÉ (pour option select)
    "region_canada": "Canada", // AJOUTÉ (pour option select)
    "region_south_america": "Amérique du Sud", // AJOUTÉ (pour option select)
    "region_asia": "Asie", // AJOUTÉ (pour option select)

    // --- Étape 5 ---
    "step5_title": "Étape 5 : Vos Informations", // AJOUTÉ (basé sur H3 en dur)
    "step5_label": 'Vos Informations', // Texte logique (utilisé dans mes prop précédentes)
    "step4_artist_label": 'Nom d\'artiste / Label', // !! CLÉ INCORRECTE utilisée dans le JSX pour label Artiste !! - Ajoutée pour correspondre
    "step5_artist_label": 'Nom d\'artiste / Label', // Texte logique (ajouté aussi)
    "step4_artist_placeholder": 'nom de l\'artiste', // !! CLÉ INCORRECTE utilisée dans le JSX pour placeholder Artiste !! - Ajoutée pour correspondre
    "step5_artist_placeholder": 'nom de l\'artiste', // Texte confirmé (ajouté aussi)
    "artist_error": "Veuillez entrer un nom d'artiste ou de label.", // Message validation (AJOUTÉ)
    "step4_email_label": 'Votre Email', // !! CLÉ INCORRECTE utilisée dans le JSX pour label Email !! - Ajoutée pour correspondre
    "step5_email_label": 'Votre Email', // Texte logique (ajouté aussi)
    "step4_email_placeholder": 'votre email', // !! CLÉ INCORRECTE utilisée dans le JSX pour placeholder Email !! - Ajoutée pour correspondre
    "step5_email_placeholder": 'votre email', // Texte confirmé (ajouté aussi)
    "email_error": "Veuillez entrer une adresse email valide.", // Message validation (AJOUTÉ)

    // --- Étape 6 / Résultats ---
    "step6": { // Structure existante dans votre en.js
      "title": "Voici votre estimation personnalisée",
      "roi_title": "ROI estimé",
      "monthly_streams": "Streams mensuels potentiels",
      "monthly_sales": "Ventes mensuelles potentielles",
      "ticket_sales": "Ventes de billets potentielles",
      "followers_growth": "Croissance d'abonnés potentielle",
      "cta": "Parler avec un expert", // Texte du bouton déjà présent
      "disclaimer": "Ces chiffres sont des estimations basées sur nos données historiques et peuvent varier en fonction de nombreux facteurs."
    },
    "results_title": "Vos Résultats Estimés", // AJOUTÉ (pour H3 utilisé en étape 6)
    "results_views_label": "Vues Estimées", // AJOUTÉ
    "results_cpv_label": "Coût Estimé", // AJOUTÉ (CPV/CPM Range)
    "results_reach_label": "Portée Estimée", // AJOUTÉ
    "results_disclaimer": "Ces chiffres sont des estimations basées sur nos données historiques et peuvent varier en fonction de nombreux facteurs.", // AJOUTÉ (clé utilisée dans JSX, différente de step6.disclaimer)
    "results_cta_expert": "Réserver un appel pour discuter des résultats", // AJOUTÉ (pour aria-label)

    // --- Boutons ---
    "button_prev": 'précédent', // Texte confirmé par vous
    "button_next": "Suivant", // Clé existante
    "button_show_results": 'voir le résultat', // Texte confirmé par vous
    "button_modify": "Modifier les sélections", // AJOUTÉ (pour bouton étape 6)
    "previous": "Précédent", // Clé existante dans votre fr.js original
    "close": "Fermer", // Clé existante
    "close_button_aria_label": "Fermer le simulateur" // AJOUTÉ (pour bouton X)
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
    "error": "Une erreur s'est produite. Veuillez réessayer.", // Clé générique ajoutée
    "form": {
      platform_label: "Plateforme principale ciblée",
      option_select: "-- Sélectionner --",
      platform_youtube: "YouTube Ads",
      platform_meta: "Meta Ads (Facebook/Instagram)",
      platform_tiktok: "TikTok Ads",
      book_call: "parler à un expert",
      submitting: "Envoi en cours...",
      success: "Message envoyé avec succès !",
      error: "Une erreur s'est produite. Veuillez réessayer.", // Erreur spécifique formulaire
      name: "Votre nom",
      email: "Votre email",
      message: "Votre message",
      submit: "Envoyer le message",
      error_fields: "Veuillez remplir tous les champs requis.",
      error_email: "Veuillez entrer une adresse email valide."
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
  "admin": { // Gardé en français
    "dashboard": "Tableau de bord",
    "reviews": "Avis",
    "content": "Contenu",
    "media": "Médias",
    "settings": "Paramètres",
    "marketing_integrations": "Intégrations Marketing",
    "wordpress_connector": "Connecteur WordPress",
    "landing_page_generator": "Générateur de Landing Page",
    "wordpress_sync": "Synchronisation WordPress",
    "logout": "Déconnexion",
    "reviews_management": "Gestion des avis",
    "content_management": "Gestion du contenu",
    "media_management": "Gestion des médias",
    "pending_reviews": "Avis en attente",
    "approved_reviews": "Avis approuvés",
    "active_campaigns": "Campagnes actives",
    "recent_activity": "Activité récente",
    "new_review_received": "Nouvel avis reçu",
    "content_updated": "Contenu mis à jour",
    "campaign_started": "Campagne démarrée",
    "loading": "Chargement...",
    "no_pending_reviews": "Aucun avis en attente",
    "approve": "Approuver",
    "reject": "Rejeter",
    "generate_review_link": "Générer un lien d'avis",
    "link_copied": "Lien copié dans le presse-papiers !",
    "select_language": "Sélectionner une langue",
    "select_section": "Sélectionner une section",
    "section_hero": "Section Héro",
    "section_services": "Section Services",
    "section_about": "Section À propos",
    "section_contact": "Section Contact",
    "field_title": "Titre",
    "field_subtitle": "Sous-titre",
    "field_description": "Description",
    "save_changes": "Enregistrer les modifications",
    "drop_files": "Déposez vos fichiers ici ou cliquez pour parcourir",
    "recent_uploads": "Téléchargements récents",
    "view": "Voir",
    "delete": "Supprimer",
    "site_title": "Titre du site",
    "admin_email": "Email administrateur",
    "default_language": "Langue par défaut",
    "change_password": "Changer le mot de passe",
    "new_password": "Nouveau mot de passe",
    "save_settings": "Enregistrer les paramètres",
    "chatbot": {
      "title": "Assistant MDMC",
      "welcome_message": "Bonjour ! Je suis votre assistant MDMC. Comment puis-je vous aider aujourd'hui ?",
      "help_prompt": "Voici quelques sujets sur lesquels je peux vous aider :",
      "suggestion_pixels": "Intégration des pixels marketing",
      "suggestion_wordpress": "Connecter WordPress",
      "suggestion_landing_pages": "Créer une landing page",
      "general_help": "Je peux vous aider avec les intégrations marketing, la connexion WordPress, ou la création de landing pages. Que souhaitez-vous savoir ?",
      "google_analytics_help": "Pour configurer Google Analytics, vous avez besoin de votre ID de mesure (G-XXXXXXXX). Vous pouvez le trouver dans votre compte Google Analytics sous Admin > Propriété > Infos de suivi > Code de suivi.",
      "suggestion_ga_id": "Où trouver mon ID Google Analytics ?",
      "suggestion_ga_events": "Configuration des événements GA",
      "gtm_help": "Pour configurer Google Tag Manager, entrez votre ID de conteneur GTM (GTM-XXXXXXX) dans le champ correspondant. Vous pouvez trouver cet ID dans votre compte GTM sous Admin > Paramètres du conteneur.",
      "suggestion_gtm_id": "Où trouver mon ID GTM ?",
      "suggestion_gtm_setup": "Configuration avancée GTM",
      "meta_pixel_help": "Pour configurer le pixel Meta (Facebook), entrez votre ID de pixel dans le champ correspondant. Vous pouvez trouver cet ID dans votre Gestionnaire d'événements Meta sous Pixels > Détails du pixel.",
      "suggestion_meta_events": "Configuration des événements Meta",
      "suggestion_meta_advanced": "Options avancées du pixel Meta",
      "tiktok_pixel_help": "Pour configurer le pixel TikTok, entrez votre ID de pixel dans le champ correspondant. Vous pouvez trouver cet ID dans votre TikTok Ads Manager sous Library > Events > Website Pixel > Setup.",
      "suggestion_tiktok_events": "Configuration des événements TikTok",
      "suggestion_tiktok_api": "Utilisation de l'API TikTok",
      "pixels_general_help": "Vous pouvez intégrer différents pixels marketing sans avoir à manipuler de code. Il vous suffit d'entrer les identifiants correspondants dans les champs prévus à cet effet.",
      "suggestion_google_analytics": "Google Analytics",
      "suggestion_meta_pixel": "Pixel Meta (Facebook)",
      "suggestion_tiktok_pixel": "Pixel TikTok",
      "wordpress_setup_help": "Pour connecter votre blog WordPress, vous aurez besoin de l'URL de votre site WordPress et d'un mot de passe d'application. Vous pouvez créer un mot de passe d'application dans votre profil WordPress sous Sécurité > Mots de passe d'application.",
      "suggestion_wp_app_password": "Créer un mot de passe d'application",
      "suggestion_wp_sync": "Synchroniser le contenu",
      "wordpress_sync_help": "Vous pouvez synchroniser automatiquement le contenu de votre blog WordPress avec votre site MDMC. Sélectionnez les catégories que vous souhaitez synchroniser et définissez la fréquence de synchronisation.",
      "suggestion_wp_categories": "Sélection des catégories",
      "suggestion_wp_frequency": "Fréquence de synchronisation",
      "wordpress_general_help": "Le connecteur WordPress vous permet d'intégrer facilement le contenu de votre blog WordPress à votre site MDMC sans avoir à manipuler de code.",
      "suggestion_wp_connect": "Comment connecter WordPress",
      "suggestion_wp_troubleshoot": "Résoudre les problèmes",
      "landing_templates_help": "Le générateur de landing page propose plusieurs templates optimisés pour l'industrie musicale. Sélectionnez celui qui correspond le mieux à vos besoins et personnalisez-le selon vos préférences.",
      "suggestion_landing_customize": "Personnaliser un template",
      "suggestion_landing_sections": "Gérer les sections",
      "landing_publish_help": "Une fois votre landing page créée, vous pouvez la publier en un clic. Vous pouvez également intégrer vos pixels marketing pour suivre les performances de votre page.",
      "suggestion_landing_analytics": "Suivi des performances",
      "suggestion_landing_domain": "Utiliser un domaine personnalisé",
      "landing_general_help": "Le générateur de landing page vous permet de créer facilement des pages d'atterrissage professionnelles sans avoir à coder. Vous pouvez choisir parmi plusieurs templates, personnaliser le contenu et publier en quelques clics.",
      "suggestion_landing_create": "Créer une landing page",
      "suggestion_landing_publish": "Publier une landing page",
      "input_placeholder": "Posez votre question ici...",
      "send": "Envoyer",
      "close": "Fermer",
      "open": "Ouvrir l'assistant"
    }
  }
};
