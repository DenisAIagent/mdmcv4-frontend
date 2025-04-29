import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import apiService from '../../services/api.service';
// Assurez-vous que le chemin d'importation du CSS est correct
import '../../assets/styles/contact.css';

// Liens Calendly pour chaque plateforme (inchangé)
const CALENDLY_LINKS = {
  meta: "https://calendly.com/mhl-agency/decouverte?month=2025-04",
  tiktok: "https://calendly.com/mhl-agency/decouverte?month=2025-04",
  youtube: "https://calendly.com/denis-mdmcmusicads/30min"
};

const Contact = () => {
  const { t } = useTranslation();
  // State (inchangé)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    platform: ''
  });
  const [formStatus, setFormStatus] = useState({
    submitting: false,
    success: null,
    error: null
  });
  const [selectedPlatform, setSelectedPlatform] = useState('');

  // Fonctions handleChange et handleSubmit (inchangées)
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation simple (peut-être ajouter des clés de traduction pour les erreurs ici)
    if (!formData.name || !formData.email || !formData.message) {
      setFormStatus({ submitting: false, success: false, error: 'Veuillez remplir tous les champs requis.' }); // Exemple d'erreur
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setFormStatus({ submitting: false, success: false, error: 'Veuillez entrer une adresse email valide.' }); // Exemple d'erreur
      return;
    }

    try {
      setFormStatus({ submitting: true, success: null, error: null });
      await apiService.submitContactForm(formData);
      setFormData({ name: '', email: '', message: '', platform: ''}); // Réinitialiser aussi platform
      setSelectedPlatform(''); // Réinitialiser la plateforme sélectionnée
      setFormStatus({ submitting: false, success: true, error: null });
      setTimeout(() => {
        setFormStatus(prev => ({ ...prev, success: null }));
      }, 5000);
    } catch (error) {
      console.error('Erreur lors de la soumission du formulaire:', error);
      setFormStatus({
        submitting: false,
        success: false,
        // Utiliser une clé de traduction générique pour l'erreur
        error: error.response?.data?.message || t('contact.error', 'Une erreur s\'est produite. Veuillez réessayer.')
      });
    }
  };

  return (
    // La section et le container restent inchangés
    <section id="contact" className="section contact">
      <div className="container">

        {/* === MODIFICATION DANS LE SECTION HEADER === */}
        <div className="section-header">
          {/* On garde uniquement le titre principal H2 */}
          <h2>{t('contact.title')}</h2>
        </div>
        {/* ========================================= */}

        {/* Le reste de la structure reste identique */}
        <div className="contact-content">
          <div className="contact-info">
            {/* Le H3 ici utilise la clé qui sera modifiée dans fr.js */}
            <h3>{t('contact.partners.title')}</h3>
            <div className="partners-grid">
              {/* Carte FMM */}
              <div className="partner-card">
                <img
                  // === Chemin CORRIGÉ ===
                  src="/assets/images/partner/FMM_Logo_Rough_White_Horizontal.png"
                  alt={t('contact.partners.fmm', 'Fédération des Musiques Métalliques')}
                  loading="lazy"
                  className="partner-logo"
                />
                <h4>{t('contact.partners.fmm')}</h4>
                <p>{t('contact.partners.fmm_description')}</p>
              </div>
              {/* Carte Google */}
              <div className="partner-card">
                <img
                  // === Chemin CORRIGÉ ===
                  src="/assets/images/partner/Partner-CMYK.jpg"
                  alt={t('contact.partners.google', 'Google Partner')}
                  loading="lazy"
                  className="partner-logo"
                />
                <h4>{t('contact.partners.google')}</h4>
                <p>{t('contact.partners.google_description')}</p>
              </div>
              {/* Carte MHL */}
              <div className="partner-card">
                <img
                  // === Chemin et Nom CORRIGÉS ===
                  src="/assets/images/partner/logo-mhl-agency.png"
                  alt={t('contact.partners.mhl', 'MHL Agency & Co')}
                  loading="lazy"
                  className="partner-logo"
                />
                <h4>{t('contact.partners.mhl')}</h4>
                <p>{t('contact.partners.mhl_description')}</p>
              </div>
              {/* Carte Algorythme */}
              <div className="partner-card">
                <img
                  // === Chemin CORRIGÉ ===
                  src="/assets/images/partner/logo-vertical-algorythmes.png"
                  alt={t('contact.partners.algorythme', 'Algorythme')}
                  loading="lazy"
                  className="partner-logo"
                />
                <h4>{t('contact.partners.algorythme')}</h4>
                <p>{t('contact.partners.algorythme_description')}</p>
              </div>
            </div>

            {/* Liens sociaux (inchangés) */}
            <div className="social-links">
              {/* Pensez à ajouter vos liens/icônes ici si nécessaire */}
              {/* Exemple: <a href="lien_facebook"><img src="/icons/facebook.png" alt="Facebook"/></a> */}
            </div>
          </div>

          {/* Formulaire de contact (inchangé structurellement) */}
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
                {/* Boutons */}
                <div className="form-buttons">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={formStatus.submitting}
                  >
                    {formStatus.submitting ? t('contact.form.submitting', 'Envoi en cours...') : t('contact.form.submit')}
                  </button>

                  {selectedPlatform && CALENDLY_LINKS[selectedPlatform] && ( // Vérifier si lien existe
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
                {/* Messages de statut */}
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
        </div>
      </div>
    </section>
  );
};

export default Contact;
