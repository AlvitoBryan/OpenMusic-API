const express = require('express');
const { InvariantError } = require('../../utils/errors');

const createUploadRoutes = (handler, uploadMiddleware) => {
  const router = express.Router();

  const uploadSingleCover = uploadMiddleware.single('cover');

  router.post('/albums/:id/covers', (req, res, next) => {
    uploadSingleCover(req, res, (err) => {
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return next(new InvariantError('Ukuran file terlalu besar. Maksimal 512KB'));
        }
        return next(new InvariantError(err.message));
      }
      return handler.postUploadCover(req, res, next);
    });
  });

  return router;
};

module.exports = createUploadRoutes;


