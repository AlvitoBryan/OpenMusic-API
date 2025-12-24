const { UserPayloadSchema } = require('./schema');
const { InvariantError } = require('../../utils/errors');

const validateUserPayload = (payload) => {
  const { error } = UserPayloadSchema.validate(payload);
  if (error) {
    throw new InvariantError(error.message);
  }
};

module.exports = { validateUserPayload };


