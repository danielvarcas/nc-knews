const connection = require('../../db/connection');

exports.getTopics = (req, res, next) => connection.select('*').from('topics')
  .then(topics => res.status(200).send({ topics }))
  .catch(next);
