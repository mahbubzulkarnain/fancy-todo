const mongoose = require('mongoose');

const {ObjectId} = mongoose.Schema.Types;

const User = (require('../User')).collection.name;

const todoIitemSchema = new mongoose.Schema({
  title: {
    type: String
  },
  status: {
    type: String,
    enum: ['backlog', 'ongoing', 'hold', 'review', 'done'],
    default: 'backlog'
  },
  assignee: {
    type: ObjectId,
    ref: User
  },
  changedBy: {
    type: ObjectId,
    default: null,
    ref: User
  },
  dueDate: {
    type: Date
  },
});

module.exports = mongoose.model('TodoItems', todoIitemSchema);