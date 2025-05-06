import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import apiService from "../../services/api.service"; // Utiliser le vrai service API
// import trackService from "../../services/track.service"; // Pour l'injection de scripts (à créer ou intégrer)

// Fonction utilitaire pour injecter les scripts de tracking
const injectTrackingScripts = (trackingIds) => {
  const head = document.head;
  const scripts = [];

  if (trackingIds.ga4Id) {
    const ga4Script = document.createElement("script");
    ga4Script.async = true;
    ga4Script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingIds.ga4Id}`;
    scripts.push(ga4Script);

    const ga4Init = document.createElement("script");
    ga4Init.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${trackingIds.ga4Id}');
    `;
    scripts.push(ga4Init);
    console.log("GA4 script injection configured for", trackingIds.ga4Id);
  }

  if (trackingIds.metaPixelId) {
    const metaScript = document.createElement("script");
    metaScript.innerHTML = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${trackingIds.metaPixelId}');
      fbq('track', 'PageView');
    `;
    scripts.push(metaScript);
    console.log("Meta Pixel script injection configured for", trackingIds.metaPixelId);
  }
  
  if (trackingIds.gtmId) {
    const gtmScript = document.createElement("script");
    gtmScript.innerHTML = `
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${trackingIds.gtmId}');
    `;
    scripts.push(gtmScript);
    console.log("GTM script injection configured for", trackingIds.gtmId);
  }
  
  if (trackingIds.tiktokPixelId) {
    const tiktokScript = document.createElement("script");
    tiktokScript.innerHTML = `
      (function() {
        var ta = document.createElement('script'); ta.type = 'text/javascript'; ta.async = true;
        ta.src = 'https://analytics.tiktok.com/i18n/pixel/events.js?sdkid=${trackingIds.tiktokPixelId}&lib=ttq';
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(ta, s);
      })();
    `;
    scripts.push(tiktokScript);
    console.log("TikTok Pixel script injection configured for", trackingIds.tiktokPixelId);
  }

  // Ajouter les scripts au head
  scripts.forEach(script => head.appendChild(script));

  // Nettoyage : supprimer les scripts si le composant est démonté (optionnel, mais bonne pratique)
  return () => {
    scripts.forEach(script => {
      if (head.contains(script)) {
        head.removeChild(script);
      }
    });
  };
};

const SmartLinkPage = () => {
  const { artistSlug, trackSlug } = useParams();
  const navigate = useNavigate();
  const [smartLinkData, setSmartLinkData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [redirectUrl, setRedirectUrl] = useState(null);

  useEffect(() => {
    const fetchSmartLink = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log(`Fetching smartlink for artist: ${artistSlug}, track: ${trackSlug}`);
        const response = await apiService.smartlinks.getBySlugs(artistSlug, trackSlug);
        
        if (response && response.success && response.data) {
          setSmartLinkData(response.data);
          console.log("SmartLink data received:", response.data);

          // Gérer l'injection des scripts de tracking
          if (response.data.smartLink && response.data.smartLink.trackingIds) {
            injectTrackingScripts(response.data.smartLink.trackingIds);
          }

          // Déterminer l'URL de redirection (premier lien de plateforme par défaut)
          if (response.data.smartLink.platformLinks && response.data.smartLink.platformLinks.length > 0) {
            const primaryLink = response.data.smartLink.platformLinks.find(link => link.url) || response.data.smartLink.platformLinks[0];
            if (primaryLink && primaryLink.url) {
                setRedirectUrl(primaryLink.url);
            } else {
                setError("Aucun lien de plateforme valide disponible pour la redirection.");
            }
          } else {
            setError("Aucun lien de plateforme disponible pour ce SmartLink.");
          }
        } else {
          throw new Error(response.error || "Données SmartLink non valides ou non trouvées.");
        }

      } catch (err) {
        console.error("Erreur lors de la récupération du SmartLink:", err);
        setError(err.message || "Erreur lors de la récupération des données du SmartLink.");
        if (err.status === 404) {
            // Gérer spécifiquement le 404
            setError(`SmartLink non trouvé pour ${artistSlug}/${trackSlug}.`);
        }
      } finally {
        setLoading(false);
      }
    };

    if (artistSlug && trackSlug) {
      fetchSmartLink();
    }
  }, [artistSlug, trackSlug]);

  // Effet pour la redirection après un court délai pour permettre aux scripts de se charger
  useEffect(() => {
    if (redirectUrl) {
      console.log(`Redirection vers ${redirectUrl} dans 2 secondes...`);
      const timer = setTimeout(() => {
        window.location.href = redirectUrl;
      }, 2000); // Délai de 2 secondes
      return () => clearTimeout(timer);
    }
  }, [redirectUrl]);

  if (loading) {
    return <div>Chargement du SmartLink...</div>; // TODO: Remplacer par un Spinner
  }

  if (error) {
    return <div>Erreur: {error}</div>; // TODO: Remplacer par un message d'erreur stylisé
  }

  if (!smartLinkData) {
    return <div>SmartLink non trouvé ou données invalides.</div>;
  }

  return (
    <HelmetProvider>
      <Helmet>
        <title>{`${smartLinkData.smartLink.trackTitle} - ${smartLinkData.artist.name}`}</title>
        <meta name="description" content={smartLinkData.smartLink.description || "Écoutez maintenant !"} />
        <meta property="og:title" content={`${smartLinkData.smartLink.trackTitle} - ${smartLinkData.artist.name}`} />
        <meta property="og:description" content={smartLinkData.smartLink.description || "Découvrez le nouveau titre de " + smartLinkData.artist.name} />
        <meta property="og:image" content={smartLinkData.smartLink.coverImageUrl || "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg"} />
        <meta property="og:type" content="music.song" />
        <meta property="og:url" content={window.location.href} />
        {smartLinkData.artist.name && <meta property="music:musician" content={smartLinkData.artist.name} />}
        {smartLinkData.smartLink.releaseDate && <meta property="music:release_date" content={new Date(smartLinkData.smartLink.releaseDate).toISOString()} />}
      </Helmet>
      <div>
        <h1>{smartLinkData.smartLink.trackTitle}</h1>
        <h2>Par {smartLinkData.artist.name}</h2>
        <img src={smartLinkData.smartLink.coverImageUrl || "https://via.placeholder.com/300?text=Cover+Art"} alt={smartLinkData.smartLink.trackTitle} style={{maxWidth: "300px"}}/>
        {smartLinkData.smartLink.description && <p>{smartLinkData.smartLink.description}</p>}
        
        {redirectUrl ? (
            <p>Vous allez être redirigé vers {smartLinkData.smartLink.platformLinks.find(p => p.url === redirectUrl)?.platform || "la plateforme musicale"}...</p>
        ) : (
            <p>Préparation de votre lien...</p>
        )}
        
        <h3>Écoutez sur :</h3>
        <ul>
          {smartLinkData.smartLink.platformLinks && smartLinkData.smartLink.platformLinks.map(link => (
            link.url && <li key={link.platform}><a href={link.url} target="_blank" rel="noopener noreferrer">{link.platform}</a></li>
          ))}
        </ul>
      </div>
    </HelmetProvider>
  );
};

export default SmartLinkPage;

