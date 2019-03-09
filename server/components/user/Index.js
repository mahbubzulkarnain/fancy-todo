const router = require('express')
  .Router()

const User = require('./Controller');
const Auth = require('../auth/Controller');

router
  .get('/:id', User.read)
  .put('/:id', User.update)
  .delete('/:id', User.delete);

router
  .get('/', User.list)
  .post('/', Auth.register);

module.exports = router;