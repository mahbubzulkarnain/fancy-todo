const Member = require('../models/Member');
const ObjectId = require('mongoose').Types.ObjectId;
const {code401} = require('../helpers/httpRequestCode');
const msg = require('../helpers/msg');

module.exports = {
  isMember: async function (req, res, next) {
    if (await Member.findOne({
      user: ObjectId(res.locals.user.id),
      project: ObjectId(req.params.project),
      status: 'approved'
    })) {
      next()
    } else {
      msg
        .json(res, code401, null, 'Unauthorized')
    }
  },
  isAdmin: async function (req, res, next) {
    if (await Member.findOne({
      user: ObjectId(res.locals.user.id),
      project: ObjectId(req.params.project),
      status: 'approved',
      isAdmin: true
    })) {
      next()
    } else {
      msg
        .json(res, code401, null, 'Unauthorized')
    }
  }
};