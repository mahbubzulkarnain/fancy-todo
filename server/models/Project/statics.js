const query = require('../../helpers/query');

module.exports = {
  findProject: function (condition = {}, conditionMember = null) {
    return new Promise((resolve, reject) => {
      let Member = (require('../Member')).collection.name;
      console.log(conditionMember);
      this.aggregate([
        {
          $match: condition
        },
        ...(conditionMember ? [
            query.joinSubQuery(Member, '_id', 'member', [{$eq: ['$project', '$$id']}], [
              {
                $match: conditionMember
              }
            ]),
            {$unwind: {path: '$member', preserveNullAndEmptyArrays: true, includeArrayIndex: "arrayIndex"}}
          ] :
          []),
        {
          $project: {
            _id: true,
            isPublic: true,
            title: true,
            description: true,
            member: {
              $cond: {
                if: {
                  $eq: ['$arrayIndex', null]
                },
                then: false,
                else: true
              }
            }
          }
        },
        {
          $match: {
            $or: [
              {member: true},
              {isPublic: true},
            ]
          }
        },
        {
          $project: {
            _id: true,
            isPublic: true,
            title: true,
            description: true,
          }
        },
      ])
        .then((props) => {
          resolve(props)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  findOneWithMembersAndTodos: function (condition = {}) {
    return new Promise((resolve, reject) => {
      this.aggregate([
        {
          $match: condition
        },
        query.joinSubQuery((require('../Todo')).collection.name, '_id', 'items', [{$eq: ['$project', '$$id']}], [
          ...query.project.author,
          {
            $project: {
              _id: true,
              title: true,
              description: true,
              type: true,
              author: true
            }
          }
        ]),
        ...query.project.member('requested'),
        ...query.project.member('approved'),
        ...query.project.member('invited'),
        ...query.project.member('blocked'),
      ])
    })
  },
  findOneWithMembers: function (condition = {}) {
    return new Promise((resolve, reject) => {
      this.aggregate([
        {
          $match: condition
        },
        ...query.project.member('requested'),
        ...query.project.member('approved'),
        ...query.project.member('invited'),
        ...query.project.member('blocked'),
      ])
        .then((props) => {
          console.log(props);
          resolve(props[0])
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  findOneWithTodos: function (condition = {}) {
    return new Promise((resolve, reject) => {
      this.aggregate([
        {
          $match: condition
        },
        query.joinSubQuery((require('../Todo')).collection.name, '_id', 'todos', [{$eq: ['$project', '$$id']}], [
          ...query.project.author,
          {
            $project: {
              _id: true,
              title: true,
              description: true,
              type: true,
              author: true
            }
          }
        ]),
      ])
        .then((props) => {
          resolve(props[0])
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  findOneWithTodoAndItems: function (condition = {}) {
    return new Promise((resolve, reject) => {
      let User = (require('../User')).collection.name;
      this.aggregate([
        query.joinSubQuery((require('../Todo')).collection.name, '_id', 'todo', [{$eq: ['$project', '$$id']}], [
          {
            $match: condition
          },
          ...query.project.author,
          {
            $project: {
              _id: true,
              title: true,
              description: true,
              type: true,
              author: true
            }
          },
          query.joinSubQuery((require('../TodoItem')).collection.name, '_id', 'items', [{$eq: ['$todo', '$$id']}], [
            {
              $sort: {
                'dueDate': -1
              }
            },
            query.joinSubQuery(User, 'assignee', 'assignee', [{$eq: ['$_id', '$$assignee']}], [
              {
                $project: {
                  _id: true,
                  name: true
                }
              }
            ]),
            {$unwind: {path: '$assignee', preserveNullAndEmptyArrays: true}},
            query.joinSubQuery(User, 'changedBy', 'changedBy', [{$eq: ['$_id', '$$changedBy']}], [
              {
                $project: {
                  _id: true,
                  name: true
                }
              }
            ]),
            {$unwind: {path: '$changedBy', preserveNullAndEmptyArrays: true}},
            {
              $project: {
                _id: true,
                title: true,
                status: true,
                assignee: true,
                changedBy: true,
                dueDate: true
              }
            }
          ])
        ]),
        {$unwind: '$todo'}
      ])
        .then((props) => {
          resolve(props[0])
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
};