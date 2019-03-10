const User = require('../../models/User');

const {code200, code500} = require('../../helpers/httpRequestCode');
const msg = require('../../helpers/msg');

class Controller {
  static list(req, res) {
    User
      .find()
      .then((props) => {
        msg
          .json(res, code200, props)
      })
      .catch((e) => {
        msg
          .json(res, code500, null, code500.message, e)
      })
  }

  static read({params}, res) {
    User
      .findById(params.user)
      .then((prop) => {
        msg
          .json(res, code200, prop)
      })
      .catch((err) => {
        msg
          .json(res, code500, null, null, err)
      })
  }

  static update({params, body}, res) {
    User
      .findById(params.user)
      .then((user) => {
        if (!user) {
          throw User()
            .invalidate('user', 'Not found', '')
        }
        delete body['_id'];
        Object.assign(user, body);
        return user.save()
      })
      .then((prop) => {
        msg
          .json(res, code200, prop)
      })
      .catch((err) => {
        msg
          .json(res, code500, body, err.message, err)
      })
  }

  static delete({params}, res) {
    User
      .findById(params.user)
      .then((user) => {
        if (!user) {
          throw  User()
            .invalidate('user', 'Not found', '')
        }
        return user.remove()
      })
      .then((prop) => {
        msg
          .json(res, code200, prop)
      })
      .catch((err) => {
        msg
          .json(res, code500, null, err.message, err)
      })
  }
}

module.exports = Controller;