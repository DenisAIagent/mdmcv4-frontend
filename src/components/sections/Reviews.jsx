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

  // États pour le formulaire - UX simplifiée en une seule étape
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 0,
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);
  const [currentStep, setCurrentStep] = useState('form'); // 'form' | 'success'

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

  // Gestion du formulaire moderne
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formError) setFormError(null); // Clear error on typing
  };

  const handleRatingChange = (rating) => {
    setFormData(prev => ({ ...prev, rating }));
    if (formError) setFormError(null);
  };

  const validateForm = () => {
    const { name, email, rating, message } = formData;
    
    if (!name?.trim()) {
      setFormError('Veuillez entrer votre nom');
      return false;
    }
    
    if (!email?.trim()) {
      setFormError('Veuillez entrer votre email');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setFormError('Veuillez entrer un email valide');
      return false;
    }
    
    if (!rating || rating === 0) {
      setFormError('Veuillez donner une note');
      return false;
    }
    
    if (!message?.trim() || message.trim().length < 10) {
      setFormError('Votre message doit contenir au moins 10 caractères');
      return false;
    }
    
    return true;
  };

  const submitReview = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setFormError(null);

    try {
      await apiService.reviews.createReview(formData);
      setCurrentStep('success');
      
      // Reset après succès
      setTimeout(() => {
        closeModal();
        resetForm();
      }, 3000);

    } catch (error) {
      console.error('Erreur soumission avis:', error);
      setFormError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', rating: 0, message: '' });
    setFormError(null);
    setFormSuccess(null);
    setCurrentStep('form');
    setIsSubmitting(false);
  };

  const openModal = () => {
    setModalIsOpen(true);
    resetForm();
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setTimeout(resetForm, 300); // Reset après fermeture de la modal
  };

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
            <p className="error-message" style={{ color: 'red', textAlign: 'center' }}>{fetchApprovedError}</p>
          ) : approvedReviews.length > 0 ? (
            <>
              <div className="reviews-carousel">
                {approvedReviews.map((review, index) => (
                  <div key={review._id} className={`review-card ${index === activeIndex ? 'active' : ''}`} style={{ transform: `translateX(${(index - activeIndex) * 100}%)` }}>
                    <div className="review-header">
                      <div className="review-avatar">
                        <img src={review.avatar || '/src/assets/images/avatars/default-avatar.png'} alt={`Avatar de ${review.name}`} loading="lazy" onError={(e) => { e.target.onerror = null; e.target.src = '/src/assets/images/avatars/default-avatar.png'; }} />
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
            <p style={{ textAlign: 'center' }}>{t('reviews.no_reviews')}</p>
          )}
        </div>

        {/* Boutons d'action */}
        <div className="reviews-actions">
          <button className="btn btn-primary modern-review-trigger" onClick={openModal}>
            <span className="btn-icon">⭐</span>
            Laisser un avis
          </button>
          <Link to="/tous-les-avis" className="btn btn-secondary">
            Voir tous les avis
          </Link>
        </div>

        {/* Modal moderne ultra-fluide */}
        <Modal 
          isOpen={modalIsOpen} 
          onRequestClose={closeModal}
          className="ultra-modern-review-modal"
          overlayClassName="ultra-modern-overlay"
          closeTimeoutMS={300}
          contentLabel="Laisser un avis"
        >
          <div className="modern-modal-wrapper">
            {/* Header avec animation */}
            <div className="modern-modal-header">
              <div className="header-content">
                <div className="modal-icon">
                  <div className="icon-wrapper">
                    {currentStep === 'success' ? '✨' : '💭'}
                  </div>
                </div>
                <div className="header-text">
                  <h2 className="modal-title">
                    {currentStep === 'success' ? 'Merci !' : 'Partagez votre expérience'}
                  </h2>
                  <p className="modal-subtitle">
                    {currentStep === 'success' 
                      ? 'Votre avis a été envoyé avec succès' 
                      : 'Votre avis nous aide à nous améliorer'
                    }
                  </p>
                </div>
              </div>
              <button 
                className="modern-close-btn" 
                onClick={closeModal}
                aria-label="Fermer"
              >
                <span className="close-icon">×</span>
              </button>
            </div>

            {/* Body avec transitions */}
            <div className="modern-modal-body">
              {currentStep === 'success' ? (
                <div className="success-animation">
                  <div className="success-checkmark">
                    <div className="check-icon">✓</div>
                  </div>
                  <p className="success-message">
                    Votre avis sera publié après validation
                  </p>
                </div>
              ) : (
                <form onSubmit={submitReview} className="ultra-modern-form">
                  {formError && (
                    <div className="error-toast">
                      <span className="error-icon">⚠️</span>
                      {formError}
                    </div>
                  )}

                  {/* Rating en premier - plus visuel */}
                  <div className="rating-section">
                    <label className="rating-label">Comment nous évaluez-vous ?</label>
                    <div className="rating-wrapper">
                      <Rating
                        onClick={handleRatingChange}
                        ratingValue={formData.rating}
                        size={45}
                        transition
                        fillColor="#FFD700"
                        emptyColor="#E5E5E5"
                        allowHalfIcon
                        className="custom-rating-stars"
                      />
                      <span className="rating-text">
                        {formData.rating === 0 && "Cliquez sur les étoiles"}
                        {formData.rating === 1 && "😞 Pas terrible"}
                        {formData.rating === 2 && "😐 Moyen"}
                        {formData.rating === 3 && "🙂 Bien"}
                        {formData.rating === 4 && "😊 Très bien"}
                        {formData.rating === 5 && "🤩 Excellent !"}
                      </span>
                    </div>
                  </div>

                  {/* Nom et Email côte à côte */}
                  <div className="form-row">
                    <div className="form-group">
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="modern-input"
                        placeholder="Votre nom"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="modern-input"
                        placeholder="votre@email.com"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div className="form-group">
                    <textarea
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      className="modern-textarea"
                      placeholder="Parlez-nous de votre expérience... (minimum 10 caractères)"
                      rows={4}
                      disabled={isSubmitting}
                      maxLength={250}
                    />
                    <div className="char-counter">
                      {formData.message.length}/250
                    </div>
                  </div>

                  {/* Submit button avec animation */}
                  <button 
                    type="submit" 
                    className={`submit-btn ${isSubmitting ? 'submitting' : ''}`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="loading-spinner"></div>
                        <span>Envoi en cours...</span>
                      </>
                    ) : (
                      <>
                        <span>Envoyer mon avis</span>
                        <span className="btn-arrow">→</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </Modal>
      </div>
    </section>
  );
};

export default Reviews;
