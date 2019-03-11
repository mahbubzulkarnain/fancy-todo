const router = require('express')
  .Router();

const Auth = require('./Controller');

router
  .post('/verify', Auth.verify)
  .post('/login', Auth.login)
  .post('/register', Auth.register);

module.exports = router;