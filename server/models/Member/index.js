const mongoose = require('mongoose');

const {ObjectId} = mongoose.Schema.Types;

const memberSchema = new mongoose.Schema({
  userId: {
    type: ObjectId,
    ref: (require('../Member')).collection.name,
    required: true
  },
  projectId: {
    type: ObjectId,
    ref: (require('../Project')).collection.name,
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Members', memberSchema);