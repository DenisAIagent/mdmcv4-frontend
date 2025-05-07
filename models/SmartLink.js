const mongoose = require('mongoose');

const smartLinkSchema = new mongoose.Schema({
  artistId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artist',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  platforms: {
    spotify: String,
    deezer: String,
    appleMusic: String,
    youtube: String
  },
  trackingIds: {
    ga4: {
      artistId: String,  // ID GA4 de l'artiste
      propertyId: String // ID GA4 de la propriété pour ce single
    },
    gtm: {
      artistId: String,  // ID GTM de l'artiste
      containerId: String // ID GTM du conteneur pour ce single
    },
    googleAds: {
      artistId: String,     // ID de conversion Google Ads de l'artiste
      conversionId: String, // ID de conversion Google Ads pour ce single
      label: String        // Label de conversion pour ce single
    },
    meta: {
      artistId: String,  // ID Meta Pixel de l'artiste
      pixelId: String    // ID Meta Pixel pour ce single
    },
    tiktok: {
      artistId: String,  // ID TikTok Pixel de l'artiste
      pixelId: String    // ID TikTok Pixel pour ce single
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware pour mettre à jour updatedAt
smartLinkSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('SmartLink', smartLinkSchema); 