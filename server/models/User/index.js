const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    index: true
  },
  email: {
    type: String,
    required: [true, 'Email is required']
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  }
});

userSchema.plugin(require('./middlewares'));

module.exports = mongoose.model('users', userSchema);
