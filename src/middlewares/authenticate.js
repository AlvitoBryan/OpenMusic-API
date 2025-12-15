const { AuthenticationError } = require('../utils/errors');

const createAuthenticationMiddleware = (tokenManager) => (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new AuthenticationError('Missing authentication');
    }

    const [scheme, token] = authHeader.split(' ');
    if (scheme !== 'Bearer' || !token) {
      throw new AuthenticationError('Format autentikasi tidak valid');
    }

    const { id } = tokenManager.verifyAccessToken(token);
    req.userId = id;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = createAuthenticationMiddleware;


