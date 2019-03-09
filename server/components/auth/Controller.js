const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = require('../../models/User');

const {code200, code201, code401, code501} = require('../../helpers/httpRequestCode');
const msg = require('../../helpers/msg');

class AuthController {
  static login({body}, res, next) {
    User
      .findOne({email: body.email})
      .then((prop) => {
        if (prop) {
          if (bcrypt.compareSync(body.password, prop.password)) {
            msg
              .json(res, code200, {
                token: jwt.sign({id: prop.id}, process.env.JWT_SECRET)
              })
          } else {
            msg
              .json(res, code401, {email: body.email}, msg.error.login)
          }
        } else {
          msg
            .json(res, code401, {email: body.email}, msg.error.login)
        }
      })
      .catch((err) => {
        msg
          .json(res, code401, {email: body.email}, null, err)
      })
  }

  static register({body}, res) {
    (new User(body))
      .save((errSave, resSave) => {
        if (errSave) {
          msg.json(res, code501, body, errSave.errors, errSave)
        } else {
          msg.json(res, code201, resSave)
        }
      })
  }
}

module.exports = AuthController;