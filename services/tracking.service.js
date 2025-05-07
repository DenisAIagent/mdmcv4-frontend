import { apiService } from './api.service';

class TrackingService {
  constructor() {
    this.initialized = false;
    this.pendingEvents = [];
  }

  async initialize(smartLinkId) {
    if (this.initialized) return;

    try {
      // Récupérer la configuration du SmartLink
      const response = await apiService.smartlinks.getById(smartLinkId);
      if (response.success) {
        this.smartLinkData = response.data;
        this.initializePixels();
        this.initialized = true;
        this.processPendingEvents();
      }
    } catch (error) {
      console.error('Erreur lors de l\'initialisation du tracking:', error);
    }
  }

  initializePixels() {
    const { trackingPixels } = this.smartLinkData;

    // GA4
    if (trackingPixels?.ga4?.enabled) {
      this.initializeGA4(trackingPixels.ga4.measurementId);
    }

    // GTM
    if (trackingPixels?.gtm?.enabled) {
      this.initializeGTM(trackingPixels.gtm.containerId);
    }

    // Meta Pixel
    if (trackingPixels?.meta?.enabled) {
      this.initializeMetaPixel(trackingPixels.meta.pixelId);
    }

    // TikTok Pixel
    if (trackingPixels?.tiktok?.enabled) {
      this.initializeTikTokPixel(trackingPixels.tiktok.pixelId);
    }
  }

  initializeGA4(measurementId) {
    // Initialiser GA4
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    gtag('js', new Date());
    gtag('config', measurementId);
  }

  initializeGTM(containerId) {
    // Initialiser GTM
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer',containerId);
  }

  initializeMetaPixel(pixelId) {
    // Initialiser Meta Pixel
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', pixelId);
  }

  initializeTikTokPixel(pixelId) {
    // Initialiser TikTok Pixel
    !function (w, d, t) {
      w.TiktokAnalyticsObject=t;
      var ttq=w[t]=w[t]||[];
      ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"];
      ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};
      for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);
      ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};
      ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/sdk.js?s="+e;ttq._i=ttq._i||{},ttq._i[n]=[],ttq._i[n]._u=i;var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
      ttq.load(pixelId);
      ttq.page();
    }(window, document, 'ttq');
  }

  async trackPageView() {
    const event = {
      type: 'pageview',
      timestamp: new Date().toISOString(),
      smartLinkId: this.smartLinkData._id,
    };

    if (!this.initialized) {
      this.pendingEvents.push(event);
      return;
    }

    try {
      // Envoyer l'événement au backend
      await apiService.analytics.trackEvent(event);

      // Track dans les pixels
      if (window.gtag) {
        gtag('event', 'page_view', {
          page_title: this.smartLinkData.trackTitle,
          page_location: window.location.href,
        });
      }

      if (window.fbq) {
        fbq('track', 'PageView');
      }

      if (window.ttq) {
        ttq.page();
      }
    } catch (error) {
      console.error('Erreur lors du tracking de la page:', error);
    }
  }

  async trackPlatformClick(platform, url) {
    const event = {
      type: 'platform_click',
      platform,
      url,
      timestamp: new Date().toISOString(),
      smartLinkId: this.smartLinkData._id,
    };

    if (!this.initialized) {
      this.pendingEvents.push(event);
      return;
    }

    try {
      // Envoyer l'événement au backend
      await apiService.analytics.trackEvent(event);

      // Track dans les pixels
      if (window.gtag) {
        gtag('event', 'platform_click', {
          platform,
          url,
        });
      }

      if (window.fbq) {
        fbq('track', 'Lead', {
          platform,
          url,
        });
      }

      if (window.ttq) {
        ttq.track('ClickPlatform', {
          platform,
          url,
        });
      }
    } catch (error) {
      console.error('Erreur lors du tracking du clic:', error);
    }
  }

  processPendingEvents() {
    this.pendingEvents.forEach(event => {
      if (event.type === 'pageview') {
        this.trackPageView();
      } else if (event.type === 'platform_click') {
        this.trackPlatformClick(event.platform, event.url);
      }
    });
    this.pendingEvents = [];
  }
}

export const trackingService = new TrackingService(); 