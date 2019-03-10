const Todo = require('../../../models/Todo');
const {code200, code201, code500} = require('../../../helpers/httpRequestCode');
const msg = require('../../../helpers/msg');
const ObjectId = require('mongoose').Types.ObjectId;

class TodoController {
  static create({body}, res) {
    delete body['_id'];
    (new Todo(Object.assign(body, {
      author: res.locals.user.id
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

  static list(req, res) {
    Todo
      .find({
        author: ObjectId(res.locals.user.id),
        type: 'personal'
      }, '-author')
      .then((props) => {
        msg
          .json(res, code200, props)
      })
      .catch((err) => {
        msg
          .json(res, code500, null, err.message, err)
      })
  }

  static read({params}, res) {
    Todo
      .findOneWithItem({_id: ObjectId(params.todo), author: ObjectId(res.locals.user.id), type: 'personal'})
      .then((prop) => {
        msg
          .json(res, code200, prop)
      })
      .catch((err) => {
        msg
          .json(res, code500, params, err.message, err)
      })
  }

  static update({params, body}, res) {
    Todo
      .findById(params.todo)
      .then((todo) => {
        if (!todo) {
          throw Todo()
            .invalidate('Todo', `Not found`, '')
        }
        if (todo.author !== res.locals.user.id) {
          throw Todo()
            .invalidate('Todo', `Unauthorized`, '')
        }
        delete body['_id'];
        delete body['author'];
        delete body['project'];
        Object.assign(todo, body);
        return todo.save()
      })
      .then((prop) => {
        msg
          .json(res, code200, prop)
      })
      .catch((err) => {
        msg
          .json(res, code500, params, err.message, err)
      })
  }

  static delete({params}, res) {
    Todo
      .findById(params.todo)
      .then((todo) => {
        if (!todo) {
          throw Todo().invalidate('todo', 'Not Found', '')
        }
        if (todo.author !== res.locals.user.id) {
          throw Todo()
            .invalidate('Todo', `Unauthorized`, '')
        }
        return todo.remove()
      })
      .then((prop) => {
        msg
          .json(res, code200, prop)
      })
      .catch((err) => {
        msg
          .json(res, code500, params, err.message, err)
      })
  }
}

module.exports = TodoController;