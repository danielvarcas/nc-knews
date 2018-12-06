const connection = require('../../db/connection');

exports.getUsers = (req, res, next) => {
  connection('users')
    .then(users => res.status(200).send({ users }));
};
