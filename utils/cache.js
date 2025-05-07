const Redis = require('ioredis');
const logger = require('./logger');

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  }
});

redis.on('error', (err) => {
  logger.error('Erreur Redis:', err);
});

const cache = {
  async get(key) {
    try {
      const data = await redis.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      logger.error('Erreur lors de la récupération du cache:', error);
      return null;
    }
  },

  async set(key, value, ttl = 3600) {
    try {
      await redis.set(key, JSON.stringify(value), 'EX', ttl);
      return true;
    } catch (error) {
      logger.error('Erreur lors de la mise en cache:', error);
      return false;
    }
  },

  async del(key) {
    try {
      await redis.del(key);
      return true;
    } catch (error) {
      logger.error('Erreur lors de la suppression du cache:', error);
      return false;
    }
  },

  async flush() {
    try {
      await redis.flushall();
      return true;
    } catch (error) {
      logger.error('Erreur lors du nettoyage du cache:', error);
      return false;
    }
  }
};

module.exports = cache; 