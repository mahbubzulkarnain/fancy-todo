const Member = require('../../../models/Member');
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
      .findById(params.item, '-todo')
      .populate('assignee', 'name')
      .populate('changedBy', 'name')
      .then((prop) => {
        msg
          .json(res, code200, prop)
      })
      .catch((err) => {
        msg
          .json(res, code500, null, err.message, err)
      })
  }

  static delete({params}, res) {
    TodoItem
      .findById(params.item)
      .then((item) => {
        if (!item) {
          throw new TodoItem().invalidate('todo task', 'Not Found', params.todo)
        }
        return item.remove()
      })
      .then((prop)=>{
        msg
          .json(res, code200, prop)
      })
      .catch((err) => {
        msg
          .json(res, code500, null, err.message, err)
      })
  }

  static update({params, body}, res) {
    TodoItem
      .findById(params.item)
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

  static assignee({params, body}, res) {
    Promise.all([
      Member.findOne({user: body.user, project: params.project, status: 'approved'}),
      Todo.findOne({_id: ObjectId(params.todo), type: 'project'}),
      TodoItem.findOne({_id: ObjectId(params.item), todo: ObjectId(params.todo)}),
    ])
      .then(([member, todo, item]) => {
        if (!member || !todo || !item) {
          throw TodoItem().invalidate('todo', 'Not found', '')
        }
        item.assignee = ObjectId(body.user);
        item.changedBy = ObjectId(res.locals.user.id);
        if (body.dueDate) {
          item.dueDate = body.dueDate
        }
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
      Todo.findOne({_id: ObjectId(params.todo), type: 'project'}),
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