const { SongPayloadSchema } = require('./schema');
const { InvariantError } = require('../../utils/errors');

const validateSongPayload = (payload) => {
  const { error } = SongPayloadSchema.validate(payload);
  if (error) {
    throw new InvariantError(error.message);
  }
};

module.exports = { validateSongPayload };


