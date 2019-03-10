const Project = require('../../../models/Project');
const Member = require('../../../models/Member');
const {code200, code201, code500} = require('../../../helpers/httpRequestCode');
const msg = require('../../../helpers/msg');
const ObjectId = require('mongoose').Types.ObjectId;

class ProjectController {
  static create({body}, res) {
    delete body['_id'];
    (new Project(Object.assign(body)))
      .save(async (err, resSave) => {
        if (err) {
          msg
            .json(res, code500, body, err.message, err)
        } else {
          try {
            await (new Member({
              user: res.locals.user.id,
              project: resSave._id,
              status: 'approved',
              isAdmin: true
            })).save();
            msg
              .json(res, code201, resSave)
          } catch (e) {
            msg
              .json(res, code500, body, e.message, e)
          }
        }
      })
  }

  static list(req, res) {
    Project
      .findProject({}, {user: ObjectId(res.locals.user.id)})
      .then((props) => {
        msg
          .json(res, code200, props)
      })
      .catch((err) => {
        msg
          .json(res, code500, null, err.message, err)
      })
  }

  static read({params}, res) {
    Project
      .findOneWithTodos({_id: ObjectId(params.project)})
      .then((prop) => {
        msg
          .json(res, code200, prop)
      })
      .catch((err) => {
        msg
          .json(res, code500, null, err.message, err)
      })
  }

  static update({params, body}, res) {
    Project
      .findById(params.project)
      .then((project) => {
        if (!project) {
          throw Project()
            .invalidate('project', 'Not found', '')
        }
        delete body['_id'];
        delete body['author'];
        Object.assign(project, body);
        return project.save()
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
    Project
      .findById(params.project)
      .then((project) => {
        if (!project) {
          throw Project()
            .invalidate('project', 'Not found', '')
        }
        return project.remove()
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

module.exports = ProjectController;