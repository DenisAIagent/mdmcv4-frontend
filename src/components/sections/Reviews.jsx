import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import '../../assets/styles/reviews.css';
import { Link } from 'react-router-dom';

// Composant pour la section des avis clients
const Reviews = () => {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  
  // Données d'exemple pour les avis clients
  // Dans une version réelle, ces données viendraient d'une API ou d'une base de données
  const reviews = [
    {
      id: 1,
      name: "Jean Dupont",
      role: "Artiste indépendant",
      avatar: "/src/assets/images/avatars/avatar-1.jpg",
      rating: 5,
      text: "Grâce à MDMC, j'ai pu augmenter ma visibilité de 300% en seulement 2 mois. Leur expertise en YouTube Ads a transformé ma carrière !",
      date: "15/03/2025"
    },
    {
      id: 2,
      name: "Studio Mélodie",
      role: "Label indépendant",
      avatar: "/src/assets/images/avatars/avatar-2.jpg",
      rating: 5,
      text: "Nous travaillons avec MDMC depuis plus d'un an et les résultats sont exceptionnels. Leur approche stratégique et leur connaissance du marché musical font toute la différence.",
      date: "02/04/2025"
    },
    {
      id: 3,
      name: "Marie Lambert",
      role: "Chanteuse",
      avatar: "/src/assets/images/avatars/avatar-3.jpg",
      rating: 4,
      text: "Une équipe professionnelle qui comprend vraiment les besoins des artistes. Leur campagne TikTok a permis à mon single d'atteindre plus de 500 000 vues !",
      date: "22/03/2025"
    }
  ];
  
  // Effet pour faire défiler automatiquement les avis
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % reviews.length);
    }, 8000);
    
    return () => clearInterval(interval);
  }, [reviews.length]);
  
  // Fonction pour générer les étoiles en fonction de la note
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`star ${i <= rating ? 'filled' : 'empty'}`}>
          ★
        </span>
      );
    }
    return stars;
  };
  
  // Fonction pour naviguer vers un avis spécifique
  const goToReview = (index) => {
    setActiveIndex(index);
  };
  
  // Fonction pour ouvrir le formulaire d'avis
  const openReviewForm = () => {
    setShowReviewForm(true);
  };
  
  // Fonction pour fermer le formulaire d'avis
  const closeReviewForm = () => {
    setShowReviewForm(false);
  };
  
  // Fonction pour soumettre un avis
  const submitReview = (e) => {
    e.preventDefault();
    // Dans une version réelle, cela enverrait les données à une API
    alert(t('reviews.form.success'));
    closeReviewForm();
  };
  
  return (
    <section id="reviews" className="reviews-section">
      <div className="container">
        <h2 className="section-title">{t('reviews.title')}</h2>
        <p className="section-subtitle">{t('reviews.subtitle')}</p>
        
        <div className="reviews-container">
          <div className="reviews-carousel">
            {reviews.map((review, index) => (
              <div 
                key={review.id} 
                className={`review-card ${index === activeIndex ? 'active' : ''}`}
                style={{ transform: `translateX(${(index - activeIndex) * 100}%)` }}
              >
                <div className="review-header">
                  <div className="review-avatar">
                    <img src={review.avatar} alt={`Avatar de ${review.name}`} />
                  </div>
                  <div className="review-info">
                    <h3 className="review-name">{review.name}</h3>
                    <p className="review-role">{review.role}</p>
                    <div className="review-rating">
                      {renderStars(review.rating)}
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
            {reviews.map((_, index) => (
              <button 
                key={index} 
                className={`nav-dot ${index === activeIndex ? 'active' : ''}`}
                onClick={() => goToReview(index)}
                aria-label={`Voir l'avis ${index + 1}`}
              />
            ))}
          </div>
        </div>
        
        <div className="reviews-actions">
          <button className="btn btn-primary" onClick={openReviewForm}>
            {t('reviews.leave_review')}
          </button>
          <Link to="/all-reviews" className="btn btn-secondary">
            {t('reviews.view_all')}
          </Link>
        </div>
      </div>
      
      {/* Modal pour le formulaire d'avis */}
      {showReviewForm && (
        <div className="review-form-modal">
          <div className="review-form-container">
            <button className="close-button" onClick={closeReviewForm}>×</button>
            <h3>{t('reviews.form.title')}</h3>
            <form onSubmit={submitReview}>
              <div className="form-group">
                <label htmlFor="name">{t('reviews.form.name')}</label>
                <input type="text" id="name" required />
              </div>
              <div className="form-group">
                <label htmlFor="email">{t('reviews.form.email')}</label>
                <input type="email" id="email" required />
              </div>
              <div className="form-group">
                <label>{t('reviews.form.rating')}</label>
                <div className="rating-selector">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className="star-selector">★</span>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="message">{t('reviews.form.message')}</label>
                <textarea id="message" rows="4" required></textarea>
              </div>
              <button type="submit" className="btn btn-primary">
                {t('reviews.form.submit')}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default Reviews;
