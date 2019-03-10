const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
  },
  isPublic: {
    type: Boolean,
    default: true
  }
});

projectSchema.statics = {...projectSchema.statics, ...(require('./statics'))};
projectSchema.plugin(require('./middlewares'));

module.exports = mongoose.model('projects', projectSchema);