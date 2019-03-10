const mongoose = require('mongoose');
let User = (require('../User')).collection.name;
let Project = (require('../Project')).collection.name;

const memberSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: User,
    required: true
  },
  project: {
    type: mongoose.Types.ObjectId,
    ref: Project,
    required: true
  },
  status: {
    type: String,
    enum: ['invited', 'requested', 'approved', 'blocked'],
    default: 'requested'
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  changedBy: {
    type: mongoose.Types.ObjectId,
    ref: User,
    default: null
  }
});

module.exports = mongoose.model('members', memberSchema);