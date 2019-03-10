module.exports = function (schema) {
  schema.pre('save', async function (next) {
    let Project = require('../Project');
    if (!(await Project.findById(this.project))) {
      throw this.invalidate('project', 'Not found', this.project)
    }
    next();
  });
  schema.post('remove', async function () {
    let TodoItem = require('../TodoItem');
    try {
      await TodoItem.find({todo: this._id}).remove().exec()
    } catch (e) {
      console.log(e)
    }
  })
};