import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import '../../assets/styles/reviews.css'; // Assure-toi que ce chemin est correct
import { Link } from 'react-router-dom';
// Importe ton service API si nécessaire (pour l'URL de base VITE_API_URL)
// import apiService from '../../services/api.service'; // Adapte si tu l'utilises pour l'URL

const Reviews = () => {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  // const [showReviewForm, setShowReviewForm] = useState(false); // Commenté pour le test

  // --- États pour le formulaire ---
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);
  // --- Fin États formulaire ---

  // Données d'exemple pour les avis affichés (gardées pour le moment)
  const reviewsData = [
    { id: 1, name: "Jean Dupont", role: "Artiste indépendant", avatar: "/src/assets/images/avatars/avatar-1.jpg", rating: 5, text: "Grâce à MDMC, j'ai pu augmenter ma visibilité de 300% en seulement 2 mois. Leur expertise en YouTube Ads a transformé ma carrière !", date: "15/03/2025" },
    { id: 2, name: "Studio Mélodie", role: "Label indépendant", avatar: "/src/assets/images/avatars/avatar-2.jpg", rating: 5, text: "Nous travaillons avec MDMC depuis plus d'un an et les résultats sont exceptionnels. Leur approche stratégique et leur connaissance du marché musical font toute la différence.", date: "02/04/2025" },
    { id: 3, name: "Marie Lambert", role: "Chanteuse", avatar: "/src/assets/images/avatars/avatar-3.jpg", rating: 4, text: "Une équipe professionnelle qui comprend vraiment les besoins des artistes. Leur campagne TikTok a permis à mon single d'atteindre plus de 500 000 vues !", date: "22/03/2025" }
  ];

  // Effet pour le carrousel d'avis (si reviewsData n'est pas vide)
  useEffect(() => {
    if (reviewsData.length === 0) return; // Ne pas démarrer l'intervalle si pas d'avis
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
  // const openReviewForm = () => { ... }; // Pas besoin d'ouvrir/fermer pour ce test
  // const closeReviewForm = () => { ... }; // Pas besoin d'ouvrir/fermer pour ce test

  const handleRatingClick = (starValue) => {
    // *** DEBUG CONSOLE LOG ***
    console.log('Rating onClick triggered:', starValue);
    setRating(starValue);
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
        console.error("Erreur: VITE_API_URL non définie !");
        setFormError(t('reviews.form.error_config'));
        setIsSubmitting(false);
        return;
    }
    try {
      const response = await fetch(`${apiUrl}/reviews`, { // Assure-toi que le chemin est juste /reviews
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      console.log('API Response:', result);
      setFormSuccess(t('reviews.form.success'));
      setName(''); setEmail(''); setRating(0); setMessage('');
      setTimeout(() => setFormSuccess(null), 5000);
    } catch (error) {
      console.error("Erreur lors de la soumission de l'avis:", error);
      setFormError(error.message || t('reviews.form.error_generic'));
    } finally {
      setIsSubmitting(false);
    }
  };
  // --- Fin Fonctions formulaire ---


  return (
    // La balise <section> commence ici
    <section id="reviews" className="reviews-section">
      {/* La balise <div className="container"> commence ici */}
      <div className="container">
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
               <button
                 key={index}
                 className={`nav-dot ${index === activeIndex ? 'active' : ''}`}
                 onClick={() => goToReview(index)}
                 aria-label={`Voir l'avis ${index + 1}`}
               />
             ))}
           </div>
        </div>
        {/* Fin affichage carrousel */}


        <div className="reviews-actions">
           <button className="btn btn-primary">{t('reviews.leave_review')}</button>
           <Link to="/all-reviews" className="btn btn-secondary">{t('reviews.view_all')}</Link>
         </div>

         {/* --- FORMULAIRE DE TEST AFFICHÉ DIRECTEMENT --- */}
         <div style={{ border: '2px solid red', padding: '20px', marginTop: '30px' }}>
           <h3>{t('reviews.form.title')} (Test Hors Modal)</h3>
           <form onSubmit={submitReview}>
             {formError && <p className="form-error">{formError}</p>}
             {formSuccess && <p className="form-success">{formSuccess}</p>}

             <div className="form-group">
               <label htmlFor="name">{t('reviews.form.name')}</label>
               <input
                 type="text"
                 id="name"
                 required
                 value={name}
                 onChange={(e) => {
                   console.log('Name onChange triggered:', e.target.value);
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
               <div className="rating-selector">
                 {[1, 2, 3, 4, 5].map((starValue) => (
                   <span
                     key={starValue}
                     className={`star-selector ${starValue <= rating ? 'filled' : 'empty'}`}
                     onClick={() => !isSubmitting && handleRatingClick(starValue)}
                     style={{ cursor: isSubmitting ? 'default' : 'pointer' }}
                   >
                     ★
                   </span>
                 ))}
               </div>
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

      {/* La balise <div className="container"> doit être fermée AVANT </section> */}
      </div> {/* <<< === BALISE FERMANTE AJOUTÉE ICI === */}
    </section> // <-- La balise <section> est maintenant correctement fermée après le div.container
  );
};

export default Reviews;
