const bcrypt = require('bcrypt');
// const ObjectId = (require('mongoose')).Types.ObjectId;

module.exports = function (schema) {
  schema.pre('save', async function (next) {
    let findId = {};
    if (this._id) {
      findId = {
        _id: {
          $ne: this._id
        }
      }
    }
    if (await this.constructor.findOne({
      ...findId,
      email: this.email
    })) {
      throw this.invalidate('email', 'Email has already exist', this.email)
    }
    this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(8));
    next()
  });
  schema.pre('findOne', function (next) {
    let lenghtId = (this._conditions._id + '').length;
    if (this._conditions && this._conditions._id && lenghtId !== 15 && lenghtId !== 24) {
      throw this.model()
        .invalidate('id', `Id is not valid`, this._conditions._id)
    }
    next()
<<<<<<< HEAD
  });
=======
  })
>>>>>>> Init Server
};