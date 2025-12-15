const {
  validatePostAuthenticationPayload,
  validatePutAuthenticationPayload,
} = require('../../validator/authentications');

class AuthenticationsHandler {
  constructor(authenticationsService, usersService, tokenManager) {
    this._authenticationsService = authenticationsService;
    this._usersService = usersService;
    this._tokenManager = tokenManager;

    this.postAuthentication = this.postAuthentication.bind(this);
    this.putAuthentication = this.putAuthentication.bind(this);
    this.deleteAuthentication = this.deleteAuthentication.bind(this);
  }

  async postAuthentication(req, res, next) {
    try {
      validatePostAuthenticationPayload(req.body);
      const { username, password } = req.body;
      const userId = await this._usersService.verifyUserCredential(username, password);

      const accessToken = this._tokenManager.generateAccessToken({ id: userId });
      const refreshToken = this._tokenManager.generateRefreshToken({ id: userId });

      await this._authenticationsService.addRefreshToken(refreshToken);

      res.status(201).json({
        status: 'success',
        data: {
          accessToken,
          refreshToken,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async putAuthentication(req, res, next) {
    try {
      validatePutAuthenticationPayload(req.body);
      const { refreshToken } = req.body;

      await this._authenticationsService.verifyRefreshToken(refreshToken);
      const { id } = this._tokenManager.verifyRefreshToken(refreshToken);
      const accessToken = this._tokenManager.generateAccessToken({ id });

      res.status(200).json({
        status: 'success',
        message: 'Access token berhasil diperbarui',
        data: {
          accessToken,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteAuthentication(req, res, next) {
    try {
      validatePutAuthenticationPayload(req.body);
      const { refreshToken } = req.body;

      await this._authenticationsService.verifyRefreshToken(refreshToken);
      await this._authenticationsService.deleteRefreshToken(refreshToken);

      res.status(200).json({
        status: 'success',
        message: 'Refresh token berhasil dihapus',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthenticationsHandler;


