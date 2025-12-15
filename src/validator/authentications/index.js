const {
  PostAuthenticationSchema,
  PutAuthenticationSchema,
} = require('./schema');
const { InvariantError } = require('../../utils/errors');

const validatePostAuthenticationPayload = (payload) => {
  const { error } = PostAuthenticationSchema.validate(payload);
  if (error) {
    throw new InvariantError(error.message);
  }
};

const validatePutAuthenticationPayload = (payload) => {
  const { error } = PutAuthenticationSchema.validate(payload);
  if (error) {
    throw new InvariantError(error.message);
  }
};

module.exports = {
  validatePostAuthenticationPayload,
  validatePutAuthenticationPayload,
};


