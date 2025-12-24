const express = require('express');

const createExportRoutes = (handler, authenticate) => {
  const router = express.Router();

  router.post('/export/playlists/:id', authenticate, handler.postExportPlaylist);

  return router;
};

module.exports = createExportRoutes;


