const Project = require('../../../models/Project');
const Member = require('../../../models/Member');

const {code200, code201, code500} = require('../../../helpers/httpRequestCode');
const msg = require('../../../helpers/msg');
const ObjectId = require('mongoose').Types.ObjectId;

class MembersController {
  static kick({params}, res) {
    Member
      .findOne({
        _id: ObjectId(params.member),
        project: params.project,
      })
      .then((member) => {
        if (!member) {
          throw Member().invalidate('member', 'Has already kick from member', '')
        }
        return member.remove()
      })
      .then((prop) => {
        msg
          .json(res, code200, prop._id)
      })
      .catch((err) => {
        msg
          .json(res, code500, null, err.message, err)
      })
  }

  static block({params}, res) {
    Member
      .findOne({
        _id: ObjectId(params.member),
        project: params.project,
      })
      .then((member) => {
        if (!member) {
          throw Member().invalidate('member', 'Not found', '')
        }
        if (member.status === 'blocked') {
          throw Member().invalidate('status', 'Has already blocked', '')
        }
        member.status = 'blocked';
        return member.save()
      })
      .then((prop) => {
        msg
          .json(res, code200, prop._id)
      })
      .catch((err) => {
        msg
          .json(res, code500, null, err.message, err)
      })
  }

  static approve({params}, res) {
    Member
      .findOne({
        _id: ObjectId(params.member),
        project: params.project,
      })
      .then((member) => {
        if (!member) {
          throw Member().invalidate('member', 'Not found', '')
        }
        if (member.status === 'approved') {
          throw Member().invalidate('status', 'Has already approved', '')
        }
        member.status = 'approved';
        return member.save()
      })
      .then((prop) => {
        msg
          .json(res, code200, prop._id)
      })
      .catch((err) => {
        msg
          .json(res, code500, null, err.message, err)
      })
  }

  static invite({params, body}, res) {
    (new Member({
      user: body.user,
      project: params.project,
      changedBy: res.locals.user.id,
      status: 'invited'
    }))
      .save((err, resSave) => {
        if (err) {
          msg
            .json(res, code500, body, err.message, err)
        } else {
          msg
            .json(res, code201, resSave._id)
        }
      })
  }

  static join({params}, res) {
    Member
      .findOne({
        _id: ObjectId(params.member),
        project: params.project,
      })
      .then((member) => {
        if (!member) {
          throw Member().invalidate('member', 'Expired', '')
        }
        if (member.status === 'approved') {
          throw Member().invalidate('status', 'Has already joined', '')
        }
        member.status = 'approved';
        return member.save()
      })
      .then((prop) => {
        msg
          .json(res, code200, prop._id)
      })
      .catch((err) => {
        msg
          .json(res, code500, null, err.message, err)
      })

  }

  static list({params}, res) {
    Project
      .findOneWithMembers({_id: ObjectId(params.project)})
      .then((props) => {
        msg
          .json(res, code200, props)
      })
      .catch((err) => {
        msg
          .json(res, code500, null, err.message, err)
      })
  }
}

module.exports = MembersController;