const {verify} = require('jsonwebtoken');

const User = require('../models/User');
const {code401} = require('../helpers/httpRequestCode');
const msg = require('../helpers/msg');

module.exports = async function (req, res, next) {
  var token = req.headers['authorization'];
  if (token && token.split(' ')[0] === 'Bearer') {
    try {
      res.locals.user = verify(token.split(' ')[1], process.env.JWT_SECRET);
      const user = await User.findOne({email: res.locals.user.email});
      if (user) {
        res.locals.user.id = user._id;
        return next()
      }
    } catch (e) {
      console.log(e)
    }
  }
  msg
    .json(res, code401, req.body || null, msg.error.unauthorized)
};