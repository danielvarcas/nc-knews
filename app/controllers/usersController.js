const connection = require('../../db/connection');

exports.getUsers = (req, res, next) => connection('users')
  .then(users => res.status(200).send({ users }))
  .catch(next);

exports.getUserByUsername = (req, res, next) => connection('users')
  .where('username', req.params.username)
  .then((users) => {
    const user = users[0];
    res.status(200).send(user);
  })
  .catch(next);
