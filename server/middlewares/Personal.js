const User = require('../models/User');
const Todo = require('../models/Todo');
const ObjectId = require('mongoose').Types.ObjectId;
const {code401} = require('../helpers/httpRequestCode');
const msg = require('../helpers/msg');

module.exports = {
  isMe: async function ({params}, res, next) {
    if (await User.findOne({_id: params.user}) && params.user + '' === res.locals.user.id) {
      next()
    } else {
      msg
        .json(res, code401, null, 'Unauthorized')
    }
  },
  isAuthor: async function (req, res, next) {
    if (await Todo.findOne({
      author: ObjectId(res.locals.user.id),
      _id: ObjectId(req.params.todo)
    })) {
      next()
    } else {
      msg
        .json(res, code401, null, 'Unauthorized')
    }
  }
};