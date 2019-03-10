const Project = require('../../../models/Project');
const Todo = require('../../../models/Todo');
const {code200, code201, code500} = require('../../../helpers/httpRequestCode');
const msg = require('../../../helpers/msg');
const ObjectId = require('mongoose').Types.ObjectId;

class TodoController {
  static create({params, body}, res) {
    delete body['_id'];
    (new Todo(Object.assign(body, {
      author: res.locals.user.id,
      project: params.project,
      type: `project`
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
    Project
      .findOneWithTodoAndItems({
        _id: ObjectId(params.todo),
        project: ObjectId(params.project)
      })
      .then((props) => {
        msg
          .json(res, code200, props)
      })
      .catch((err) => {
        msg
          .json(res, code500, null, err.message, err)
      })
  }

  static update({params, body}, res) {
    Todo
      .findOne({
        project: params.project,
      })
      .then(async (todo) => {
        if (!todo) {
          throw Todo()
            .invalidate('Todo', `Not found`, '')
        }
        delete body['_id'];
        delete body['author'];
        delete body['project'];
        Object.assign(todo, body);
        await todo.save();
        return Project.findOneWithTodoAndItems({
          _id: ObjectId(params.todo),
          project: ObjectId(params.project)
        })
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
      .findOne({
        project: params.project,
      })
      .then((todo) => {
        if (!todo) {
          throw Todo()
            .invalidate('Todo', `Not found`, '')
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