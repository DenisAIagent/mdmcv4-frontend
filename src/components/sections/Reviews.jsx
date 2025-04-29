import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Rating } from 'react-simple-star-rating';
import '../../assets/styles/reviews.css'; // CSS principal
import '../../assets/styles/modal.css'; // <<< Importe le CSS de la modale

const Reviews = () => {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);

  const reviewsData = [ // Données d'exemple
    { _id: 'mock1', name: "Jean Dupont", role: "Artiste indépendant", avatar: "/src/assets/images/avatars/avatar-1.jpg", rating: 5, text: "Grâce à MDMC...", date: "15/03/2025", createdAt: "2025-03-15T10:00:00Z" },
    { _id: 'mock2', name: "Studio Mélodie", role: "Label indépendant", avatar: "/src/assets/images/avatars/avatar-2.jpg", rating: 5, text: "Nous travaillons avec...", date: "02/04/2025", createdAt: "2025-04-02T10:00:00Z" },
    { _id: 'mock3', name: "Marie Lambert", role: "Chanteuse", avatar: "/src/assets/images/avatars/avatar-3.jpg", rating: 4, text: "Une équipe pro...", date: "22/03/2025", createdAt: "2025-03-22T10:00:00Z" }
  ];

  useEffect(() => { // Carrousel
    if (reviewsData.length === 0) return;
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % reviewsData.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [reviewsData.length]);

  const renderDisplayStars = (displayRating) => { // Étoiles affichage
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(<span key={i} className={`star ${i <= displayRating ? 'filled' : 'empty'}`}>★</span>);
    }
    return stars;
  };

  const goToReview = (index) => { setActiveIndex(index); }; // Nav carrousel

  const handleRating = (rate) => { setRating(rate); }; // Rating formulaire

  const submitReview = async (e) => { // Soumission formulaire
    e.preventDefault();
    setFormError(null); setFormSuccess(null);
    if (rating === 0) { setFormError(t('reviews.form.error_rating_required')); return; }
    setIsSubmitting(true);
    const reviewData = { name, email, rating, message };
    const apiUrl = import.meta.env.VITE_API_URL;
    if (!apiUrl) { setFormError(t('reviews.form.error_config')); setIsSubmitting(false); return; }
    try {
      const response = await fetch(`${apiUrl}/reviews`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(reviewData) });
      if (!response.ok) { const errorData = await response.json().catch(() => ({ message: 'Réponse invalide ou non-JSON du serveur' })); throw new Error(errorData.message || `Erreur HTTP ${response.status}`); }
      const result = await response.json();
      setFormSuccess(t('reviews.form.success'));
      setName(''); setEmail(''); setRating(0); setMessage('');
      setTimeout(() => { setFormSuccess(null); setShowReviewForm(false); }, 3000);
    } catch (error) { setFormError(error.message || t('reviews.form.error_generic')); }
    finally { setIsSubmitting(false); }
  };

  const openModal = () => { setShowReviewForm(true); setFormError(null); setFormSuccess(null); }; // Ouvrir modale
  const closeModal = () => { setShowReviewForm(false); }; // Fermer modale

  return ( // Rendu JSX
    <section id="reviews" className="reviews-section">
      <div className="container">
        <h2 className="section-title">{t('reviews.title')}</h2>
        <p className="section-subtitle">{t('reviews.subtitle')}</p>
        {/* Carrousel */}
        {reviewsData.length > 0 ? ( <div className="reviews-container"> {/* ... Carrousel JSX ... */} </div> ) : ( <p>{t('reviews.no_reviews')}</p> )}
        {/* Boutons */}
        <div className="reviews-actions">
          <button className="btn btn-primary" onClick={openModal}>{t('reviews.leave_review')}</button>
          <Link to="/all-reviews" className="btn btn-secondary">{t('reviews.view_all')}</Link>
        </div>
        {/* Modale */}
        {showReviewForm && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close-button" onClick={closeModal} aria-label={t('common.close') || 'Fermer'}>&times;</button>
              <h3>{t('reviews.form.title')}</h3>
              <form onSubmit={submitReview}>
                {formError && <p className="form-error" style={{color: 'red'}}>{formError}</p>}
                {formSuccess && <p className="form-success" style={{color: 'green'}}>{formSuccess}</p>}
                {/* Champs du formulaire */}
                <div className="form-group"><label htmlFor="review-name">{t('reviews.form.name')}</label><input type="text" id="review-name" required value={name} onChange={(e) => setName(e.target.value)} disabled={isSubmitting} placeholder={t('reviews.form.name_placeholder')} /></div>
                <div className="form-group"><label htmlFor="review-email">{t('reviews.form.email')}</label><input type="email" id="review-email" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={isSubmitting} placeholder={t('reviews.form.email_placeholder')} /></div>
                <div className="form-group"><label>{t('reviews.form.rating')}</label><div className="rating-selector"><Rating onClick={handleRating} ratingValue={rating} allowFraction={false} size={30} fillColor="#facc15" emptyColor="#cccccc" transition readonly={isSubmitting}/></div>{formError === t('reviews.form.error_rating_required') && <p style={{color: 'red'}}>{formError}</p>}</div>
                <div className="form-group"><label htmlFor="review-message">{t('reviews.form.message')}</label><textarea id="review-message" rows={4} required value={message} onChange={(e) => setMessage(e.target.value)} disabled={isSubmitting} placeholder={t('reviews.form.message_placeholder')}></textarea></div>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>{isSubmitting ? t('reviews.form.submitting') : t('reviews.form.submit')}</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Reviews;
