const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: (require('../User')).collection.name
  }
});

module.exports = mongoose.model('Projects', projectSchema);