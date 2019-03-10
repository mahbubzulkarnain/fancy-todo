const router = require('express').Router();

const Project = require('./controllers/Projects');
const Member = require('./controllers/Members');
const Todo = require('./controllers/Todos');
const Item = require('./controllers/Items');

const {isMember} = require('../../middlewares/Project');

/**
 * Project Member
 */

router
  .post('/:project/members/invite', isMember, Member.invite);

router
  .get('/:project/members/:member/join', Member.join)
  .patch('/:project/members/:member/block', isMember, Member.block)
  .patch('/:project/members/:member/kick', isMember, Member.kick)
  .patch('/:project/members/:member', isMember, Member.approve);

router
  .get('/:project/members', isMember, Member.list);

/**
 * Project Todos items
 */

router
  .patch('/:project/todos/:todo/items/:item/assignee', isMember, Item.assignee)
  .patch('/:project/todos/:todo/items/:item/status', isMember, Item.status);

router
  .delete('/:project/todos/:todo/items/:item', isMember, Item.delete)
  .put('/:project/todos/:todo/items/:item', isMember, Item.update)
  .get('/:project/todos/:todo/items/:item', isMember, Item.read);

router
  .get('/:project/todos/:todo/items', isMember, Todo.read)
  .post('/:project/todos/:todo/items', isMember, Item.create);

/**
 * Project Todos
 */

router
  .get('/:project/todos/:todo', isMember, Todo.read)
  .put('/:project/todos/:todo', isMember, Todo.update)
  .delete('/:project/todos/:todo', isMember, Todo.delete);

router
  .get('/:project/todos/', isMember, Project.read)
  .post('/:project/todos/', isMember, Todo.create);

/**
 * Project
 */

router
  .get('/:project', isMember, Project.read)
  .put('/:project', isMember, Project.update)
  .delete('/:project', isMember, Project.delete);

router
  .get('/', Project.list)
  .post('/', Project.create);


module.exports = router;