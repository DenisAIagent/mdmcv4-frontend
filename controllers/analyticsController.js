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

// Récupérer les données de conversion
exports.getConversions = async (req, res) => {
  try {
    const { source, startDate, endDate } = req.query;

    // Vérifier le cache
    const cacheKey = `conversions:${source}:${startDate}:${endDate}`;
    const cachedData = await cache.get(cacheKey);
    if (cachedData) {
      logger.info(`Données de conversion récupérées du cache pour ${source}`);
      return res.json(cachedData);
    }

    // Construire le filtre de date
    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.timestamp = {};
      if (startDate) dateFilter.timestamp.$gte = new Date(startDate);
      if (endDate) dateFilter.timestamp.$lte = new Date(endDate);
    }

    // Récupérer les événements selon la source
    let events;
    switch (source) {
      case 'GA4':
        events = await AnalyticsEvent.find({
          type: 'conversion',
          source: 'ga4',
          ...dateFilter
        });
        break;
      case 'GOOGLE_ADS':
        events = await AnalyticsEvent.find({
          type: 'conversion',
          source: 'google_ads',
          ...dateFilter
        });
        break;
      case 'META':
        events = await AnalyticsEvent.find({
          type: 'conversion',
          source: 'meta',
          ...dateFilter
        });
        break;
      case 'TIKTOK':
        events = await AnalyticsEvent.find({
          type: 'conversion',
          source: 'tiktok',
          ...dateFilter
        });
        break;
      default:
        events = await AnalyticsEvent.find({
          type: 'conversion',
          ...dateFilter
        });
    }

    // Calculer les métriques
    const totalConversions = events.length;
    const totalClicks = await AnalyticsEvent.countDocuments({
      type: 'platform_click',
      ...dateFilter
    });
    const conversionRate = totalClicks > 0 ? totalConversions / totalClicks : 0;

    // Calculer la valeur totale des conversions
    const totalConversionValue = events.reduce((sum, event) => sum + (event.conversionValue || 0), 0);

    // Calculer le temps moyen jusqu'à la conversion
    const conversionTimes = await AnalyticsEvent.aggregate([
      {
        $match: {
          type: 'conversion',
          ...dateFilter
        }
      },
      {
        $lookup: {
          from: 'analyticevents',
          let: { smartLinkId: '$smartLinkId', timestamp: '$timestamp' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$smartLinkId', '$$smartLinkId'] },
                    { $eq: ['$type', 'platform_click'] },
                    { $lt: ['$timestamp', '$$timestamp'] }
                  ]
                }
              }
            },
            {
              $sort: { timestamp: -1 }
            },
            {
              $limit: 1
            }
          ],
          as: 'lastClick'
        }
      },
      {
        $match: {
          lastClick: { $ne: [] }
        }
      },
      {
        $project: {
          timeToConvert: {
            $divide: [
              { $subtract: ['$timestamp', { $arrayElemAt: ['$lastClick.timestamp', 0] }] },
              1000 * 60 // Convertir en minutes
            ]
          }
        }
      }
    ]);

    const averageTimeToConvert = conversionTimes.length > 0
      ? conversionTimes.reduce((sum, event) => sum + event.timeToConvert, 0) / conversionTimes.length
      : 0;

    // Calculer les conversions par plateforme avec plus de détails
    const platformBreakdown = await AnalyticsEvent.aggregate([
      {
        $match: {
          type: 'platform_click',
          ...dateFilter
        }
      },
      {
        $group: {
          _id: '$platform',
          clicks: { $sum: 1 },
          conversions: {
            $sum: {
              $cond: [
                { $eq: ['$converted', true] },
                1,
                0
              ]
            }
          },
          conversionValue: {
            $sum: {
              $cond: [
                { $eq: ['$converted', true] },
                '$conversionValue',
                0
              ]
            }
          }
        }
      },
      {
        $project: {
          platform: '$_id',
          clicks: 1,
          conversions: 1,
          conversionValue: 1,
          conversionRate: {
            $multiply: [
              { $divide: ['$conversions', '$clicks'] },
              100
            ]
          },
          _id: 0
        }
      }
    ]);

    // Calculer les données quotidiennes avec plus de détails
    const dailyData = await AnalyticsEvent.aggregate([
      {
        $match: {
          type: 'platform_click',
          ...dateFilter
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$timestamp'
            }
          },
          clicks: { $sum: 1 },
          conversions: {
            $sum: {
              $cond: [
                { $eq: ['$converted', true] },
                1,
                0
              ]
            }
          },
          conversionValue: {
            $sum: {
              $cond: [
                { $eq: ['$converted', true] },
                '$conversionValue',
                0
              ]
            }
          }
        }
      },
      {
        $project: {
          date: '$_id',
          clicks: 1,
          conversions: 1,
          conversionValue: 1,
          conversionRate: {
            $multiply: [
              { $divide: ['$conversions', '$clicks'] },
              100
            ]
          },
          _id: 0
        }
      },
      {
        $sort: { date: 1 }
      }
    ]);

    const response = {
      success: true,
      data: {
        totalConversions,
        totalConversionValue,
        conversionRate,
        averageTimeToConvert,
        platformBreakdown,
        dailyData
      }
    };

    // Mettre en cache pour 5 minutes
    await cache.set(cacheKey, response, 300);

    logger.info(`Données de conversion récupérées pour ${source}`);
    res.json(response);
  } catch (error) {
    logger.error('Erreur lors de la récupération des conversions:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des conversions'
    });
  }
}; 