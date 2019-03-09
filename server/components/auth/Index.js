const router = require('express')
  .Router();

const Auth = require('./Controller');

router
  .post('/login', Auth.login)
  .post('/register', Auth.register);

module.exports = router;