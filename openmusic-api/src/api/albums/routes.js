const express = require('express');

const createAlbumRoutes = (handler) => {
  const router = express.Router();

  router.post('/albums', handler.postAlbum);
  router.get('/albums/:id', handler.getAlbumById);
  router.put('/albums/:id', handler.putAlbumById);
  router.delete('/albums/:id', handler.deleteAlbumById);

  return router;
};

module.exports = createAlbumRoutes;


