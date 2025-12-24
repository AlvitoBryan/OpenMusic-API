const { validateUserPayload } = require('../../validator/users');

class UsersHandler {
  constructor(service) {
    this._service = service;

    this.postUser = this.postUser.bind(this);
  }

  async postUser(req, res, next) {
    try {
      validateUserPayload(req.body);
      const userId = await this._service.addUser(req.body);

      res.status(201).json({
        status: 'success',
        data: {
          userId,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UsersHandler;


