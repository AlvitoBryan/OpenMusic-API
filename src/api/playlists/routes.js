const express = require('express');

const createPlaylistRoutes = (handler, authenticate) => {
  const router = express.Router();

  router.use(authenticate);

  router.post('/playlists', handler.postPlaylist);
  router.get('/playlists', handler.getPlaylists);
  router.delete('/playlists/:id', handler.deletePlaylist);
  router.post('/playlists/:id/songs', handler.postPlaylistSong);
  router.get('/playlists/:id/songs', handler.getPlaylistSongs);

  return router;
};

module.exports = createPlaylistRoutes;


