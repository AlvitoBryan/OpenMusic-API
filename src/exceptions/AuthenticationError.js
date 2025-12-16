const ClientError = require('./ClientError');

class AuthenticationError extends ClientError {
  constructor(message = 'Anda tidak berhak mengakses resource ini') {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}

module.exports = AuthenticationError;



