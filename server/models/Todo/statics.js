const query = require('../../helpers/query');

module.exports = {
  findOneWithItem: function (condition) {
    return new Promise((resolve, reject) => {
      let User = (require('../User')).collection.name;
      this.aggregate([
          {
            $match: condition
          },
          query.joinSubQuery((require('../Project')).collection.name, 'project', 'project', [{$eq: ['$_id', '$$project']}]),
          {$unwind: {path: '$project', preserveNullAndEmptyArrays: true}},
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
          ]),
          {
            $project: {
              _id: true,
              title: true,
              description: true,
              type: true,
              author: '$user',
              project: true,
              items: `$items`
            }
          }
        ]
      )
        .then((props) => {
          resolve(props[0])
        })
        .catch((err) => {
          reject(err)
        })
    });
  }
};