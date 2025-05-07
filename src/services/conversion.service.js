class ConversionService {
  constructor() {
    this.pendingEvents = [];
  }

  // Initialiser le service avec les IDs de conversion
  initialize(trackingIds) {
    this.trackingIds = trackingIds;
    this.processPendingEvents();
  }

  // Tracker une conversion
  trackConversion(eventName, value = 0) {
    if (!this.trackingIds?.googleAds) {
      this.pendingEvents.push({ eventName, value });
      return;
    }

    // Tracker dans Google Ads
    if (window.gtag) {
      window.gtag('event', 'conversion', {
        'send_to': `${this.trackingIds.googleAds.conversionId}/${this.trackingIds.googleAds.label}`,
        'value': value,
        'currency': 'EUR'
      });
    }

    // Tracker dans GA4
    if (window.gtag) {
      window.gtag('event', eventName, {
        'send_to': this.trackingIds.ga4.propertyId,
        'value': value,
        'currency': 'EUR'
      });
    }

    // Tracker dans Meta
    if (window.fbq) {
      window.fbq('track', 'Purchase', {
        value: value,
        currency: 'EUR'
      });
    }

    // Tracker dans TikTok
    if (window.ttq) {
      window.ttq.track('Purchase', {
        value: value,
        currency: 'EUR'
      });
    }
  }

  // Tracker un clic sur une plateforme
  trackPlatformClick(platform, url) {
    this.trackConversion('platform_click', 0);
  }

  // Tracker une vue de page
  trackPageView() {
    this.trackConversion('page_view', 0);
  }

  // Traiter les événements en attente
  processPendingEvents() {
    if (!this.trackingIds?.googleAds) return;

    this.pendingEvents.forEach(event => {
      this.trackConversion(event.eventName, event.value);
    });

    this.pendingEvents = [];
  }
}

export const conversionService = new ConversionService(); 