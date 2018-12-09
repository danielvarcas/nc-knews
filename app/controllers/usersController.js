const connection = require('../../db/connection');

exports.getUsers = (req, res, next) => {
  const getById = (queryBuilder) => {
    if (req.params.user_id) {
      queryBuilder.where('user_id', req.params.user_id);
    }
  };

  return connection('users')
    .modify(getById)
    .then(users => res.status(200).send({ users }))
    .catch(next);
};
