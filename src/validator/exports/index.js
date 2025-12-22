const { ExportPlaylistPayloadSchema } = require('./schema');
const { InvariantError } = require('../../utils/errors');

const validateExportPlaylistPayload = (payload) => {
  const { error } = ExportPlaylistPayloadSchema.validate(payload);
  if (error) {
    throw new InvariantError(error.message);
  }
};

module.exports = { validateExportPlaylistPayload };


