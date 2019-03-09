const mongoose = require('mongoose');
const {ObjectId} = mongoose.Types;

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: null
  },
  type: {
    type: String,
    enum: ['project', 'personal'],
    default: 'personal'
  },
  project: {
    type: ObjectId,
    ref: (require('../Project')).collection.name
  },
  author: {
    type: ObjectId,
    ref: (require('../User')).collection.name,
    required: true
  }
});

todoSchema.statics = {...todoSchema.statics, ...(require('./statics'))};
todoSchema.plugin(require('./middlewares'));

module.exports = mongoose.model('todos', todoSchema);
