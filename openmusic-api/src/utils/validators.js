const { ValidationError } = require('./errors');

const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;

const validateAlbumPayload = (payload) => {
  const { name, year } = payload || {};

  if (!isNonEmptyString(name)) {
    throw new ValidationError('Gagal menambahkan album. Mohon isi nama album');
  }

  if (typeof year !== 'number' || Number.isNaN(year)) {
    throw new ValidationError('Gagal menambahkan album. Mohon isi tahun album dengan benar');
  }
};

const validateSongPayload = (payload) => {
  const {
    title,
    year,
    genre,
    performer,
    duration,
    albumId,
  } = payload || {};

  if (!isNonEmptyString(title)) {
    throw new ValidationError('Gagal menambahkan lagu. Mohon isi judul lagu');
  }

  if (typeof year !== 'number' || Number.isNaN(year)) {
    throw new ValidationError('Gagal menambahkan lagu. Mohon isi tahun lagu dengan benar');
  }

  if (!isNonEmptyString(genre)) {
    throw new ValidationError('Gagal menambahkan lagu. Mohon isi genre lagu');
  }

  if (!isNonEmptyString(performer)) {
    throw new ValidationError('Gagal menambahkan lagu. Mohon isi performer lagu');
  }

  if (duration !== undefined && duration !== null && (typeof duration !== 'number' || Number.isNaN(duration))) {
    throw new ValidationError('Gagal menambahkan lagu. Mohon isi durasi lagu dengan benar');
  }

  if (albumId !== undefined && albumId !== null && !isNonEmptyString(albumId)) {
    throw new ValidationError('Gagal menambahkan lagu. Mohon isi albumId dengan benar');
  }
};

module.exports = {
  validateAlbumPayload,
  validateSongPayload,
};


