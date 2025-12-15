const express = require('express');

const createUserRoutes = (handler) => {
  const router = express.Router();

  router.post('/users', handler.postUser);

  return router;
};

module.exports = createUserRoutes;


