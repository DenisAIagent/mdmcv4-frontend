import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import emailjs from '@emailjs/browser'; // Import EmailJS
import '../../assets/styles/contact.css'; // Assurez-vous que le chemin est correct

// Liens Calendly
const CALENDLY_LINKS = {
  meta: "https://calendly.com/mhl-agency/decouverte?month=2025-04",
  tiktok: "https://calendly.com/mhl-agency/decouverte?month=2025-04",
  youtube: "https://calendly.com/denis-mdmcmusicads/30min"
};

// ----- RÉCUPÉRATION DES VARIABLES D'ENVIRONNEMENT VITE -----
// Utilise import.meta.env pour Vite au lieu de process.env.REACT_APP_
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
// ------------------------------------------------------------

const Contact = () => {
  const { t } = useTranslation();

  // State pour les données du formulaire
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    platform: ''
  });

  // State pour le statut de la soumission
  const [formStatus, setFormStatus] = useState({
    submitting: false,
    success: null,
    error: null
  });

  // State pour suivre la plateforme sélectionnée (pour le bouton Calendly)
  const [selectedPlatform, setSelectedPlatform] = useState('');

  // Met à jour le state formData quand un champ change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'platform') {
      setSelectedPlatform(value);
    }
  };

  // Gère la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation des champs
    if (!formData.name || !formData.email || !formData.message || !formData.platform) {
      setFormStatus({ submitting: false, success: false, error: t('contact.form.error_all_fields', 'Veuillez remplir tous les champs requis, y compris la plateforme.') });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setFormStatus({ submitting: false, success: false, error: t('contact.form.error_invalid_email', 'Veuillez entrer une adresse email valide.') });
      return;
    }

    setFormStatus({ submitting: true, success: null, error: null });

    // Préparation des données pour le template EmailJS
    const templateParams = {
      name: formData.name,
      email: formData.email,
      message: formData.message,
      platform: formData.platform
    };

    try {
      // Vérification que les configurations EmailJS sont bien chargées
      if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
        // Message d'erreur mis à jour pour mentionner VITE_
        console.error("Erreur: Configuration EmailJS manquante. Vérifiez les variables d'environnement (VITE_...) et le redémarrage/rebuild.");
        throw new Error("Configuration EmailJS manquante.");
      }

      // Appel à EmailJS
      console.log("Tentative d'envoi EmailJS avec ServiceID:", SERVICE_ID, "TemplateID:", TEMPLATE_ID);
      console.log("Paramètres envoyés:", templateParams);

      await emailjs.send(
          SERVICE_ID,    // Utilise la variable VITE_...
          TEMPLATE_ID,   // Utilise la variable VITE_...
          templateParams,
          PUBLIC_KEY     // Utilise la variable VITE_...
      );

      console.log("EmailJS: Envoi réussi !");

      // Traitement en cas de Succès
      setFormStatus({ submitting: false, success: true, error: null });
      setFormData({ name: '', email: '', message: '', platform: ''});
      setSelectedPlatform('');
      setTimeout(() => {
          setFormStatus(prev => ({ ...prev, success: null }));
      }, 5000);

    } catch (error) {
      // Traitement en cas d'Erreur
      console.error('Erreur lors de l\'envoi via EmailJS:', error);
      setFormStatus({
        submitting: false,
        success: false,
        error: t('contact.error', 'Une erreur s\'est produite lors de l\'envoi. Veuillez réessayer.')
      });
    }
  }; // Fin de handleSubmit

  // Rendu JSX du Composant
  return (
    <section id="contact" className="section contact">
      <div className="container">
        <div className="section-header">
          <h2>{t('contact.title')}</h2>
        </div>

        <div className="contact-content">
          <div className="contact-info">
            <h3>{t('contact.partners.title')}</h3>
            <div className="partners-grid">
              {/* Cartes Partenaires */}
              <div className="partner-card">
                  <img src="/assets/images/partner/FMM_Logo_Rough_White_Horizontal.png" alt={t('contact.partners.fmm')} loading="lazy" className="partner-logo"/>
                  <h4>{t('contact.partners.fmm')}</h4>
                  <p>{t('contact.partners.fmm_description')}</p>
              </div>
              <div className="partner-card">
                  <img src="/assets/images/partner/Partner-CMYK.jpg" alt={t('contact.partners.google')} loading="lazy" className="partner-logo"/>
                  <h4>{t('contact.partners.google')}</h4>
                  <p>{t('contact.partners.google_description')}</p>
              </div>
              <div className="partner-card">
                  <img src="/assets/images/partner/logo-mhl-agency.png" alt={t('contact.partners.mhl')} loading="lazy" className="partner-logo"/>
                  <h4>{t('contact.partners.mhl')}</h4>
                  <p>{t('contact.partners.mhl_description')}</p>
              </div>
              <div className="partner-card">
                  <img src="/assets/images/partner/logo-vertical-algorythmes.png" alt={t('contact.partners.algorythme')} loading="lazy" className="partner-logo"/>
                  <h4>{t('contact.partners.algorythme')}</h4>
                  <p>{t('contact.partners.algorythme_description')}</p>
              </div>
            </div>
            <div className="social-links">
              {/* Vos liens/icônes ici */}
            </div>
          </div>

          {/* === FORMULAIRE DE CONTACT === */}
          <div className="contact-form">
            <form onSubmit={handleSubmit}>
              {/* Groupe Plateforme */}
              <div className="form-group">
                <label htmlFor="platform">{t('contact.form.platform_label', 'Plateforme principale ciblée')}</label>
                <select
                  id="platform"
                  name="platform"
                  value={formData.platform}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>{t('contact.form.option_select', '-- Sélectionner --')}</option>
                  <option value="youtube">{t('contact.form.platform_youtube', 'YouTube Ads')}</option>
                  <option value="meta">{t('contact.form.platform_meta', 'Meta Ads (Facebook/Instagram)')}</option>
                  <option value="tiktok">{t('contact.form.platform_tiktok', 'TikTok Ads')}</option>
                </select>
              </div>
              {/* Groupe Nom */}
              <div className="form-group">
                <label htmlFor="name">{t('contact.form.name')}</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              {/* Groupe Email */}
              <div className="form-group">
                <label htmlFor="email">{t('contact.form.email')}</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              {/* Groupe Message */}
              <div className="form-group">
                <label htmlFor="message">{t('contact.form.message')}</label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              {/* Boutons d'action */}
              <div className="form-buttons">
                  {/* Bouton de soumission principal (via EmailJS) */}
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={formStatus.submitting}
                >
                  {formStatus.submitting ? t('contact.form.submitting', 'Envoi en cours...') : t('contact.form.submit')}
                </button>

                  {/* Bouton Calendly conditionnel */}
                {selectedPlatform && CALENDLY_LINKS[selectedPlatform] && (
                  <a
                    href={CALENDLY_LINKS[selectedPlatform]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary"
                  >
                    {t('contact.form.book_call', 'Réserver un appel')}
                  </a>
                )}
              </div>
              {/* Messages de statut (Succès / Erreur) */}
              {formStatus.success && (
                <div className="form-message success">
                  {t('contact.form.success', 'Message envoyé avec succès !')}
                </div>
              )}
              {formStatus.error && (
                <div className="form-message error">
                  {formStatus.error}
                </div>
              )}
            </form>
          </div>
        </div> {/* Fin contact-content */}
      </div> {/* Fin container */}
    </section>
  );
};

export default Contact;
