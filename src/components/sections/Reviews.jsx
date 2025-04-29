import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Rating } from 'react-simple-star-rating'; // <<<--- IMPORT AJOUTÉ
import '../../assets/styles/reviews.css'; // Assure-toi que ce chemin est correct

const Reviews = () => {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  // const [showReviewForm, setShowReviewForm] = useState(false); // Commenté pour le test hors modal

  // --- États pour le formulaire ---
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState(0); // Note initiale à 0
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);
  // --- Fin États formulaire ---

  // Données d'exemple pour les avis affichés
  const reviewsData = [
    { id: 1, name: "Jean Dupont", role: "Artiste indépendant", avatar: "/src/assets/images/avatars/avatar-1.jpg", rating: 5, text: "Grâce à MDMC, j'ai pu augmenter ma visibilité de 300% en seulement 2 mois. Leur expertise en YouTube Ads a transformé ma carrière !", date: "15/03/2025" },
    { id: 2, name: "Studio Mélodie", role: "Label indépendant", avatar: "/src/assets/images/avatars/avatar-2.jpg", rating: 5, text: "Nous travaillons avec MDMC depuis plus d'un an et les résultats sont exceptionnels. Leur approche stratégique et leur connaissance du marché musical font toute la différence.", date: "02/04/2025" },
    { id: 3, name: "Marie Lambert", role: "Chanteuse", avatar: "/src/assets/images/avatars/avatar-3.jpg", rating: 4, text: "Une équipe professionnelle qui comprend vraiment les besoins des artistes. Leur campagne TikTok a permis à mon single d'atteindre plus de 500 000 vues !", date: "22/03/2025" }
  ];

  // Effet pour le carrousel d'avis
  useEffect(() => {
    if (reviewsData.length === 0) return;
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % reviewsData.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [reviewsData.length]);

  // Fonction pour générer les étoiles (pour l'affichage des avis existants)
  const renderDisplayStars = (displayRating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(<span key={i} className={`star ${i <= displayRating ? 'filled' : 'empty'}`}>★</span>);
    }
    return stars;
  };

  // Fonction pour naviguer dans le carrousel
  const goToReview = (index) => {
    setActiveIndex(index);
  };

  // --- Fonctions pour le formulaire ---

  // Fonction appelée par la librairie Rating quand la note change
  const handleRating = (rate) => {
    console.log('Rating selected via library:', rate); // Log pour vérifier
    // La librairie renvoie directement la valeur (1, 2, 3, 4, 5)
    setRating(rate);
  };

  // Fonction de soumission du formulaire
  const submitReview = async (e) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);
    if (rating === 0) {
      setFormError(t('reviews.form.error_rating_required'));
      return;
    }
    setIsSubmitting(true);
    const reviewData = { name, email, rating, message };
    const apiUrl = import.meta.env.VITE_API_URL; // Récupère l'URL du backend depuis les variables d'env du frontend

    // Vérifie si l'URL de l'API est configurée
    if (!apiUrl) {
        console.error("Erreur: L'URL de l'API n'est pas configurée (VITE_API_URL manquante ?)");
        setFormError(t('reviews.form.error_config')); // Ajoute une clé de traduction pour ça
        setIsSubmitting(false);
        return;
    }

    try {
      // Appel API vers le backend
      const response = await fetch(`${apiUrl}/reviews`, { // Chemin relatif au baseURL
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
      });

      if (!response.ok) {
        // Tente de lire le message d'erreur du backend
        const errorData = await response.json().catch(() => ({ message: 'Réponse invalide du serveur' }));
        throw new Error(errorData.message || `Erreur HTTP ! Statut : ${response.status}`);
      }

      const result = await response.json();
      console.log('Réponse API:', result);
      setFormSuccess(t('reviews.form.success')); // Affiche message de succès

      // Vide les champs du formulaire après succès
      setName(''); setEmail(''); setRating(0); setMessage('');

      // Efface le message de succès après quelques secondes
      setTimeout(() => setFormSuccess(null), 5000);

    } catch (error) {
      console.error("Erreur lors de la soumission de l'avis:", error);
      setFormError(error.message || t('reviews.form.error_generic')); // Affiche l'erreur
    } finally {
      setIsSubmitting(false); // Réactive le bouton
    }
  };
  // --- Fin Fonctions formulaire ---


  return (
    <section id="reviews" className="reviews-section">
      <div className="container"> {/* Balise container ouverte */}
        <h2 className="section-title">{t('reviews.title')}</h2>
        <p className="section-subtitle">{t('reviews.subtitle')}</p>

        {/* Affichage du carrousel */}
        <div className="reviews-container">
          <div className="reviews-carousel">
            {reviewsData.map((review, index) => (
              <div
                key={review.id}
                className={`review-card ${index === activeIndex ? 'active' : ''}`}
                style={{ transform: `translateX(${(index - activeIndex) * 100}%)` }}
              >
                {/* Contenu de la carte d'avis */}
                <div className="review-header">
                  <div className="review-avatar">
                    <img src={review.avatar} alt={`Avatar de ${review.name}`} loading="lazy" />
                  </div>
                  <div className="review-info">
                    <h3 className="review-name">{review.name}</h3>
                    <p className="review-role">{review.role}</p>
                    <div className="review-rating">
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
          <div className="reviews-navigation">
            {reviewsData.map((_, index) => (
              <button key={index} className={`nav-dot ${index === activeIndex ? 'active' : ''}`} onClick={() => goToReview(index)} aria-label={`Voir l'avis ${index + 1}`} />
            ))}
          </div>
        </div>
        {/* Fin affichage carrousel */}

        <div className="reviews-actions">
          {/* Ce bouton n'ouvre plus de modal dans cette version de test */}
          <button className="btn btn-primary">{t('reviews.leave_review')}</button>
          <Link to="/all-reviews" className="btn btn-secondary">{t('reviews.view_all')}</Link>
        </div>

        {/* --- FORMULAIRE DE TEST AFFICHÉ DIRECTEMENT --- */}
        <div style={{ border: '2px solid blue', padding: '20px', marginTop: '30px' }}> {/* Bordure bleue pour le repérer */}
          <h3>{t('reviews.form.title')} (Test Hors Modal)</h3>
          <form onSubmit={submitReview}>
            {formError && <p className="form-error" style={{color: 'red'}}>{formError}</p>} {/* Style ajouté pour visibilité */}
            {formSuccess && <p className="form-success" style={{color: 'green'}}>{formSuccess}</p>} {/* Style ajouté pour visibilité */}

            <div className="form-group">
              <label htmlFor="name">{t('reviews.form.name')}</label>
              <input
                type="text"
                id="name"
                required
                value={name}
                onChange={(e) => {
                  console.log('Name onChange triggered:', e.target.value); // Garde le log
                  setName(e.target.value);
                }}
                disabled={isSubmitting}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">{t('reviews.form.email')}</label>
              <input
                type="email"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <div className="form-group">
              <label>{t('reviews.form.rating')}</label>
              {/* --- Utilisation de la librairie react-simple-star-rating --- */}
              <div className="rating-selector">
                <Rating
                  onClick={handleRating} // Fonction qui met à jour l'état 'rating'
                  initialValue={rating} // Valeur initiale (0)
                  ratingValue={rating} // Important pour contrôler la valeur affichée par l'état React
                  allowFraction={false}
                  size={30} // Ajuste la taille
                  fillColor="#facc15" // Jaune doré
                  emptyColor="#cccccc" // Gris clair
                  transition
                  readonly={isSubmitting}
                />
              </div>
              {/* --- Fin Utilisation librairie --- */}
            </div>
            <div className="form-group">
              <label htmlFor="message">{t('reviews.form.message')}</label>
              <textarea
                id="message"
                rows="4"
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={isSubmitting}
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? t('reviews.form.submitting') : t('reviews.form.submit')}
            </button>
          </form>
        </div>
        {/* --- FIN FORMULAIRE DE TEST --- */}

      </div> {/* <<< === Balise fermante du div.container === */}
    </section>
  );
};

export default Reviews;
