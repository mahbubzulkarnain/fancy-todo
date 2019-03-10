function joinSubQuery(collectionName, foreignField, alias = '', customJoinField = [], additional = []) {
  let objForeignField = {};
  if (foreignField.constructor === String) {
    objForeignField[foreignField === '_id' ? 'id' : foreignField] = `$${foreignField}`;
  } else {
    objForeignField = foreignField
  }
  const joinField = (
    customJoinField.length < 1 ?
      [{'$eq': ['$_id', `$$${foreignField}`]}] :
      customJoinField
  );
  const pipeline = [
    {
      $match: {
        $expr: {
          $and: joinField
        }
      }
    }
  ].concat(additional);
  return {
    $lookup: {
      "from": collectionName,
      "let": objForeignField,
      pipeline: pipeline,
      as: alias ? alias : collectionName
    }
  }
}

module.exports = {
  joinSubQuery,
  project: {
    member: function (keyword) {
      let Member = (require('../models/Member')).collection.name;
      let User = (require('../models/User')).collection.name;
      return [
        joinSubQuery(Member, '_id', keyword, [{$eq: ['$project', '$$id']}], [
          {
            $match: {status: keyword}
          },
          {
            $project: {
              _id: true,
              status: true,
              isAdmin: true,
              user: true,
              changedBy: true
            }
          },
          joinSubQuery(User, 'user', 'user', [{$eq: ['$_id', '$$user']}], [
            {
              $project: {
                _id: true,
                name: true
              }
            }
          ]),
          {$unwind: '$user'},
          joinSubQuery(User, 'changedBy', 'changedBy', [{$eq: ['$_id', '$$changedBy']}], [
            {
              $project: {
                _id: true,
                name: true
              }
            }
          ]),
          {$unwind: {path: '$changedBy', preserveNullAndEmptyArrays: true}}
        ]),
      ]
    },
    author: [
      joinSubQuery((require('../models/User')).collection.name, 'author', 'author', [{$eq: ['$_id', '$$author']}], [
        {
          $project: {
            _id: true,
            name: true
          }
        }
      ]),
      {$unwind: '$author'},
    ]
  }
};