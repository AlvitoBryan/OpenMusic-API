const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('./errors');

class TokenManager {
  constructor({
    accessTokenKey,
    refreshTokenKey,
    accessTokenAge = '30m',
  }) {
    if (!accessTokenKey || !refreshTokenKey) {
      throw new Error('ACCESS_TOKEN_KEY dan REFRESH_TOKEN_KEY wajib diatur');
    }

    this._accessTokenKey = accessTokenKey;
    this._refreshTokenKey = refreshTokenKey;
    this._accessTokenAge = accessTokenAge;
  }

  generateAccessToken(payload) {
    return jwt.sign(payload, this._accessTokenKey, { expiresIn: this._accessTokenAge });
  }

  generateRefreshToken(payload) {
    return jwt.sign(payload, this._refreshTokenKey);
  }

  verifyAccessToken(token) {
    try {
      return jwt.verify(token, this._accessTokenKey);
    } catch (error) {
      throw new AuthenticationError('Token akses tidak valid');
    }
  }

  verifyRefreshToken(token) {
    try {
      return jwt.verify(token, this._refreshTokenKey);
    } catch (error) {
      throw new AuthenticationError('Token refresh tidak valid');
    }
  }
}

module.exports = TokenManager;


