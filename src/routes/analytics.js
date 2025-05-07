const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { authenticateToken } = require('../middleware/auth');

// Route pour tracker un événement
router.post('/events', analyticsController.trackEvent);

// Route pour récupérer les analytics d'un SmartLink
router.get('/smartlinks/:smartLinkId', authenticateToken, analyticsController.getSmartLinkAnalytics);

module.exports = router; 