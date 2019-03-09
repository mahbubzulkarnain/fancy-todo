const router = require('express')
  .Router();

const Todo = require('./controller');

router
  .get('/:id', Todo.read)
  .put('/:id', Todo.update)
  .delete('/:id', Todo.delete);

router
  .get('/', Todo.list)
  .post('/', Todo.create);

module.exports = router;