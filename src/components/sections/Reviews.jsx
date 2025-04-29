import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Rating } from 'react-simple-star-rating'; // Import de la bibliothèque pour les étoiles interactives
import '../../assets/styles/reviews.css'; // Assure-toi que ce chemin est correct vers ton CSS

const Reviews = () => {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  // const [showReviewForm, setShowReviewForm] = useState(false); // Commenté car le formulaire est affiché directement

  // --- États pour le formulaire ---
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState(0); // Note initiale à 0 pour le formulaire
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);
  // --- Fin États formulaire ---

  // Données d'exemple pour les avis affichés dans le carrousel
  // TODO: Remplacer par un appel API pour récupérer les vrais avis approuvés
  const reviewsData = [
    { id: 1, name: "Jean Dupont", role: "Artiste indépendant", avatar: "/src/assets/images/avatars/avatar-1.jpg", rating: 5, text: "Grâce à MDMC, j'ai pu augmenter ma visibilité de 300% en seulement 2 mois. Leur expertise en YouTube Ads a transformé ma carrière !", date: "15/03/2025" },
    { id: 2, name: "Studio Mélodie", role: "Label indépendant", avatar: "/src/assets/images/avatars/avatar-2.jpg", rating: 5, text: "Nous travaillons avec MDMC depuis plus d'un an et les résultats sont exceptionnels. Leur approche stratégique et leur connaissance du marché musical font toute la différence.", date: "02/04/2025" },
    { id: 3, name: "Marie Lambert", role: "Chanteuse", avatar: "/src/assets/images/avatars/avatar-3.jpg", rating: 4, text: "Une équipe professionnelle qui comprend vraiment les besoins des artistes. Leur campagne TikTok a permis à mon single d'atteindre plus de 500 000 vues !", date: "22/03/2025" }
  ];

  // Effet pour l'animation du carrousel d'avis
  useEffect(() => {
    if (reviewsData.length === 0) return;
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % reviewsData.length);
    }, 8000); // Change d'avis toutes les 8 secondes
    return () => clearInterval(interval); // Nettoyage de l'intervalle quand le composant est démonté
  }, [reviewsData.length]);

  // Fonction pour générer les étoiles d'affichage (non interactives) pour les avis existants
  const renderDisplayStars = (displayRating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(<span key={i} className={`star ${i <= displayRating ? 'filled' : 'empty'}`}>★</span>);
    }
    return stars;
  };

  // Fonction pour naviguer dans le carrousel via les points de navigation
  const goToReview = (index) => {
    setActiveIndex(index);
  };

  // --- Fonctions pour le formulaire ---

  // Fonction appelée par la librairie Rating quand la note change DANS LE FORMULAIRE
  const handleRating = (rate) => {
    console.log('Rating sélectionné (formulaire):', rate); // Log pour vérifier
    // La librairie renvoie directement la valeur (1, 2, 3, 4, 5)
    setRating(rate); // Met à jour l'état React 'rating' utilisé par le formulaire
  };

  // Fonction de soumission du formulaire d'avis
  const submitReview = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page
    setFormError(null); // Réinitialise les erreurs précédentes
    setFormSuccess(null); // Réinitialise les succès précédents

    // Validation simple : vérifie si une note a été sélectionnée
    if (rating === 0) {
      setFormError(t('reviews.form.error_rating_required'));
      return; // Arrête la soumission si la note est 0
    }

    setIsSubmitting(true); // Désactive le bouton pendant l'envoi
    const reviewData = { name, email, rating, message };
    const apiUrl = import.meta.env.VITE_API_URL; // Récupère l'URL du backend

    // Vérifie si l'URL de l'API est bien configurée dans .env
    if (!apiUrl) {
        console.error("Erreur: VITE_API_URL n'est pas configurée dans le fichier .env du frontend.");
        setFormError(t('reviews.form.error_config')); // Message d'erreur de configuration
        setIsSubmitting(false);
        return;
    }

    try {
      // Appel à l'API backend pour créer un nouvel avis
      const response = await fetch(`${apiUrl}/reviews`, { // Assure-toi que '/reviews' est le bon endpoint backend
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
      });

      // Gestion des erreurs de réponse HTTP
      if (!response.ok) {
        // Essaye de lire le message d'erreur JSON du backend s'il existe
        const errorData = await response.json().catch(() => ({ message: 'Réponse invalide ou non-JSON du serveur' }));
        throw new Error(errorData.message || `Erreur HTTP ${response.status}`);
      }

      // Si la requête réussit (statut 2xx)
      const result = await response.json(); // Récupère la réponse (peut contenir l'avis créé)
      console.log('Avis soumis avec succès:', result);
      setFormSuccess(t('reviews.form.success')); // Affiche le message de succès

      // Vide les champs du formulaire après succès
      setName('');
      setEmail('');
      setRating(0); // Réinitialise la note à 0
      setMessage('');

      // Optionnel: Masque le message de succès après quelques secondes
      setTimeout(() => setFormSuccess(null), 5000);

    } catch (error) {
      console.error("Erreur lors de la soumission de l'avis:", error);
      // Affiche l'erreur à l'utilisateur (soit l'erreur du backend, soit une erreur générique)
      setFormError(error.message || t('reviews.form.error_generic'));
    } finally {
      setIsSubmitting(false); // Réactive le bouton de soumission dans tous les cas (succès ou erreur)
    }
  };
  // --- Fin Fonctions formulaire ---


  return (
    <section id="reviews" className="reviews-section">
      <div className="container"> {/* Assure un conteneur pour centrer/limiter la largeur */}
        <h2 className="section-title">{t('reviews.title')}</h2>
        <p className="section-subtitle">{t('reviews.subtitle')}</p>

        {/* --- Carrousel d'avis existants --- */}
        {reviewsData.length > 0 ? (
          <div className="reviews-container">
            <div className="reviews-carousel">
              {reviewsData.map((review, index) => (
                <div
                  key={review.id}
                  className={`review-card ${index === activeIndex ? 'active' : ''}`}
                  // Style pour l'effet de slide (peut nécessiter ajustement CSS)
                  style={{ transform: `translateX(${(index - activeIndex) * 100}%)` }}
                >
                  <div className="review-header">
                    <div className="review-avatar">
                      {/* Utilise un chemin relatif depuis public/ si les images y sont */}
                      <img src={review.avatar} alt={`Avatar de ${review.name}`} loading="lazy" />
                    </div>
                    <div className="review-info">
                      <h3 className="review-name">{review.name}</h3>
                      <p className="review-role">{review.role}</p>
                      <div className="review-rating">
                        {/* Affiche les étoiles non-interactives */}
                        {renderDisplayStars(review.rating)}
                      </div>
                    </div>
                  </div>
                  <div className="review-content">
                    <p className="review-text">"{review.text}"</p>
                    <p className="review-date">{review.date}</p>
                  </div>
                </div>
              ))}
            </div>
            {/* Navigation pour le carrousel */}
            <div className="reviews-navigation">
              {reviewsData.map((_, index) => (
                <button
                  key={index}
                  className={`nav-dot ${index === activeIndex ? 'active' : ''}`}
                  onClick={() => goToReview(index)}
                  aria-label={`${t('reviews.go_to_review')} ${index + 1}`}
                />
              ))}
            </div>
          </div>
        ) : (
          <p>{t('reviews.no_reviews')}</p> // Message si pas d'avis à afficher
        )}
        {/* --- Fin Carrousel --- */}

        {/* --- Boutons d'action --- */}
        <div className="reviews-actions">
          {/* Ce bouton pourrait éventuellement faire défiler jusqu'au formulaire */}
          <button className="btn btn-primary" onClick={() => document.getElementById('review-form-section')?.scrollIntoView({ behavior: 'smooth' })}>
            {t('reviews.leave_review')}
          </button>
          {/* Lien vers une page hypothétique affichant tous les avis */}
          <Link to="/all-reviews" className="btn btn-secondary">{t('reviews.view_all')}</Link>
        </div>

        {/* --- Section du Formulaire d'Avis --- */}
        {/* L'id est utile pour le défilement depuis le bouton ci-dessus */}
        <div id="review-form-section" className="review-form-container" style={{ border: '1px solid #eee', padding: '20px', marginTop: '30px', borderRadius: '8px' }}>
          <h3>{t('reviews.form.title')}</h3>
          <form onSubmit={submitReview}>
            {/* Affichage des messages d'erreur ou de succès */}
            {formError && <p className="form-error" style={{color: 'red', marginBottom: '15px'}}>{formError}</p>}
            {formSuccess && <p className="form-success" style={{color: 'green', marginBottom: '15px'}}>{formSuccess}</p>}

            {/* Champ Nom */}
            <div className="form-group">
              <label htmlFor="name">{t('reviews.form.name')}</label>
              <input
                type="text"
                id="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting}
                placeholder={t('reviews.form.name_placeholder')}
              />
            </div>

            {/* Champ Email */}
            <div className="form-group">
              <label htmlFor="email">{t('reviews.form.email')}</label>
              <input
                type="email"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                placeholder={t('reviews.form.email_placeholder')}
              />
            </div>

            {/* Champ Note (Étoiles Interactives) */}
            <div className="form-group">
              <label>{t('reviews.form.rating')}</label>
              <div className="rating-selector"> {/* Conteneur pour les étoiles */}
                <Rating
                  onClick={handleRating}     // Fonction qui met à jour l'état 'rating'
                  // initialValue={rating}  // <<<--- LIGNE SUPPRIMÉE COMME DEMANDÉ
                  ratingValue={rating}     // Contrôle l'affichage basé sur l'état 'rating'
                  allowFraction={false}    // Pas de demi-étoiles
                  size={30}                // Taille des étoiles
                  fillColor="#facc15"      // Couleur pleine (jaune)
                  emptyColor="#cccccc"     // Couleur vide (gris)
                  transition               // Ajoute une petite transition au survol/clic
                  readonly={isSubmitting}  // Désactive pendant la soumission
                />
              </div>
               {/* Message d'erreur spécifique si la note est 0 au moment de la soumission */}
               {formError === t('reviews.form.error_rating_required') && <p style={{color: 'red', fontSize: '0.9em', marginTop: '5px'}}>{formError}</p>}
            </div>

            {/* Champ Message/Avis */}
            <div className="form-group">
              <label htmlFor="message">{t('reviews.form.message')}</label>
              <textarea
                id="message"
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={isSubmitting}
                placeholder={t('reviews.form.message_placeholder')}
              ></textarea>
            </div>

            {/* Bouton de soumission */}
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? t('reviews.form.submitting') : t('reviews.form.submit')}
            </button>
          </form>
        </div>
        {/* --- Fin Section Formulaire --- */}

      </div> {/* Fin div.container */}
    </section>
  );
};

export default Reviews;
