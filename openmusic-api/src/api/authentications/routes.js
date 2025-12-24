const express = require('express');

const createAuthenticationRoutes = (handler) => {
  const router = express.Router();

  router.post('/authentications', handler.postAuthentication);
  router.put('/authentications', handler.putAuthentication);
  router.delete('/authentications', handler.deleteAuthentication);

  return router;
};

module.exports = createAuthenticationRoutes;


