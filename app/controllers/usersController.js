const connection = require('../../db/connection');

exports.getUsers = (req, res, next) => {
  const getById = (queryBuilder) => {
    if (req.params.username) {
      queryBuilder.where('username', req.params.username);
    }
  };

  return connection('users')
    .modify(getById)
    .then(users => res.status(200).send({ users }))
    .catch(next);
};
