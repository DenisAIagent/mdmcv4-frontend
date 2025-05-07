import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { trackingService } from '@/services/tracking.service';

const SmartLink = () => {
  const { id } = useParams();

  useEffect(() => {
    // Initialiser le tracking
    trackingService.initialize(id);
    
    // Track la vue de page
    trackingService.trackPageView();
  }, [id]);

  const handlePlatformClick = async (platform, url) => {
    // Track le clic sur la plateforme
    await trackingService.trackPlatformClick(platform, url);
    
    // Ouvrir l'URL dans un nouvel onglet
    window.open(url, '_blank');
  };

  return (
    <div className="smartlink-container">
      <div className="platform-links">
        {platforms.map((platform) => (
          <button
            key={platform.id}
            className={`platform-button ${platform.id}`}
            onClick={() => handlePlatformClick(platform.id, platform.url)}
          >
            <img src={platform.icon} alt={platform.name} />
            <span>{platform.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SmartLink; 