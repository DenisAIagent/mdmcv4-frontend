import { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import apiService from '../../services/api.service';
import '../../assets/styles/simulator.css';

// Liens Calendly (inchangé)
const CALENDLY_LINKS = {
  meta: "https://calendly.com/mhl-agency/decouverte?month=2025-04",
  tiktok: "https://calendly.com/mhl-agency/decouverte?month=2025-04",
  youtube: "https://calendly.com/denis-mdmcmusicads/30min"
};

// Données de coût (inchangé)
const COST_DATA = {
  // ... (données de coût comme avant) ...
  youtube: { /* ... */ },
  meta: { /* ... */ },
  tiktok: { /* ... */ }
};


const Simulator = forwardRef((props, ref) => {
  const { t } = useTranslation(); // Correctement appelé
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    platform: '', budget: '', country: '', campaignType: '', artistName: '', email: ''
  });
  const [errors, setErrors] = useState({});
  const [results, setResults] = useState({ views: null, cpv: null, reach: null });
  const [submitting, setSubmitting] = useState(false);

  // useImperativeHandle (inchangé)
  useImperativeHandle(ref, () => ({
    openSimulator: () => { setIsOpen(true); }
  }));

  // closeSimulator (inchangé)
  const closeSimulator = () => {
    setIsOpen(false);
    setCurrentStep(1);
    setFormData({ platform: '', budget: '', country: '', campaignType: '', artistName: '', email: '' });
    setErrors({});
    setResults({ views: null, cpv: null, reach: null });
  };

  // handleChange (inchangé)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) { setErrors(prev => ({ ...prev, [name]: '' })); }
  };

  // validateStep (Utilise t() pour les messages d'erreur)
  const validateStep = (step) => {
    let isValid = true;
    const newErrors = {};
    switch (step) {
      case 1:
        if (!formData.platform) { newErrors.platform = t('simulator.platform_error'); isValid = false; }
        break;
      case 2:
        if (!formData.campaignType) { newErrors.campaignType = t('simulator.campaignType_error'); isValid = false; }
        break;
      case 3:
        if (!formData.budget || formData.budget < 500) { newErrors.budget = t('simulator.budget_error'); isValid = false; }
        break;
      case 4:
        if (!formData.country) { newErrors.country = t('simulator.region_error'); isValid = false; }
        break;
      case 5:
        if (!formData.artistName) { newErrors.artistName = t('simulator.artist_error'); isValid = false; }
        if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) { newErrors.email = t('simulator.email_error'); isValid = false; }
        break;
      default: break;
    }
    setErrors(newErrors);
    return isValid;
  };

  // nextStep et prevStep (inchangés)
  const nextStep = () => { if (validateStep(currentStep)) { setCurrentStep(prev => prev + 1); } };
  const prevStep = () => { setCurrentStep(prev => prev - 1); };

  // calculateResults et submitResults (inchangés)
  const calculateResults = () => { /* ... (logique de calcul) ... */ };
  const submitResults = async (views, cpv, reach) => { /* ... (logique API) ... */ };

  // handleClickOutside (inchangé)
  const handleClickOutside = (e) => { /* ... */ };

  return (
    <div
      className={`simulator-popup ${isOpen ? 'active' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="simulator-title"
      onClick={handleClickOutside}
    >
      <div className="simulator-content" tabIndex="-1">
        <button
          className="close-popup"
          type="button"
          aria-label={t('simulator.close_button_aria_label')} // Utilise t()
          onClick={closeSimulator}
        >
          &times;
        </button>

        <h2 id="simulator-title">{t('simulator.title')}</h2>

        {/* Barre de progression (inchangée) */}
        <div className="progress-bar" aria-hidden="true">{/* ... */}</div>

        <form id="simulator-form" onSubmit={(e) => e.preventDefault()} noValidate>
          {/* Étape 1 (Utilisait déjà t() pour la plupart) */}
          <div className={`form-step ${currentStep === 1 ? 'active' : ''}`} id="step-1" role="tabpanel">
            <h3>{t('simulator.step1_title')}</h3>
            <div className="form-group">
              <label htmlFor="platform">{t('simulator.step1_platform_label')}</label>
              <select
                id="platform" name="platform" value={formData.platform} onChange={handleChange} required
                aria-describedby={errors.platform ? "platform-error" : undefined}
              >
                <option value="" disabled>{t('simulator.option_select')}</option>
                <option value="youtube">{t('simulator.platform_youtube')}</option>
                <option value="meta">{t('simulator.platform_meta')}</option>
                <option value="tiktok">{t('simulator.platform_tiktok')}</option>
              </select>
              {errors.platform && <span className="form-error" id="platform-error">{errors.platform}</span>}
            </div>
            <div className="form-buttons" style={{ justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-primary" onClick={nextStep} aria-label={t('simulator.button_next')}>
                {t('simulator.button_next')}
              </button>
            </div>
          </div>

          {/* Étape 2 - Type de campagne (Corrigé pour utiliser t()) */}
          <div className={`form-step ${currentStep === 2 ? 'active' : ''}`} id="step-2" role="tabpanel">
            <h3>{t('simulator.step2_title')}</h3> {/* CORRIGÉ */}
            <div className="form-group">
              <label htmlFor="campaignType">{t('simulator.step2_label')}</label> {/* CORRIGÉ */}
              <select
                id="campaignType" name="campaignType" value={formData.campaignType} onChange={handleChange} required
                aria-describedby={errors.campaignType ? "campaignType-error" : undefined}
              >
                <option value="" disabled>{t('simulator.option_select')}</option> {/* CORRIGÉ */}
                <option value="awareness">{t('simulator.campaignType.awareness')}</option> {/* CORRIGÉ */}
                <option value="engagement">{t('simulator.campaignType.engagement')}</option> {/* CORRIGÉ */}
                <option value="conversion">{t('simulator.campaignType.conversion')}</option> {/* CORRIGÉ */}
              </select>
              {errors.campaignType && <span className="form-error" id="campaignType-error">{errors.campaignType}</span>}
            </div>
            <div className="form-buttons">
              <button type="button" className="btn btn-secondary" onClick={prevStep} aria-label={t('simulator.button_prev')}>
                {t('simulator.button_prev')}
              </button>
              <button type="button" className="btn btn-primary" onClick={nextStep} aria-label={t('simulator.button_next')}>
                {t('simulator.button_next')}
              </button>
            </div>
          </div>

          {/* Étape 3 - Budget (Corrigé H3, gardé clés incorrectes pour label/placeholder) */}
          <div className={`form-step ${currentStep === 3 ? 'active' : ''}`} id="step-3" role="tabpanel">
            <h3>{t('simulator.step3_title')}</h3> {/* CORRIGÉ */}
            <div className="form-group">
               {/* Attention: Utilise les clés incorrectes (step2_...) comme demandé */}
              <label htmlFor="budget">{t('simulator.step2_budget_label')}</label>
              <input
                type="number" id="budget" name="budget" min="500" step="10" value={formData.budget} onChange={handleChange} required
                placeholder={t('simulator.step2_budget_placeholder')}
                aria-describedby={errors.budget ? "budget-error" : undefined}
              />
              {errors.budget && <span className="form-error" id="budget-error">{errors.budget}</span>}
            </div>
            <div className="form-buttons">
               <button type="button" className="btn btn-secondary" onClick={prevStep} aria-label={t('simulator.button_prev')}>
                 {t('simulator.button_prev')}
               </button>
               <button type="button" className="btn btn-primary" onClick={nextStep} aria-label={t('simulator.button_next')}>
                 {t('simulator.button_next')}
               </button>
             </div>
          </div>

          {/* Étape 4 - Pays (Corrigé H3 et options, gardé clé incorrecte pour label) */}
          <div className={`form-step ${currentStep === 4 ? 'active' : ''}`} id="step-4" role="tabpanel">
            <h3>{t('simulator.step4_title')}</h3> {/* CORRIGÉ */}
            <div className="form-group">
              {/* Attention: Utilise la clé incorrecte (step3_...) comme demandé */}
              <label htmlFor="country">{t('simulator.step3_region_label')}</label>
              <select
                id="country" name="country" value={formData.country} onChange={handleChange} required
                aria-describedby={errors.country ? "country-error" : undefined}
              >
                <option value="" disabled>{t('simulator.option_select')}</option> {/* CORRIGÉ */}
                <option value="europe">{t('simulator.region.europe')}</option> {/* CORRIGÉ */}
                <option value="usa">{t('simulator.region.usa')}</option> {/* CORRIGÉ */}
                <option value="canada">{t('simulator.region.canada')}</option> {/* CORRIGÉ */}
                <option value="south_america">{t('simulator.region.south_america')}</option> {/* CORRIGÉ */}
                <option value="asia">{t('simulator.region.asia')}</option> {/* CORRIGÉ */}
              </select>
              {errors.country && <span className="form-error" id="country-error">{errors.country}</span>}
            </div>
             <div className="form-buttons">
               <button type="button" className="btn btn-secondary" onClick={prevStep} aria-label={t('simulator.button_prev')}>
                 {t('simulator.button_prev')}
               </button>
               <button type="button" className="btn btn-primary" onClick={nextStep} aria-label={t('simulator.button_next')}>
                 {t('simulator.button_next')}
               </button>
             </div>
          </div>

          {/* Étape 5 - Informations (Corrigé H3, gardé clés incorrectes pour labels/placeholders) */}
          <div className={`form-step ${currentStep === 5 ? 'active' : ''}`} id="step-5" role="tabpanel">
            <h3>{t('simulator.step5_title')}</h3> {/* CORRIGÉ */}
            <div className="form-group">
              {/* Attention: Utilise les clés incorrectes (step4_...) comme demandé */}
              <label htmlFor="artistName">{t('simulator.step4_artist_label')}</label>
              <input
                type="text" id="artistName" name="artistName" value={formData.artistName} onChange={handleChange} required
                placeholder={t('simulator.step4_artist_placeholder')}
                aria-describedby={errors.artistName ? "artistName-error" : undefined}
              />
              {errors.artistName && <span className="form-error" id="artistName-error">{errors.artistName}</span>}
            </div>
            <div className="form-group">
              {/* Attention: Utilise les clés incorrectes (step4_...) comme demandé */}
              <label htmlFor="simulator-email">{t('simulator.step4_email_label')}</label>
              <input
                type="email" id="simulator-email" name="email" value={formData.email} onChange={handleChange} required
                placeholder={t('simulator.step4_email_placeholder')}
                aria-describedby={errors.email ? "simulator-email-error" : undefined}
              />
              {errors.email && <span className="form-error" id="simulator-email-error">{errors.email}</span>}
            </div>
             <div className="form-buttons">
               <button type="button" className="btn btn-secondary" onClick={prevStep} aria-label={t('simulator.button_prev')}>
                 {t('simulator.button_prev')}
               </button>
               <button type="button" className="btn btn-primary" onClick={calculateResults} disabled={submitting} aria-label={t('simulator.button_show_results')}>
                 {submitting ? t('contact.form.submitting') : t('simulator.button_show_results')} {/* Utilisation clé existante pour "Envoi en cours..." */}
               </button>
             </div>
          </div>

          {/* Étape 6 - Résultats (Utilise t() pour les labels et le bouton) */}
          <div className={`form-step ${currentStep === 6 ? 'active' : ''}`} id="step-6" role="tabpanel">
            <h3>{t('simulator.results_title')}</h3> {/* CORRIGÉ */}
            <div className="result-preview" aria-live="polite">
              <div className="result-item">
                <span>{t('simulator.results_views_label')}</span> {/* CORRIGÉ */}
                <span className="result-value" id="result-views">{results.views || '--'}</span>
              </div>
              <div className="result-item">
                <span>{t('simulator.results_cpv_label')}</span> {/* CORRIGÉ */}
                <span className="result-value" id="result-cpv">{results.cpv || '--'}</span>
              </div>
              <div className="result-item">
                <span>{t('simulator.results_reach_label')}</span> {/* CORRIGÉ */}
                <span className="result-value" id="result-reach">{results.reach || '--'}</span>
              </div>
              <p className="results-disclaimer">{t('simulator.results_disclaimer')}</p> {/* CORRIGÉ */}
            </div>
            <div className="form-buttons">
              <button type="button" className="btn btn-secondary" onClick={() => setCurrentStep(5)} /* Retour étape 5 pour modifier */ aria-label={t('simulator.button_modify')}>
                {t('simulator.button_modify')} {/* CORRIGÉ */}
              </button>
              <a
                id="calendly-link"
                href={`${CALENDLY_LINKS[formData.platform]}?name=${encodeURIComponent(formData.artistName)}&email=${encodeURIComponent(formData.email)}`}
                target="_blank" rel="noopener noreferrer" className="btn btn-primary"
                aria-label={t('simulator.results_cta_expert')} // Utilise la clé ajoutée pour aria-label
              >
                {t('contact.form.book_call')} {/* CORRIGÉ - Utilise la clé générale "parler à un expert" */}
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
});

Simulator.displayName = 'Simulator';

export default Simulator;
