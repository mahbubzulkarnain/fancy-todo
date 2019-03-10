const router = require('express')
  .Router();

const Todo = require('./controllers/Todos');
const Item = require('./controllers/Items');

const {isAuthor} = require('../../middlewares/Personal');

/**
 * Todos Items
 */

router
  .patch('/:todo/items/:item/status', isAuthor, Item.status);

router
  .get('/:todo/items/:item', isAuthor, Item.read)
  .put('/:todo/items/:item', isAuthor, Item.update)
  .delete('/:todo/items/:item', isAuthor, Item.delete);

router
  .get('/:todo/items', isAuthor, Todo.read)
  .post('/:todo/items', isAuthor, Item.create);

/**
 * Todos
 */

router
  .get('/:todo', isAuthor, Todo.read)
  .put('/:todo', isAuthor, Todo.update)
  .delete('/:todo', isAuthor, Todo.delete);

router
  .get('/', Todo.list)
  .post('/', Todo.create);

module.exports = router;