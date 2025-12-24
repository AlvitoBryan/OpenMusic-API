const { createClient } = require('redis');

class CacheService {
  constructor() {
    const server = process.env.REDIS_SERVER || 'redis://localhost:6379';
    this._client = createClient({ url: server });
    this._client.on('error', (error) => {
      // eslint-disable-next-line no-console
      console.error('Redis Error:', error);
    });
    this._client.connect();
  }

  async set(key, value, expirationInSeconds = 1800) {
    await this._client.set(key, value, {
      EX: expirationInSeconds,
    });
  }

  async get(key) {
    const result = await this._client.get(key);
    return result;
  }

  async delete(key) {
    await this._client.del(key);
  }
}

module.exports = CacheService;




