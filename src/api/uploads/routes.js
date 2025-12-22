const express = require('express');

const createUploadRoutes = (handler, uploadMiddleware) => {
  const router = express.Router();

  router.post(
    '/albums/:id/covers',
    uploadMiddleware.single('cover'),
    handler.postUploadCover,
  );

  return router;
};

module.exports = createUploadRoutes;


