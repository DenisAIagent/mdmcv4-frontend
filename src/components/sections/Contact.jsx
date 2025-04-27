import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import apiService from '../../services/api.service';
import '../../assets/styles/contact.css';

// Liens Calendly pour chaque plateforme
const CALENDLY_LINKS = {
  meta: "https://calendly.com/mhl-agency/decouverte?month=2025-04",
  tiktok: "https://calendly.com/mhl-agency/decouverte?month=2025-04",
  youtube: "https://calendly.com/denis-mdmcmusicads/30min"
};

const Contact = () => {
  const { t } = useTranslation();
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Si c'est le champ plateforme, mettre à jour selectedPlatform
    if (name === 'platform') {
      setSelectedPlatform(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation simple
    if (!formData.name || !formData.email || !formData.message) {
      setFormStatus({
        submitting: false,
        success: false,
        error: t('contact.form.error_fields')
      });
      return;
    }
    
    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setFormStatus({
        submitting: false,
        success: false,
        error: t('contact.form.error_email')
      });
      return;
    }
    
    try {
      setFormStatus({
        submitting: true,
        success: null,
        error: null
      });
      
      // Appel à l'API via le service
      await apiService.submitContactForm(formData);
      
      // Réinitialiser le formulaire en cas de succès
      setFormData({
        name: '',
        email: '',
        message: ''
      });
      
      setFormStatus({
        submitting: false,
        success: true,
        error: null
      });
      
      // Réinitialiser le message de succès après 5 secondes
      setTimeout(() => {
        setFormStatus(prev => ({
          ...prev,
          success: null
        }));
      }, 5000);
    } catch (error) {
      console.error('Erreur lors de la soumission du formulaire:', error);
      
      setFormStatus({
        submitting: false,
        success: false,
        error: error.response?.data?.message || t('contact.form.error')
      });
    }
  };

  return (
    <section id="contact" className="section contact">
      <div className="container">
        <div className="section-header">
          <h2>{t('contact.title')}</h2>
          <h3>Prêt à propulser votre musique ?</h3>
          <p>Discutons de votre projet et de la façon dont nous pouvons vous aider à atteindre vos objectifs.</p>
        </div>
        
        <div className="contact-content">
          <div className="contact-info">
            <h3>{t('contact.partners.title')}</h3>
            <div className="partners-grid">
              <div className="partner-card">
                <img 
                  src="/assets/images/partner/FMM_Logo_Rough_White_Horizontal.png" 
                  alt="Fédération des Musiques Métalliques" 
                  loading="lazy" 
                  className="partner-logo"
                />
                <h4>{t('contact.partners.fmm')}</h4>
                <p>{t('contact.partners.fmm_description')}</p>
              </div>
              <div className="partner-card">
                <img 
                  src="/assets/images/partner/Partner-CMYK.jpg" 
                  alt="Google Partner" 
                  loading="lazy" 
                  className="partner-logo"
                />
                <h4>{t('contact.partners.google')}</h4>
                <p>{t('contact.partners.google_description')}</p>
              </div>
              <div className="partner-card">
                <img 
                  src="/assets/images/partner/logo mhl.avif" 
                  alt="MHL Agency & Co" 
                  loading="lazy" 
                  className="partner-logo"
                />
                <h4>{t('contact.partners.mhl')}</h4>
                <p>{t('contact.partners.mhl_description')}</p>
              </div>
              <div className="partner-card">
                <img 
                  src="/assets/images/partner/logo-vertical-algorythmes.png" 
                  alt="Algorythme" 
                  loading="lazy" 
                  className="partner-logo"
                />
                <h4>{t('contact.partners.algorythme')}</h4>
                <p>{t('contact.partners.algorythme_description')}</p>
              </div>
            </div>
            
            <div className="social-links">
              <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>
          
          <div className="contact-form">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="platform">Sélectionner la plateforme</label>
                <select 
                  id="platform" 
                  name="platform" 
                  value={formData.platform}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>-- Sélectionner --</option>
                  <option value="youtube">YouTube Ads</option>
                  <option value="meta">Meta Ads (Facebook/Instagram)</option>
                  <option value="tiktok">TikTok Ads</option>
                </select>
              </div>
              
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
              
              <div className="form-buttons">
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  disabled={formStatus.submitting}
                >
                  {formStatus.submitting ? 'Envoi en cours...' : t('contact.form.submit')}
                </button>
                
                {selectedPlatform && (
                  <a 
                    href={CALENDLY_LINKS[selectedPlatform]} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn btn-secondary"
                  >
                    Réserver un appel
                  </a>
                )}
              </div>
              
              {formStatus.success && (
                <div className="form-message success">
                  {t('contact.form.success')}
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
