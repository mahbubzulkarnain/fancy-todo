module.exports = function (schema) {
  schema.post('remove', async function () {
    let Todo = require('../Todo');
    let Member = require('../Member');
    try {
      await Todo.find({project: this._id}).remove().exec();
    } catch (e) {
      console.log(e)
    }
    try {
      await Member.find({project: this._id}).remove().exec();
    } catch (e) {
      console.log(e)
    }
  })
};