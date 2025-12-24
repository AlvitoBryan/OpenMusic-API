const express = require('express');

const createLikesRoutes = (handler, authenticate) => {
  const router = express.Router();

  router.post('/albums/:id/likes', authenticate, handler.postLike);
  router.delete('/albums/:id/likes', authenticate, handler.deleteLike);
  router.get('/albums/:id/likes', handler.getLikes);

  return router;
};

module.exports = createLikesRoutes;




