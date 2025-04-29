import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Rating } from 'react-simple-star-rating';
import Modal from 'react-modal'; // Importer react-modal
import '../../assets/styles/reviews.css';
import '../../assets/styles/modal.css'; // Importe notre CSS avec les animations

// Configuration initiale react-modal
Modal.setAppElement('#root'); // Adapte si besoin

const Reviews = () => {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);

  // Données exemple (inchangées)
  const reviewsData = [ /* ... */ ];

  // useEffect carrousel (inchangé)
  useEffect(() => { /* ... */ }, [reviewsData.length]);

  // renderDisplayStars (inchangé)
  const renderDisplayStars = (displayRating) => { /* ... */ };

  // goToReview (inchangé)
  const goToReview = (index) => { /* ... */ };

  // handleRating (inchangé)
  const handleRating = (rate) => { setRating(rate); };

  // submitReview (inchangé par rapport à la version react-modal précédente)
  const submitReview = async (e) => {
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
      setTimeout(() => { setFormSuccess(null); closeModal(); }, 3000);
    } catch (error) { setFormError(error.message || t('reviews.form.error_generic')); }
    finally { setIsSubmitting(false); }
  };

  // Fonctions open/close modal (inchangées)
  const openModal = () => { setModalIsOpen(true); setFormError(null); setFormSuccess(null); };
  const closeModal = () => { setModalIsOpen(false); };

  // --- PAS BESOIN de customModalStyles ici, on utilise les classes CSS ---

  return (
    <section id="reviews" className="reviews-section">
      <div className="container">
        <h2 className="section-title">{t('reviews.title')}</h2>
        <p className="section-subtitle">{t('reviews.subtitle')}</p>

        {/* Carrousel (inchangé) */}
        {/* ... */}

        {/* Boutons d'action */}
        <div className="reviews-actions">
          <button className="btn btn-primary" onClick={openModal}>{t('reviews.leave_review')}</button>
          <Link to="/all-reviews" className="btn btn-secondary">{t('reviews.view_all')}</Link>
        </div>

        {/* --- Utilisation de Modal avec les classes CSS --- */}
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel={t('reviews.form.title')}
          // === AJOUTS POUR LES ANIMATIONS ===
          closeTimeoutMS={300} // Important: doit correspondre à la durée de transition CSS (300ms)
          className="ReactModal__Content" // Applique la classe de base au contenu
          overlayClassName="ReactModal__Overlay" // Applique la classe de base à l'overlay
          // === FIN AJOUTS ===
        >
          {/* Contenu de la modale (identique à avant) */}
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
        </Modal>
        {/* --- Fin de react-modal --- */}

      </div>
    </section>
  );
};

export default Reviews;
