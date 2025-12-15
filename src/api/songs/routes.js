const express = require('express');

const createSongRoutes = (handler) => {
  const router = express.Router();

  router.post('/songs', handler.postSong);
  router.get('/songs', handler.getSongs);
  router.get('/songs/:id', handler.getSongById);
  router.put('/songs/:id', handler.putSongById);
  router.delete('/songs/:id', handler.deleteSongById);

  return router;
};

module.exports = createSongRoutes;


