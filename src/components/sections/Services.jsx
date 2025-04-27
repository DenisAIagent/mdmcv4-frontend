import { useTranslation } from 'react-i18next';
import '../../assets/styles/services.css';

const Services = () => {
  const { t } = useTranslation();

  return (
    <section id="services" className="services">
      <div className="container">
        <h2 className="section-title">{t('services.title')}</h2>
        
        <div className="services-grid">
          <div className="service-card">
            <div className="service-icon">
              <img src="/src/assets/images/youtube-icon.svg" alt="YouTube Ads" />
            </div>
            <h3>{t('services.youtube.title')}</h3>
            <p>{t('services.youtube.description')}</p>
          </div>
          
          <div className="service-card">
            <div className="service-icon">
              <img src="/src/assets/images/meta-icon.svg" alt="Meta Ads" />
            </div>
            <h3>{t('services.meta.title')}</h3>
            <p>{t('services.meta.description')}</p>
          </div>
          
          <div className="service-card">
            <div className="service-icon">
              <img src="/src/assets/images/tiktok-icon.svg" alt="TikTok Ads" />
            </div>
            <h3>{t('services.tiktok.title')}</h3>
            <p>{t('services.tiktok.description')}</p>
          </div>
          
          <div className="service-card">
            <div className="service-icon">
              <img src="/src/assets/images/content-icon.svg" alt="Content Strategy" />
            </div>
            <h3>{t('services.content.title')}</h3>
            <p>{t('services.content.description')}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
