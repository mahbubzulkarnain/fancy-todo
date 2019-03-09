class Controller {
  static list(req, res, next) {
    res.json('todo')
  }

  static create(req, res, next) {
    res.json('create')
  }

  static read({params}, res, next) {
    res.json('read')
  }

  static update({params}, res, next) {
    res.json('update')
  }

  static delete({params}, res, next) {
    res.json('delete')
  }
}

module.exports = Controller;