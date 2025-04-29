import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Rating } from 'react-simple-star-rating';
import Modal from 'react-modal'; // <<< Importer react-modal
import '../../assets/styles/reviews.css';
// On peut garder modal.css pour styler le contenu *intérieur* si besoin
// mais on n'a plus besoin des styles pour .modal-overlay
import '../../assets/styles/modal.css';

// --- Configuration initiale pour react-modal (important pour l'accessibilité) ---
// Met l'élément racine de ton application (souvent #root ou #app dans index.html)
// Si tu ne sais pas, inspecte ton HTML ou essaie '#root'
Modal.setAppElement('#root'); // <<< ADAPTE SI NÉCESSAIRE

const Reviews = () => {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);

  // --- État pour la visibilité de la modale (maintenant appelé modalIsOpen) ---
  const [modalIsOpen, setModalIsOpen] = useState(false); // <<< Renommé pour clarté

  // --- États pour le formulaire (inchangés) ---
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);

  // Données d'exemple (inchangées)
  const reviewsData = [
     { _id: 'mock1', name: "Jean Dupont", role: "Artiste indépendant", avatar: "/src/assets/images/avatars/avatar-1.jpg", rating: 5, text: "Grâce à MDMC...", date: "15/03/2025", createdAt: "2025-03-15T10:00:00Z" },
     { _id: 'mock2', name: "Studio Mélodie", role: "Label indépendant", avatar: "/src/assets/images/avatars/avatar-2.jpg", rating: 5, text: "Nous travaillons avec...", date: "02/04/2025", createdAt: "2025-04-02T10:00:00Z" },
     { _id: 'mock3', name: "Marie Lambert", role: "Chanteuse", avatar: "/src/assets/images/avatars/avatar-3.jpg", rating: 4, text: "Une équipe pro...", date: "22/03/2025", createdAt: "2025-03-22T10:00:00Z" }
  ];

  // Effet carrousel (inchangé)
  useEffect(() => { /* ... */ }, [reviewsData.length]);

  // renderDisplayStars (inchangé)
  const renderDisplayStars = (displayRating) => { /* ... */ };

  // goToReview (inchangé)
  const goToReview = (index) => { /* ... */ };

  // handleRating (inchangé)
  const handleRating = (rate) => { setRating(rate); };

  // submitReview (légèrement modifié pour fermer la modale react-modal)
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
      setTimeout(() => { setFormSuccess(null); closeModal(); }, 3000); // <<< Utilise closeModal()
    } catch (error) { setFormError(error.message || t('reviews.form.error_generic')); }
    finally { setIsSubmitting(false); }
  };

  // --- Fonctions pour ouvrir/fermer la modale react-modal ---
  const openModal = () => {
    setModalIsOpen(true);
    setFormError(null);
    setFormSuccess(null);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  // --- Styles personnalisés pour react-modal (Optionnel, pour un effet sympa) ---
  const customModalStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      maxWidth: '550px', // Limite la largeur
      width: '90%',     // Prend 90% sur mobile
      border: 'none', // Enlève la bordure par défaut
      borderRadius: '10px', // Coins arrondis
      padding: '30px 40px', // Padding intérieur
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)', // Ombre
      maxHeight: '90vh', // Limite la hauteur
      overflow: 'auto' // Ajoute un scroll si besoin
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.75)', // Fond plus sombre
      zIndex: 1000, // Assure qu'elle est au-dessus
      // Effet de fondu pour l'overlay
      transition: 'opacity 300ms ease-in-out'
    }
  };


  return (
    <section id="reviews" className="reviews-section">
      <div className="container">
        <h2 className="section-title">{t('reviews.title')}</h2>
        <p className="section-subtitle">{t('reviews.subtitle')}</p>

        {/* Carrousel (inchangé) */}
        {/* ... */}

        {/* Boutons d'action */}
        <div className="reviews-actions">
          <button className="btn btn-primary" onClick={openModal}> {/* Ouvre la modale */}
            {t('reviews.leave_review')}
          </button>
          <Link to="/all-reviews" className="btn btn-secondary">{t('reviews.view_all')}</Link>
        </div>

        {/* --- Utilisation du composant Modal de react-modal --- */}
        <Modal
          isOpen={modalIsOpen} // Contrôle l'ouverture
          onRequestClose={closeModal} // Fonction appelée pour fermer (clic extérieur, Echap)
          style={customModalStyles} // Applique nos styles personnalisés
          contentLabel={t('reviews.form.title')} // Pour l'accessibilité
          closeTimeoutMS={300} // Délai pour l'animation de fermeture (optionnel)
        >
          {/* Contenu de la modale */}
          {/* Bouton de fermeture (style à définir dans modal.css si besoin) */}
          <button className="modal-close-button" onClick={closeModal} aria-label={t('common.close') || 'Fermer'}>
             &times;
           </button>

          <h3>{t('reviews.form.title')}</h3>
          <form onSubmit={submitReview}>
             {formError && <p className="form-error" style={{color: 'red'}}>{formError}</p>}
             {formSuccess && <p className="form-success" style={{color: 'green'}}>{formSuccess}</p>}

             {/* Champs du formulaire (identiques à avant) */}
             <div className="form-group"><label htmlFor="review-name">{t('reviews.form.name')}</label><input type="text" id="review-name" required value={name} onChange={(e) => setName(e.target.value)} disabled={isSubmitting} placeholder={t('reviews.form.name_placeholder')} /></div>
             <div className="form-group"><label htmlFor="review-email">{t('reviews.form.email')}</label><input type="email" id="review-email" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={isSubmitting} placeholder={t('reviews.form.email_placeholder')} /></div>
             <div className="form-group"><label>{t('reviews.form.rating')}</label><div className="rating-selector"><Rating onClick={handleRating} ratingValue={rating} allowFraction={false} size={30} fillColor="#facc15" emptyColor="#cccccc" transition readonly={isSubmitting}/></div>{formError === t('reviews.form.error_rating_required') && <p style={{color: 'red'}}>{formError}</p>}</div>
             <div className="form-group"><label htmlFor="review-message">{t('reviews.form.message')}</label><textarea id="review-message" rows={4} required value={message} onChange={(e) => setMessage(e.target.value)} disabled={isSubmitting} placeholder={t('reviews.form.message_placeholder')}></textarea></div>

             <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
               {isSubmitting ? t('reviews.form.submitting') : t('reviews.form.submit')}
             </button>
           </form>
          {/* Fin du contenu de la modale */}
        </Modal>
        {/* --- Fin de react-modal --- */}

      </div>
    </section>
  );
};

export default Reviews;
