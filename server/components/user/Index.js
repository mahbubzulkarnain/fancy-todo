const router = require('express')
  .Router();

const {isMe} = require('../../middlewares/Personal');

const User = require('./Controller');
const Auth = require('../auth/Controller');

router
  .get('/:user', isMe, User.read)
  .put('/:user', isMe, User.update)
  .delete('/:user', isMe, User.delete);

router
  .get('/', User.list)
  .post('/', Auth.register);

module.exports = router;