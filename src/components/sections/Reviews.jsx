import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Rating } from 'react-simple-star-rating';
import Modal from 'react-modal';
import apiService from '../../services/api.service';
import '../../assets/styles/reviews.css';
import '../../assets/styles/modern-review-modal.css';

Modal.setAppElement('#root');

const Reviews = () => {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const formRef = useRef(null);

  // États pour le formulaire
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);
  const [formStep, setFormStep] = useState(1); // Pour l'expérience multi-étapes

  // États pour les avis approuvés
  const [approvedReviews, setApprovedReviews] = useState([]);
  const [isLoadingApproved, setIsLoadingApproved] = useState(true);
  const [fetchApprovedError, setFetchApprovedError] = useState(null);

  // Effet pour charger les avis approuvés
  useEffect(() => {
    const fetchApprovedReviews = async () => {
      setIsLoadingApproved(true);
      setFetchApprovedError(null);

      try {
        console.log('Appel API pour avis approuvés via apiService');
        const response = await apiService.reviews.getReviews({ status: 'approved' });

        if (Array.isArray(response.data)) {
          setApprovedReviews(response.data);
          console.log('Avis approuvés chargés:', response.data);
          setActiveIndex(0);
        } else {
          console.error('La réponse de l\'API (avis approuvés) n\'a pas le format attendu:', response);
          setFetchApprovedError("Format de réponse API invalide.");
        }
      } catch (error) {
        console.error("Erreur lors du fetch des avis approuvés:", error);
        setFetchApprovedError("Impossible de charger les avis approuvés.");
      } finally {
        setIsLoadingApproved(false);
      }
    };

    fetchApprovedReviews();
  }, []);

  // Effet pour le carrousel
  useEffect(() => {
    if (approvedReviews.length === 0 || isLoadingApproved) return;

    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % approvedReviews.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [approvedReviews, isLoadingApproved]);

  // Fonction pour afficher les étoiles
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

  // Gestion du formulaire
  const handleRating = (rate) => {
    setRating(rate);
  };

  const validateStep = () => {
    if (formStep === 1) {
      if (!name || !email) {
        setFormError(t('reviews.form_error_required_fields'));
        return false;
      }
      // Validation email basique
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setFormError(t('reviews.form_error_invalid_email'));
        return false;
      }
      setFormError(null);
      return true;
    } else if (formStep === 2) {
      if (!rating || !message) {
        setFormError(t('reviews.form_error_required_fields'));
        return false;
      }
      if (message.length < 10) {
        setFormError(t('reviews.form_error_message_too_short'));
        return false;
      }
      setFormError(null);
      return true;
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep()) {
      setFormStep(2);
    }
  };

  const prevStep = () => {
    setFormStep(1);
  };

  const submitReview = async (e) => {
    e.preventDefault();
    
    if (!validateStep()) {
      return;
    }
    
    setIsSubmitting(true);
    setFormError(null);
    
    try {
      const reviewData = {
        name,
        email,
        rating,
        message
      };
      
      await apiService.reviews.createReview(reviewData);
      
      // Réinitialiser le formulaire
      setName('');
      setEmail('');
      setRating(0);
      setMessage('');
      setFormStep(1);
      
      setFormSuccess(t('reviews.form_success'));
      
      // Fermer la modale après un délai
      setTimeout(() => {
        closeModal();
        setFormSuccess(null);
      }, 3000);
      
    } catch (error) {
      console.error('Erreur lors de la soumission de l\'avis:', error);
      setFormError(t('reviews.form_error_submit'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const openModal = () => {
    setModalIsOpen(true);
    setFormError(null);
    setFormSuccess(null);
    setFormStep(1);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  // Rendu JSX
  return (
    <section id="reviews" className="reviews-section">
      <div className="container">
        <h2 className="section-title">{t('reviews.title')}</h2>
        <p className="section-subtitle">{t('reviews.subtitle')}</p>

        {/* Carrousel d'avis */}
        <div className="reviews-container">
          {isLoadingApproved ? (
            <div className="loading-spinner">{t('admin.loading')}</div>
          ) : fetchApprovedError ? (
            <p className="error-message" style={{color: 'red', textAlign: 'center'}}>{fetchApprovedError}</p>
          ) : approvedReviews.length > 0 ? (
            <>
              <div className="reviews-carousel">
                {approvedReviews.map((review, index) => (
                  <div key={review._id} className={`review-card ${index === activeIndex ? 'active' : ''}`} style={{ transform: `translateX(${(index - activeIndex) * 100}%)` }}>
                     <div className="review-header">
                       <div className="review-avatar">
                         <img src={review.avatar || '/src/assets/images/avatars/default-avatar.png'} alt={`Avatar de ${review.name}`} loading="lazy" onError={(e) => { e.target.onerror = null; e.target.src='/src/assets/images/avatars/default-avatar.png'; }}/>
                       </div>
                       <div className="review-info">
                         <h3 className="review-name">{review.name}</h3>
                         {review.title && <p className="review-role">{review.title}</p>}
                         <div className="review-rating">
                           {renderDisplayStars(review.rating)}
                         </div>
                       </div>
                     </div>
                     <div className="review-content">
                       <p className="review-text">"{review.message}"</p>
                       <p className="review-date">{new Date(review.createdAt).toLocaleDateString('fr-FR')}</p>
                     </div>
                  </div>
                ))}
              </div>
              <div className="reviews-navigation">
                {approvedReviews.map((_, index) => (
                  <button key={index} className={`nav-dot ${index === activeIndex ? 'active' : ''}`} onClick={() => goToReview(index)} aria-label={`${t('reviews.go_to_review')} ${index + 1}`} />
                ))}
              </div>
            </>
          ) : (
            <p style={{textAlign: 'center'}}>{t('reviews.no_reviews')}</p>
          )}
        </div>

        {/* Boutons d'action */}
        <div className="reviews-actions">
          <button className="btn btn-primary" onClick={openModal}>{t('reviews.leave_review')}</button>
          <Link to="/all-reviews" className="btn btn-secondary">{t('reviews.view_all')}</Link>
        </div>

        {/* Modale moderne pour laisser un avis */}
        <Modal 
          isOpen={modalIsOpen} 
          onRequestClose={closeModal}
          className="modern-review-modal"
          overlayClassName="modern-review-overlay"
          contentLabel={t('reviews.leave_review')}
          closeTimeoutMS={300}
        >
          <div className="modern-modal-header">
            <h2>{formStep === 1 ? t('reviews.leave_review') : t('reviews.rate_experience')}</h2>
            <button className="modern-modal-close" onClick={closeModal} aria-label="Fermer"></button>
          </div>
          
          <div className="modern-modal-body">
            {formSuccess ? (
              <div className="modern-form-success">
                {formSuccess}
              </div>
            ) : (
              <form ref={formRef} onSubmit={submitReview} className="modern-review-form">
                {formError && <div className="modern-form-error">{formError}</div>}
                
                {formStep === 1 ? (
                  <>
                    <div className="modern-form-group">
                      <label htmlFor="name">{t('reviews.form_name')}</label>
                      <input
                        type="text"
                        id="name"
                        className="modern-form-input"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={isSubmitting}
                        required
                        placeholder={t('reviews.form_name_placeholder')}
                      />
                    </div>
                    
                    <div className="modern-form-group">
                      <label htmlFor="email">{t('reviews.form_email')}</label>
                      <input
                        type="email"
                        id="email"
                        className="modern-form-input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isSubmitting}
                        required
                        placeholder={t('reviews.form_email_placeholder')}
                      />
                    </div>
                    
                    <div className="modern-form-actions">
                      <button 
                        type="button" 
                        className="modern-btn modern-btn-secondary" 
                        onClick={closeModal}
                        disabled={isSubmitting}
                      >
                        {t('common.cancel')}
                      </button>
                      <button 
                        type="button" 
                        className="modern-btn modern-btn-primary"
                        onClick={nextStep}
                        disabled={isSubmitting}
                      >
                        {t('common.next')}
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="modern-form-group modern-rating-group">
                      <label>{t('reviews.form_rating')}</label>
                      <div className="modern-rating-stars">
                        <Rating
                          onClick={handleRating}
                          ratingValue={rating}
                          size={35}
                          transition
                          fillColor="#ff3a3a"
                          emptyColor="rgba(255, 255, 255, 0.2)"
                          className="custom-rating"
                        />
                      </div>
                    </div>
                    
                    <div className="modern-form-group">
                      <label htmlFor="message">{t('reviews.form_message')}</label>
                      <textarea
                        id="message"
                        className="modern-form-input modern-form-textarea"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        disabled={isSubmitting}
                        required
                        placeholder={t('reviews.form_message_placeholder')}
                        rows={5}
                      />
                    </div>
                    
                    <div className="modern-form-actions">
                      <button 
                        type="button" 
                        className="modern-btn modern-btn-secondary" 
                        onClick={prevStep}
                        disabled={isSubmitting}
                      >
                        {t('common.back')}
                      </button>
                      <button 
                        type="submit" 
                        className="modern-btn modern-btn-primary"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <span className="modern-loading-spinner"></span>
                            {t('common.submitting')}
                          </>
                        ) : t('common.submit')}
                      </button>
                    </div>
                  </>
                )}
              </form>
            )}
          </div>
        </Modal>
      </div>
    </section>
  );
};

export default Reviews;

