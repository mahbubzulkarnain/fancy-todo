const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  title: {
    type: String
  },
  description: {
    type: String
  },
  type: {
    type: String,
    enum: ['project', 'personal']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: (require('../User')).collection.name
  }
});

module.exports = mongoose.model('Todos', todoSchema);