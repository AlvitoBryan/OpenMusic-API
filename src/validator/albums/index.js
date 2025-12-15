const { AlbumPayloadSchema } = require('./schema');
const { InvariantError } = require('../../utils/errors');

const validateAlbumPayload = (payload) => {
  const { error } = AlbumPayloadSchema.validate(payload);
  if (error) {
    throw new InvariantError(error.message);
  }
};

module.exports = { validateAlbumPayload };


