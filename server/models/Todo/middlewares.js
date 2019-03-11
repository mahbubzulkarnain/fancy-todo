module.exports = function (schema) {
  schema.post('remove', async function () {
    let TodoItem = require('../TodoItem');
    try {
      await TodoItem.find({todo: this._id}).remove().exec()
    } catch (e) {
      console.log(e)
    }
  })
};