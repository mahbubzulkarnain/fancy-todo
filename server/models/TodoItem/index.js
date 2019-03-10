const mongoose = require('mongoose');

const {ObjectId} = mongoose.Schema.Types;

const User = (require('../User')).collection.name;

const todoIitemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['backlog', 'ongoing', 'hold', 'review', 'done'],
    default: 'backlog'
  },
  assignee: {
    type: ObjectId,
    ref: User,
    default: null
  },
  changedBy: {
    type: ObjectId,
    default: null,
    ref: User
  },
  todo: {
    type: ObjectId,
    ref: (require('../Todo')).collection.name,
    required: true
  },
  dueDate: {
    type: Date
  },
});

todoIitemSchema.plugin(require('./middlewares'));

module.exports = mongoose.model('todoitems', todoIitemSchema);