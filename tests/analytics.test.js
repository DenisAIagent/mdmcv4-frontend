const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const SmartLink = require('../models/SmartLink');
const AnalyticsEvent = require('../models/AnalyticsEvent');
const { generateToken } = require('../utils/auth');

let testSmartLink;
let authToken;

beforeAll(async () => {
  // Créer un SmartLink de test
  testSmartLink = await SmartLink.create({
    trackTitle: 'Test Track',
    artistName: 'Test Artist',
    platforms: {
      spotify: 'https://spotify.com/test',
      deezer: 'https://deezer.com/test',
      apple: 'https://apple.com/test',
      youtube: 'https://youtube.com/test'
    }
  });

  // Générer un token pour les tests
  authToken = generateToken({ id: 'test-user' });
});

afterAll(async () => {
  // Nettoyer la base de données
  await SmartLink.deleteMany({});
  await AnalyticsEvent.deleteMany({});
  await mongoose.connection.close();
});

describe('Analytics API', () => {
  describe('POST /api/analytics/events', () => {
    it('devrait tracker un événement de page', async () => {
      const response = await request(app)
        .post('/api/analytics/events')
        .send({
          type: 'pageview',
          smartLinkId: testSmartLink._id
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.type).toBe('pageview');
    });

    it('devrait tracker un clic sur une plateforme', async () => {
      const response = await request(app)
        .post('/api/analytics/events')
        .send({
          type: 'platform_click',
          smartLinkId: testSmartLink._id,
          platform: 'spotify',
          url: 'https://spotify.com/test'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.type).toBe('platform_click');
      expect(response.body.data.platform).toBe('spotify');
    });
  });

  describe('GET /api/analytics/smartlinks/:smartLinkId', () => {
    beforeEach(async () => {
      // Créer quelques événements de test
      await AnalyticsEvent.create([
        {
          type: 'pageview',
          smartLinkId: testSmartLink._id,
          timestamp: new Date()
        },
        {
          type: 'platform_click',
          smartLinkId: testSmartLink._id,
          platform: 'spotify',
          url: 'https://spotify.com/test',
          timestamp: new Date()
        },
        {
          type: 'platform_click',
          smartLinkId: testSmartLink._id,
          platform: 'deezer',
          url: 'https://deezer.com/test',
          timestamp: new Date()
        }
      ]);
    });

    it('devrait récupérer les analytics d\'un SmartLink', async () => {
      const response = await request(app)
        .get(`/api/analytics/smartlinks/${testSmartLink._id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.totalViews).toBe(1);
      expect(response.body.data.totalClicks).toBe(2);
      expect(response.body.data.platformClicks.spotify).toBe(1);
      expect(response.body.data.platformClicks.deezer).toBe(1);
    });

    it('devrait filtrer par date', async () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 1);
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 1);

      const response = await request(app)
        .get(`/api/analytics/smartlinks/${testSmartLink._id}`)
        .query({
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        })
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.dailyData.length).toBeGreaterThan(0);
    });
  });
}); 