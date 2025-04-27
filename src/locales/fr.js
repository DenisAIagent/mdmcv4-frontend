// Dans src/locales/fr.js

export default {
  // ... autres clés ...

  "contact": {
    "title": "Contactez-nous", // Gardé
    // "subtitle": "Prêt à propulser votre musique ?", // Supprimé car texte enlevé du JSX
    // "description": "Discutons de votre projet et de la façon dont nous pouvons vous aider à atteindre vos objectifs.", // Supprimé car texte enlevé du JSX
    // Clés pour le formulaire (gardées et ajout de nouvelles)
    "name": "Nom",
    "email": "Email",
    "message": "Message",
    "submit": "Envoyer", // Gardé, mais utilisé par contact.form.submit maintenant
    "success": "Message envoyé avec succès !", // Gardé, mais utilisé par contact.form.success
    "error": "Une erreur s'est produite. Veuillez réessayer.", // Message d'erreur générique
    "form": {
      "platform_label": "Plateforme principale ciblée", // Ajouté
      "option_select": "-- Sélectionner --", // Ajouté
      "platform_youtube": "YouTube Ads", // Ajouté
      "platform_meta": "Meta Ads (Facebook/Instagram)", // Ajouté
      "platform_tiktok": "TikTok Ads", // Ajouté
      "name": "Votre nom",
      "email": "Votre email",
      "message": "Votre message",
      "submit": "Envoyer",
      "submitting": "Envoi en cours...", // Ajouté
      "book_call": "Réserver un appel", // Ajouté
      "success": "Message envoyé avec succès !",
      "error": "Une erreur s'est produite lors de l'envoi. Veuillez réessayer.", // Erreur spécifique au formulaire
      "error_fields": "Veuillez remplir tous les champs requis.", // Ajouté
      "error_email": "Veuillez entrer une adresse email valide." // Ajouté
    },
    // Section partenaires
    "partners": {
      // === MODIFICATION DE LA VALEUR ICI ===
      "title": "Nos partenaires", // Anciennement: "Ils nous font confiance"
      // =====================================
      "fmm": "Fédération des Musiques Métalliques",
      "fmm_description": "Partenaire officiel pour la promotion des artistes métal",
      "google": "Google Partner",
      "google_description": "Agence certifiée Google Ads",
      "google_badge_alt": "Badge Google Partner", // Utile pour l'attribut alt de l'image
      "mhl": "MHL Agency & Co",
      "mhl_description": "Collaboration sur les campagnes internationales",
      "algorythme": "Algorythme",
      "algorythme_description": "Partenaire technologique pour l'analyse de données"
    }
  },

  // ... reste des clés ...
}
