module.exports = function (schema) {
  schema.pre('save', async function (next) {
    let Todo = require('../Todo');
    if (!(await Todo.findById(this.todo))) {
      throw this.invalidate('todo', 'Not found', this.todo)
    }
    next();
  });
};