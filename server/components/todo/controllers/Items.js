const Todo = require('../../../models/Todo');
const TodoItem = require('../../../models/TodoItem');
const {code200, code201, code500} = require('../../../helpers/httpRequestCode');
const msg = require('../../../helpers/msg');
const ObjectId = require('mongoose').Types.ObjectId;

class ItemController {
  static create({params, body}, res) {
    delete body['_id'];
    (new TodoItem(Object.assign(body, {
      todo: params.todo
    })))
      .save((err, resSave) => {
        if (err) {
          msg
            .json(res, code500, body, err.message, err)
        } else {
          msg
            .json(res, code201, resSave)
        }
      })
  }

  static read({params}, res) {
    TodoItem
      .findOne({
        _id: ObjectId(params.item),
        todo: ObjectId(params.todo)
      })
      .populate('todo', '-_id type author')
      .populate('assignee', 'name')
      .populate('changedBy', 'name')
      .then((prop) => {
        if (prop.todo.type !== 'personal') {
          msg
            .json(res, code200, {})
        } else {
          msg
            .json(res, code200, prop)
        }

      })
      .catch((err) => {
        msg
          .json(res, code500, null, err.message, err)
      })
  }

  static delete({params}, res) {
    TodoItem
      .findOne({
        _id: ObjectId(params.item),
        todo: ObjectId(params.todo)
      })
      .then((item) => {
        if (!item) {
          throw TodoItem().invalidate('todo task', 'Not Found', params.todo)
        }
        return item.remove()
      })
      .catch((err) => {
        msg
          .json(res, code500, null, err.message, err)
      })
  }

  static update({params, body}, res) {
    TodoItem
      .findOne({
        _id: ObjectId(params.item),
        todo: ObjectId(params.todo)
      })
      .then((item) => {
        if (!item) {
          throw TodoItem().invalidate('todo task', 'Not Found', params.todo)
        }
        delete body['_id'];
        delete body['todo'];
        Object.assign(item, body);
        return item.save()
      })
      .then((prop) => {
        msg
          .json(res, code200, prop)
      })
      .catch((err) => {
        msg
          .json(res, code500, null, err.message, err)
      })
  }

  static status({params, body}, res) {
    Promise.all([
      Todo.findOne({_id: ObjectId(params.todo), type: 'personal'}),
      TodoItem.findOne({_id: ObjectId(params.item), todo: ObjectId(params.todo)}),
    ])
      .then(([todo, item]) => {
        if (!todo || !item) {
          throw TodoItem().invalidate('todo', 'Not found', '')
        }
        item.status = body.status;
        item.changedBy = ObjectId(res.locals.user.id);
        return item.save()
      })
      .then((prop) => {
        msg
          .json(res, code200, prop)
      })
      .catch((err) => {
        msg
          .json(res, code500, null, err.message, err)
      })
  }
}

module.exports = ItemController;