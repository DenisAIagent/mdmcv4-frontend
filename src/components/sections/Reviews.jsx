import React, { useState, useEffect } from 'react'; // Import React et hooks
import { useTranslation } from 'react-i18next'; // Pour les traductions
import { Link } from 'react-router-dom'; // Pour le lien "Voir tous les avis"
import { Rating } from 'react-simple-star-rating'; // Pour les étoiles interactives
import '../../assets/styles/reviews.css'; // CSS principal pour la section
import '../../assets/styles/modal.css'; // CSS pour la modale

const Reviews = () => {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0); // Pour le carrousel

  // --- État pour la visibilité de la modale ---
  const [showReviewForm, setShowReviewForm] = useState(false);

  // --- États pour le formulaire ---
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);

  // Données d'exemple pour le carrousel (à remplacer par API plus tard)
  const reviewsData = [
    { _id: 'mock1', name: "Jean Dupont", role: "Artiste indépendant", avatar: "/src/assets/images/avatars/avatar-1.jpg", rating: 5, text: "Grâce à MDMC...", date: "15/03/2025", createdAt: "2025-03-15T10:00:00Z" },
    { _id: 'mock2', name: "Studio Mélodie", role: "Label indépendant", avatar: "/src/assets/images/avatars/avatar-2.jpg", rating: 5, text: "Nous travaillons avec...", date: "02/04/2025", createdAt: "2025-04-02T10:00:00Z" },
    { _id: 'mock3', name: "Marie Lambert", role: "Chanteuse", avatar: "/src/assets/images/avatars/avatar-3.jpg", rating: 4, text: "Une équipe pro...", date: "22/03/2025", createdAt: "2025-03-22T10:00:00Z" }
  ];

  // Effet pour le carrousel
  useEffect(() => {
    if (reviewsData.length === 0) return;
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % reviewsData.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [reviewsData.length]);

  // Fonction pour afficher les étoiles (non interactives) du carrousel
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
  const handleRating = (rate) => {
    setRating(rate);
  };

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
    const apiUrl = import.meta.env.VITE_API_URL;

    if (!apiUrl) {
      console.error("Erreur: VITE_API_URL non définie.");
      setFormError(t('reviews.form.error_config'));
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Réponse invalide ou non-JSON du serveur' }));
        throw new Error(errorData.message || `Erreur HTTP ${response.status}`);
      }

      const result = await response.json();
      console.log('Avis soumis:', result);
      setFormSuccess(t('reviews.form.success'));
      setName(''); setEmail(''); setRating(0); setMessage('');

      setTimeout(() => {
          setFormSuccess(null);
          setShowReviewForm(false); // Ferme la modale
      }, 3000);

    } catch (error) {
      console.error("Erreur soumission avis:", error);
      setFormError(error.message || t('reviews.form.error_generic'));
    } finally {
      setIsSubmitting(false);
    }
  };
  // --- Fin Fonctions formulaire ---

  // --- Fonctions pour la modale ---
  const openModal = () => {
    setShowReviewForm(true);
    setFormError(null);
    setFormSuccess(null);
  };

  const closeModal = () => {
    setShowReviewForm(false);
  };

  // --- Rendu JSX ---
  return (
    <section id="reviews" className="reviews-section">
      <div className="container">
        <h2 className="section-title">{t('reviews.title')}</h2>
        <p className="section-subtitle">{t('reviews.subtitle')}</p>

        {/* Carrousel d'avis */}
        {reviewsData.length > 0 ? (
          <div className="reviews-container">
            <div className="reviews-carousel">
              {reviewsData.map((review, index) => (
                <div key={review._id || review.id} className={`review-card ${index === activeIndex ? 'active' : ''}`} style={{ transform: `translateX(${(index - activeIndex) * 100}%)` }}>
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
                     <p className="review-date">{new Date(review.createdAt || review.date).toLocaleDateString('fr-FR')}</p>
                   </div>
                </div>
              ))}
            </div>
            <div className="reviews-navigation">
              {reviewsData.map((_, index) => (
                <button key={index} className={`nav-dot ${index === activeIndex ? 'active' : ''}`} onClick={() => goToReview(index)} aria-label={`${t('reviews.go_to_review')} ${index + 1}`} />
              ))}
            </div>
          </div>
        ) : (
          <p>{t('reviews.no_reviews')}</p>
        )}

        {/* Boutons d'action */}
        <div className="reviews-actions">
          <button className="btn btn-primary" onClick={openModal}>
            {t('reviews.leave_review')}
          </button>
          <Link to="/all-reviews" className="btn btn-secondary">{t('reviews.view_all')}</Link>
        </div>

        {/* --- MODALE POUR LE FORMULAIRE D'AVIS --- */}
        {showReviewForm && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close-button" onClick={closeModal} aria-label={t('common.close') || 'Fermer'}>
                &times;
              </button>

              <h3>{t('reviews.form.title')}</h3>
              <form onSubmit={submitReview}>
                {formError && <p className="form-error" style={{color: 'red', marginBottom: '15px'}}>{formError}</p>}
                {formSuccess && <p className="form-success" style={{color: 'green', marginBottom: '15px'}}>{formSuccess}</p>}

                <div className="form-group">
                  <label htmlFor="review-name">{t('reviews.form.name')}</label>
                  <input type="text" id="review-name" required value={name} onChange={(e) => setName(e.target.value)} disabled={isSubmitting} placeholder={t('reviews.form.name_placeholder')} />
                </div>

                <div className="form-group">
                  <label htmlFor="review-email">{t('reviews.form.email')}</label>
                  <input type="email" id="review-email" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={isSubmitting} placeholder={t('reviews.form.email_placeholder')} />
                </div>

                <div className="form-group">
                  <label>{t('reviews.form.rating')}</label>
                  <div className="rating-selector">
                    <Rating
                      onClick={handleRating}
                      ratingValue={rating}
                      allowFraction={false}
                      size={30}
                      fillColor="#facc15"
                      emptyColor="#cccccc"
                      transition
                      readonly={isSubmitting}
                    />
                  </div>
                  {formError === t('reviews.form.error_rating_required') && <p style={{color: 'red', fontSize: '0.9em', marginTop: '5px'}}>{formError}</p>}
                </div>

                <div className="form-group">
                  <label htmlFor="review-message">{t('reviews.form.message')}</label>
                  <textarea id="review-message" rows={4} required value={message} onChange={(e) => setMessage(e.target.value)} disabled={isSubmitting} placeholder={t('reviews.form.message_placeholder')}></textarea>
                </div>

                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? t('reviews.form.submitting') : t('reviews.form.submit')}
                </button>
              </form>

            </div>
          </div>
        )}
        {/* --- FIN MODALE --- */}

      </div>
    </section>
  );
};

export default Reviews;

