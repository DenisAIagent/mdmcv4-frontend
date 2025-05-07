const mongoose = require('mongoose');

const analyticsEventSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['pageview', 'platform_click', 'conversion']
  },
  smartLinkId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SmartLink',
    required: true
  },
  platform: {
    type: String,
    enum: ['spotify', 'deezer', 'apple', 'youtube'],
    required: function() {
      return this.type === 'platform_click';
    }
  },
  url: {
    type: String,
    required: function() {
      return this.type === 'platform_click';
    }
  },
  source: {
    type: String,
    enum: ['ga4', 'google_ads', 'meta', 'tiktok'],
    required: function() {
      return this.type === 'conversion';
    }
  },
  converted: {
    type: Boolean,
    default: false
  },
  conversionValue: {
    type: Number,
    default: 0
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  userAgent: String,
  ipAddress: String,
  referrer: String
}, {
  timestamps: true
});

// Index pour optimiser les requêtes
analyticsEventSchema.index({ smartLinkId: 1, type: 1, timestamp: -1 });
analyticsEventSchema.index({ source: 1, type: 1, timestamp: -1 });
analyticsEventSchema.index({ platform: 1, type: 1, timestamp: -1 });

const AnalyticsEvent = mongoose.model('AnalyticsEvent', analyticsEventSchema);

module.exports = AnalyticsEvent; 