import React, { useState, useEffect } from 'react'; // Import React et hooks
import { useTranslation } from 'react-i18next'; // Pour les traductions
import { Link } from 'react-router-dom'; // Pour le lien "Voir tous les avis"
import { Rating } from 'react-simple-star-rating'; // Pour les étoiles interactives
import '../../assets/styles/reviews.css'; // CSS principal pour la section
import '../../assets/styles/modal.css'; // <<< NOUVEAU CSS pour la modale (à créer)

const Reviews = () => {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0); // Pour le carrousel

  // --- État pour la visibilité de la modale ---
  const [showReviewForm, setShowReviewForm] = useState(false); // <<< RÉINTRODUIT

  // --- États pour le formulaire (inchangés) ---
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);

  // Données d'exemple pour le carrousel (à remplacer par API plus tard)
  const reviewsData = [
    { id: 1, name: "Jean Dupont", role: "Artiste indépendant", avatar: "/src/assets/images/avatars/avatar-1.jpg", rating: 5, text: "...", date: "15/03/2025" },
    { id: 2, name: "Studio Mélodie", role: "Label indépendant", avatar: "/src/assets/images/avatars/avatar-2.jpg", rating: 5, text: "...", date: "02/04/2025" },
    { id: 3, name: "Marie Lambert", role: "Chanteuse", avatar: "/src/assets/images/avatars/avatar-3.jpg", rating: 4, text: "...", date: "22/03/2025" }
  ];

  // Effet pour le carrousel (inchangé)
  useEffect(() => {
    if (reviewsData.length === 0) return;
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % reviewsData.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [reviewsData.length]);

  // Fonction pour afficher les étoiles (non interactives) du carrousel (inchangée)
  const renderDisplayStars = (displayRating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(<span key={i} className={`star ${i <= displayRating ? 'filled' : 'empty'}`}>★</span>);
    }
    return stars;
  };

  // Fonction pour naviguer dans le carrousel (inchangée)
  const goToReview = (index) => {
    setActiveIndex(index);
  };

  // --- Fonctions pour le formulaire (inchangées) ---
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
      const response = await fetch(`${apiUrl}/reviews`, { // Assure-toi que c'est le bon endpoint
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

      // Ferme la modale après succès et efface le message
      setTimeout(() => {
          setFormSuccess(null);
          setShowReviewForm(false); // <<< Ferme la modale
      }, 3000); // Attend 3 secondes avant de fermer

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
    // Réinitialise le formulaire quand on ouvre la modale
    setFormError(null);
    setFormSuccess(null);
    // On ne vide pas forcément les champs ici, l'utilisateur veut peut-être continuer
  };

  const closeModal = () => {
    setShowReviewForm(false);
  };


  return (
    <section id="reviews" className="reviews-section">
      <div className="container">
        <h2 className="section-title">{t('reviews.title')}</h2>
        <p className="section-subtitle">{t('reviews.subtitle')}</p>

        {/* Carrousel d'avis (inchangé) */}
        {reviewsData.length > 0 ? (
          <div className="reviews-container">
            <div className="reviews-carousel">
              {reviewsData.map((review, index) => (
                <div key={review.id} className={`review-card ${index === activeIndex ? 'active' : ''}`} style={{ transform: `translateX(${(index - activeIndex) * 100}%)` }}>
                  {/* ... contenu de la carte d'avis ... */}
                   <div className="review-header">...</div>
                   <div className="review-content">...</div>
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
          {/* === MODIFICATION BOUTON === */}
          <button className="btn btn-primary" onClick={openModal}> {/* <<< Ouvre la modale */}
            {t('reviews.leave_review')}
          </button>
          <Link to="/all-reviews" className="btn btn-secondary">{t('reviews.view_all')}</Link>
        </div>

        {/* --- MODALE POUR LE FORMULAIRE D'AVIS --- */}
        {showReviewForm && ( // <<< Affichage conditionnel
          <div className="modal-overlay" onClick={closeModal}> {/* Fond semi-transparent, ferme au clic extérieur */}
            <div className="modal-content" onClick={(e) => e.stopPropagation()}> {/* Contenu réel, empêche la fermeture au clic intérieur */}
              {/* Bouton pour fermer la modale */}
              <button className="modal-close-button" onClick={closeModal} aria-label={t('common.close') || 'Fermer'}>
                &times; {/* Symbole croix */}
              </button>

              {/* Le formulaire est maintenant ici */}
              <h3>{t('reviews.form.title')}</h3>
              <form onSubmit={submitReview}>
                {formError && <p className="form-error" style={{color: 'red', marginBottom: '15px'}}>{formError}</p>}
                {formSuccess && <p className="form-success" style={{color: 'green', marginBottom: '15px'}}>{formSuccess}</p>}

                {/* Champ Nom */}
                <div className="form-group">
                  <label htmlFor="review-name">{t('reviews.form.name')}</label>
                  <input type="text" id="review-name" required value={name} onChange={(e) => setName(e.target.value)} disabled={isSubmitting} placeholder={t('reviews.form.name_placeholder')} />
                </div>

                {/* Champ Email */}
                <div className="form-group">
                  <label htmlFor="review-email">{t('reviews.form.email')}</label>
                  <input type="email" id="review-email" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={isSubmitting} placeholder={t('reviews.form.email_placeholder')} />
                </div>

                {/* Champ Note (Étoiles Interactives) */}
                <div className="form-group">
                  <label>{t('reviews.form.rating')}</label>
                  <div className="rating-selector">
                    <Rating
                      onClick={handleRating}
                      ratingValue={rating} // Contrôle l'affichage
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

                {/* Champ Message/Avis */}
                <div className="form-group">
                  <label htmlFor="review-message">{t('reviews.form.message')}</label>
                  <textarea id="review-message" rows={4} required value={message} onChange={(e) => setMessage(e.target.value)} disabled={isSubmitting} placeholder={t('reviews.form.message_placeholder')}></textarea>
                </div>

                {/* Bouton de soumission */}
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? t('reviews.form.submitting') : t('reviews.form.submit')}
                </button>
              </form>
              {/* Fin du formulaire */}

            </div> {/* Fin modal-content */}
          </div> // Fin modal-overlay
        )}
        {/* --- FIN MODALE --- */}

      </div> {/* Fin div.container */}
    </section>
  );
};

export default Reviews;
```

**2. Exemple de CSS pour la Modale (`modal.css`) :**

Crée un nouveau fichier CSS (par exemple `src/assets/styles/modal.css`) et colle-y ce code de base. Tu devras peut-être l'adapter à ton design.

```css
/* ===== modal.css ===== */

.modal-overlay {
  position: fixed; /* Se positionne par rapport à la fenêtre */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6); /* Fond noir semi-transparent */
  display: flex;
  align-items: center; /* Centre verticalement */
  justify-content: center; /* Centre horizontalement */
  z-index: 1000; /* S'assurer qu'elle est au-dessus de tout */
  padding: 20px; /* Espace pour éviter que le contenu colle aux bords sur petit écran */
}

.modal-content {
  background-color: #fff; /* Fond blanc pour le contenu */
  padding: 30px 40px; /* Espace intérieur */
  border-radius: 8px; /* Coins arrondis */
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2); /* Ombre portée */
  position: relative; /* Pour positionner le bouton de fermeture */
  max-width: 600px; /* Largeur maximale */
  width: 100%; /* Prend la largeur disponible jusqu'au max-width */
  max-height: 90vh; /* Hauteur maximale (évite de dépasser l'écran) */
  overflow-y: auto; /* Ajoute un scroll si le contenu est trop long */
  animation: fadeIn 0.3s ease-out; /* Petite animation d'apparition */
}

.modal-close-button {
  position: absolute;
  top: 10px;
  right: 15px;
  background: none;
  border: none;
  font-size: 2rem; /* Taille de la croix */
  font-weight: bold;
  color: #aaa; /* Couleur de la croix */
  cursor: pointer;
  line-height: 1;
  padding: 0;
}

.modal-close-button:hover {
  color: #333; /* Couleur au survol */
}

/* Styles pour le formulaire à l'intérieur de la modale */
.modal-content h3 {
  margin-top: 0;
  margin-bottom: 25px;
  text-align: center;
  color: #333;
}

.modal-content .form-group {
  margin-bottom: 20px;
}

.modal-content label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #555;
}

.modal-content input[type="text"],
.modal-content input[type="email"],
.modal-content textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box; /* Inclut padding et border dans la largeur */
}
.modal-content input:focus,
.modal-content textarea:focus {
    border-color: var(--admin-primary-color, #FF0000); /* Utilise la couleur primaire si définie */
    outline: none;
    box-shadow: 0 0 0 2px rgba(255, 0, 0, 0.2); /* Léger halo rouge au focus */
}


.modal-content textarea {
  resize: vertical; /* Permet le redimensionnement vertical */
  min-height: 80px;
}

.modal-content .rating-selector {
  margin-top: 5px; /* Espace au-dessus des étoiles */
}

.modal-content button[type="submit"] {
  display: block; /* Prend toute la largeur */
  width: 100%;
  margin-top: 10px;
  /* Utilise les styles .btn et .btn-primary définis ailleurs si possible */
  /* Sinon, redéfinir ici */
   padding: 12px 20px;
   border: none;
   border-radius: 6px;
   cursor: pointer;
   font-size: 1rem;
   font-weight: 600;
   transition: background-color 0.2s ease;
   background-color: var(--admin-primary-color, #FF0000); /* Rouge par défaut */
   color: white;
}
.modal-content button[type="submit"]:disabled {
    background-color: #f87171; /* Rouge plus clair si désactivé */
    cursor: not-allowed;
}
.modal-content button[type="submit"]:hover:not(:disabled) {
    background-color: #cc0000; /* Rouge foncé au survol */
}


/* Animation d'apparition */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

```

**Action :**

1.  Remplace le contenu de `Reviews.jsx` par le nouveau code.
2.  Crée le fichier `modal.css` (par exemple dans `src/assets/styles/modal.css`).
3.  Colle le code CSS dans `modal.css`.
4.  Assure-toi que l'import `import '../../assets/styles/modal.css';` en haut de `Reviews.jsx` pointe vers le bon chemin de ton nouveau fichier CSS.
5.  Commit/Push ces changements pour le **frontend**.
6.  Teste : le bouton "Laisser un avis" devrait maintenant ouvrir une modale contenant le formulai
