import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import '../../assets/styles/reviews.css';
import { Link } from 'react-router-dom';
// Supposons que tu aies un client API (axios ou fetch wrapper)
// import apiClient from '../api/client'; // Adapte le chemin

const Reviews = () => {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);

  // --- États pour le formulaire --- AJOUTÉ ---
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState(0); // 0 ou null pour indiquer aucune sélection initiale
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // Pour gérer l'état de soumission
  const [formError, setFormError] = useState(null); // Pour afficher les erreurs
  const [formSuccess, setFormSuccess] = useState(null); // Pour afficher le succès
  // --- Fin États formulaire ---

  // ... (reste de ton code existant : reviews data, useEffect, renderStars, goToReview) ...

  // --- Fonctions pour le formulaire --- MODIFIÉ / AJOUTÉ ---
  const openReviewForm = () => {
    // Réinitialiser le formulaire quand on l'ouvre
    setName('');
    setEmail('');
    setRating(0);
    setMessage('');
    setFormError(null);
    setFormSuccess(null);
    setIsSubmitting(false);
    setShowReviewForm(true);
  };

  const closeReviewForm = () => {
    setShowReviewForm(false);
  };

  const handleRatingClick = (starValue) => {
    setRating(starValue); // Met à jour l'état de la note
  };

  const submitReview = async (e) => { // Rendre la fonction async pour l'appel API
    e.preventDefault();
    setFormError(null); // Réinitialiser les erreurs
    setFormSuccess(null);

    if (rating === 0) {
        setFormError(t('reviews.form.error_rating_required')); // Validation simple
        return;
    }

    setIsSubmitting(true); // Désactiver le bouton pendant l'envoi

    const reviewData = {
      name,
      email,
      rating,
      message
    };

    try {
      // --- Appel API Backend --- AJOUTÉ ---
      // Remplace par ton vrai appel API (avec fetch ou axios)
      // Assure-toi que l'URL de base de l'API est correcte !
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/reviews`, { // Utilise la variable d'environnement VITE_API_URL
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify(reviewData),
       });

      if (!response.ok) {
        // Essayer de lire le message d'erreur du backend s'il y en a un
         const errorData = await response.json().catch(() => ({})); // Gère le cas où le corps n'est pas du JSON valide
         throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json(); // Lire la réponse du backend
      console.log('API Response:', result); // Pour déboguer
      // --- Fin Appel API ---

      setFormSuccess(t('reviews.form.success')); // Afficher message succès

      // Optionnel : Fermer après un délai ou laisser ouvert avec le message
      setTimeout(() => {
         closeReviewForm();
       }, 3000); // Ferme après 3 secondes

    } catch (error) {
      console.error("Erreur lors de la soumission de l'avis:", error);
      setFormError(error.message || t('reviews.form.error_generic')); // Afficher l'erreur
    } finally {
      setIsSubmitting(false); // Réactiver le bouton
    }
  };
  // --- Fin Fonctions formulaire ---

  // ... (useEffect existant) ...
  // ... (renderStars existant - sera utilisé pour l'affichage, pas pour la sélection) ...
  // ... (goToReview existant) ...

  return (
    <section id="reviews" className="reviews-section">
       {/* ... (Affichage des avis existants - pas de changement ici) ... */}
       <div className="container">
         {/* ... */}
         <div className="reviews-actions">
           <button className="btn btn-primary" onClick={openReviewForm}>
             {t('reviews.leave_review')}
           </button>
           {/* ... */}
         </div>
       </div>

       {/* Modal pour le formulaire d'avis - MODIFIÉ */}
       {showReviewForm && (
         <div className="review-form-modal">
           <div className="review-form-container">
             <button className="close-button" onClick={closeReviewForm}>×</button>
             <h3>{t('reviews.form.title')}</h3>
             <form onSubmit={submitReview}>
               {/* Affichage des messages d'erreur/succès */}
               {formError && <p className="form-error">{formError}</p>}
               {formSuccess && <p className="form-success">{formSuccess}</p>}

               <div className="form-group">
                 <label htmlFor="name">{t('reviews.form.name')}</label>
                 {/* --- Input Contrôlé --- MODIFIÉ --- */}
                 <input
                   type="text"
                   id="name"
                   required
                   value={name}
                   onChange={(e) => setName(e.target.value)}
                   disabled={isSubmitting} // Désactiver pendant la soumission
                 />
               </div>
               <div className="form-group">
                 <label htmlFor="email">{t('reviews.form.email')}</label>
                 {/* --- Input Contrôlé --- MODIFIÉ --- */}
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
                 {/* --- Étoiles Contrôlées --- MODIFIÉ --- */}
                 <div className="rating-selector">
                   {[1, 2, 3, 4, 5].map((starValue) => (
                     <span
                       key={starValue}
                       className={`star-selector ${starValue <= rating ? 'filled' : 'empty'}`}
                       onClick={() => !isSubmitting && handleRatingClick(starValue)} // N'autorise le clic que si pas en soumission
                       style={{ cursor: isSubmitting ? 'default' : 'pointer' }}
                     >
                       ★
                     </span>
                   ))}
                 </div>
               </div>
               <div className="form-group">
                 <label htmlFor="message">{t('reviews.form.message')}</label>
                 {/* --- Textarea Contrôlé --- MODIFIÉ --- */}
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
         </div>
       )}
     </section>
   );
 };

 export default Reviews;
