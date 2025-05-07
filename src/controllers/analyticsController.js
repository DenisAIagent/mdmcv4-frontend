const AnalyticsEvent = require('../models/AnalyticsEvent');
const SmartLink = require('../models/SmartLink');
const cache = require('../utils/cache');
const logger = require('../utils/logger');

// Créer un nouvel événement d'analytics
exports.trackEvent = async (req, res) => {
  try {
    const { type, smartLinkId, platform, url } = req.body;

    // Vérifier si le SmartLink existe
    const smartLink = await SmartLink.findById(smartLinkId);
    if (!smartLink) {
      logger.warn(`SmartLink non trouvé: ${smartLinkId}`);
      return res.status(404).json({
        success: false,
        error: 'SmartLink non trouvé'
      });
    }

    // Créer l'événement avec les informations supplémentaires
    const event = new AnalyticsEvent({
      type,
      smartLinkId,
      platform,
      url,
      userAgent: req.headers['user-agent'],
      ipAddress: req.ip,
      referrer: req.headers.referer
    });

    await event.save();

    // Invalider le cache pour ce SmartLink
    await cache.del(`analytics:${smartLinkId}`);

    logger.info(`Événement tracké: ${type} pour SmartLink ${smartLinkId}`);
    res.status(201).json({
      success: true,
      data: event
    });
  } catch (error) {
    logger.error('Erreur lors du tracking de l\'événement:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors du tracking de l\'événement'
    });
  }
};

// Récupérer les analytics d'un SmartLink
exports.getSmartLinkAnalytics = async (req, res) => {
  try {
    const { smartLinkId } = req.params;
    const { startDate, endDate, page = 1, limit = 100 } = req.query;

    // Vérifier le cache
    const cacheKey = `analytics:${smartLinkId}:${startDate}:${endDate}:${page}:${limit}`;
    const cachedData = await cache.get(cacheKey);
    if (cachedData) {
      logger.info(`Données récupérées du cache pour SmartLink ${smartLinkId}`);
      return res.json(cachedData);
    }

    // Construire le filtre de date
    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.timestamp = {};
      if (startDate) dateFilter.timestamp.$gte = new Date(startDate);
      if (endDate) dateFilter.timestamp.$lte = new Date(endDate);
    }

    // Récupérer les événements avec pagination
    const skip = (page - 1) * limit;
    const [events, total] = await Promise.all([
      AnalyticsEvent.find({
        smartLinkId,
        ...dateFilter
      })
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      AnalyticsEvent.countDocuments({
        smartLinkId,
        ...dateFilter
      })
    ]);

    // Calculer les métriques
    const totalViews = events.filter(e => e.type === 'pageview').length;
    const totalClicks = events.filter(e => e.type === 'platform_click').length;
    
    // Calculer les clics par plateforme
    const platformClicks = events
      .filter(e => e.type === 'platform_click')
      .reduce((acc, event) => {
        acc[event.platform] = (acc[event.platform] || 0) + 1;
        return acc;
      }, {});

    // Calculer les données quotidiennes
    const dailyData = events.reduce((acc, event) => {
      const date = event.timestamp.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { views: 0, clicks: 0 };
      }
      if (event.type === 'pageview') {
        acc[date].views++;
      } else {
        acc[date].clicks++;
      }
      return acc;
    }, {});

    const response = {
      success: true,
      data: {
        totalViews,
        totalClicks,
        platformClicks,
        dailyData: Object.entries(dailyData).map(([date, data]) => ({
          date,
          ...data
        })),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    };

    // Mettre en cache pour 5 minutes
    await cache.set(cacheKey, response, 300);

    logger.info(`Analytics récupérés pour SmartLink ${smartLinkId}`);
    res.json(response);
  } catch (error) {
    logger.error('Erreur lors de la récupération des analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des analytics'
    });
  }
}; 