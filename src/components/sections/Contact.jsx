import { useState } from 'react';
import { useTranslation } from 'react-i18next';
// import apiService from '../../services/api.service'; // Ligne commentée/supprimée car remplacée par EmailJS
import emailjs from '@emailjs/browser'; // ***** IMPORT EMAILJS *****
import '../../assets/styles/contact.css'; // Assurez-vous que le chemin est correct

// Liens Calendly (fournis par vous)
const CALENDLY_LINKS = {
  meta: "https://calendly.com/mhl-agency/decouverte?month=2025-04",
  tiktok: "https://calendly.com/mhl-agency/decouverte?month=2025-04",
  youtube: "https://calendly.com/denis-mdmcmusicads/30min"
};

// ----- Récupération des IDs/Clé depuis les variables d'environnement -----
// Nécessite un fichier .env à la racine avec ces variables préfixées par REACT_APP_
const SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;
// --------------------------------------------------------------------

const Contact = () => {
  const { t } = useTranslation();

  // State pour les données du formulaire
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    platform: '' // Plateforme sélectionnée
  });

  // State pour le statut de la soumission
  const [formStatus, setFormStatus] = useState({
    submitting: false, // Indicateur de chargement
    success: null,     // Booléen pour message de succès
    error: null       // Message d'erreur ou null
  });

  // State pour suivre la plateforme sélectionnée (pour le bouton Calendly)
  const [selectedPlatform, setSelectedPlatform] = useState('');

  // Met à jour le state formData quand un champ change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value // Met à jour le champ correspondant (name, email, message, platform)
    }));

    // Met à jour spécifiquement la plateforme sélectionnée pour le bouton Calendly
    if (name === 'platform') {
      setSelectedPlatform(value);
    }
  };

  // Gère la soumission du formulaire
  const handleSubmit = async (e) => { // 'async' peut être enlevé si pas d'autre await
    e.preventDefault(); // Empêche le rechargement de la page

    // --- Validation des champs ---
    if (!formData.name || !formData.email || !formData.message || !formData.platform) {
      setFormStatus({ submitting: false, success: false, error: t('contact.form.error_all_fields', 'Veuillez remplir tous les champs requis, y compris la plateforme.') });
      return; // Arrête si un champ manque
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setFormStatus({ submitting: false, success: false, error: t('contact.form.error_invalid_email', 'Veuillez entrer une adresse email valide.') });
      return; // Arrête si l'email est invalide
    }
    // --- Fin Validation ---

    setFormStatus({ submitting: true, success: null, error: null }); // Active l'état "envoi en cours"

    // --- Préparation des données pour le template EmailJS ---
    // IMPORTANT : Les clés ici (name, email, message, platform) doivent EXACTEMENT
    // correspondre aux noms des placeholders dans votre template EmailJS.
    // Exemple: {{name}}, {{email}}, {{message}}, {{platform}}
    const templateParams = {
        name: formData.name,
        email: formData.email,       // Email de l'utilisateur
        message: formData.message,   // Message de l'utilisateur
        platform: formData.platform // Plateforme sélectionnée
    };
    // --- Fin Préparation ---

    try {
        // Vérification que les configurations sont bien chargées (sécurité)
        if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
            console.error("Erreur: Configuration EmailJS manquante. Vérifiez les variables d'environnement (REACT_APP_...) et le redémarrage du serveur.");
            throw new Error("Configuration EmailJS manquante."); // Lance une erreur
        }

        // ***** APPEL À EMAILJS *****
        // Utilise les IDs/Clé récupérés des variables d'environnement
        console.log("Tentative d'envoi EmailJS avec ServiceID:", SERVICE_ID, "TemplateID:", TEMPLATE_ID); // Log pour débogage
        console.log("Paramètres envoyés:", templateParams); // Log pour débogage

        await emailjs.send(
            SERVICE_ID,     // Votre Service ID EmailJS
            TEMPLATE_ID,    // Votre Template ID EmailJS
            templateParams, // L'objet contenant les données à insérer dans l'email
            PUBLIC_KEY      // Votre Clé Publique EmailJS
        );

        console.log("EmailJS: Envoi réussi !"); // Log pour débogage
        // ***** FIN APPEL EMAILJS *****

        // --- Traitement en cas de Succès ---
        setFormStatus({ submitting: false, success: true, error: null }); // Afficher message succès
        setFormData({ name: '', email: '', message: '', platform: ''}); // Réinitialiser le formulaire
        setSelectedPlatform(''); // Réinitialiser la sélection pour le bouton Calendly
        // Cache le message de succès après 5 secondes
        setTimeout(() => {
            setFormStatus(prev => ({ ...prev, success: null }));
        }, 5000);
        // --- Fin Succès ---

        // L'appel original à Brevo (apiService.submitContactForm) a été retiré ici.

    } catch (error) {
        // --- Traitement en cas d'Erreur ---
      console.error('Erreur lors de l\'envoi via EmailJS:', error); // Log l'erreur détaillée pour le débogage
      setFormStatus({
        submitting: false, // Arrêter l'indicateur de chargement
        success: false,    // Indiquer pas de succès
        // Afficher un message d'erreur générique à l'utilisateur
        error: t('contact.error', 'Une erreur s\'est produite lors de l\'envoi. Veuillez réessayer.')
      });
      // --- Fin Erreur ---
    }
  }; // Fin de handleSubmit

  // --- Rendu JSX du Composant ---
  // Cette partie est basée sur le JSX que vous avez fourni précédemment.
  // Assurez-vous que les attributs `name` et `id` des champs correspondent
  // aux clés utilisées dans `formData` et `handleChange`.
  return (
    <section id="contact" className="section contact">
      <div className="container">
        <div className="section-header">
          <h2>{t('contact.title')}</h2>
        </div>

        <div className="contact-content">
          <div className="contact-info">
            {/* Titre Partenaires */}
            <h3>{t('contact.partners.title')}</h3>
            {/* Grille Partenaires */}
            <div className="partners-grid">
              {/* Carte FMM */}
              <div className="partner-card">
                <img src="/assets/images/partner/FMM_Logo_Rough_White_Horizontal.png" alt={t('contact.partners.fmm')} loading="lazy" className="partner-logo"/>
                <h4>{t('contact.partners.fmm')}</h4>
                <p>{t('contact.partners.fmm_description')}</p>
              </div>
             {/* Carte Google */}
              <div className="partner-card">
                <img src="/assets/images/partner/Partner-CMYK.jpg" alt={t('contact.partners.google')} loading="lazy" className="partner-logo"/>
                <h4>{t('contact.partners.google')}</h4>
                <p>{t('contact.partners.google_description')}</p>
              </div>
             {/* Carte MHL */}
              <div className="partner-card">
                <img src="/assets/images/partner/logo-mhl-agency.png" alt={t('contact.partners.mhl')} loading="lazy" className="partner-logo"/>
                <h4>{t('contact.partners.mhl')}</h4>
                <p>{t('contact.partners.mhl_description')}</p>
              </div>
             {/* Carte Algorythme */}
              <div className="partner-card">
                <img src="/assets/images/partner/logo-vertical-algorythmes.png" alt={t('contact.partners.algorythme')} loading="lazy" className="partner-logo"/>
                <h4>{t('contact.partners.algorythme')}</h4>
                <p>{t('contact.partners.algorythme_description')}</p>
              </div>
            </div>
            {/* Liens sociaux (si vous en avez) */}
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
                  id="platform"  // id utilisé par le label
                  name="platform" // name utilisé par handleChange pour mettre à jour formData.platform
                  value={formData.platform} // Lie la valeur au state
                  onChange={handleChange} // Fonction appelée au changement
                  required // Rend le champ obligatoire
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
                  id="name"       // id utilisé par le label
                  name="name"     // name utilisé par handleChange
                  value={formData.name} // Lie la valeur au state
                  onChange={handleChange}
                  required
                />
              </div>
              {/* Groupe Email */}
              <div className="form-group">
                <label htmlFor="email">{t('contact.form.email')}</label>
                <input
                  type="email"
                  id="email"      // id utilisé par le label
                  name="email"    // name utilisé par handleChange
                  value={formData.email} // Lie la valeur au state
                  onChange={handleChange}
                  required
                />
              </div>
              {/* Groupe Message */}
              <div className="form-group">
                <label htmlFor="message">{t('contact.form.message')}</label>
                <textarea
                  id="message"    // id utilisé par le label
                  name="message"  // name utilisé par handleChange
                  rows="5"
                  value={formData.message} // Lie la valeur au state
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
                  disabled={formStatus.submitting} // Désactivé pendant l'envoi
                >
                  {formStatus.submitting ? t('contact.form.submitting', 'Envoi en cours...') : t('contact.form.submit')}
                </button>

                 {/* Bouton Calendly conditionnel */}
                {selectedPlatform && CALENDLY_LINKS[selectedPlatform] && (
                  <a
                    href={CALENDLY_LINKS[selectedPlatform]}
                    target="_blank" // Ouvre dans un nouvel onglet
                    rel="noopener noreferrer" // Pour la sécurité
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
                  {formStatus.error} {/* Affiche le message d'erreur défini dans handleSubmit */}
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