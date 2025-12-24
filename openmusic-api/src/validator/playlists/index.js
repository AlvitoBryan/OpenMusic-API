const {
  PlaylistPayloadSchema,
  PlaylistSongPayloadSchema,
} = require('./schema');
const { InvariantError } = require('../../utils/errors');

const validatePlaylistPayload = (payload) => {
  const { error } = PlaylistPayloadSchema.validate(payload);
  if (error) {
    throw new InvariantError(error.message);
  }
};

const validatePlaylistSongPayload = (payload) => {
  const { error } = PlaylistSongPayloadSchema.validate(payload);
  if (error) {
    throw new InvariantError(error.message);
  }
};

module.exports = {
  validatePlaylistPayload,
  validatePlaylistSongPayload,
};


