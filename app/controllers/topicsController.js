const connection = require('../../db/connection');

exports.getTopics = (req, res, next) => connection('topics')
  .then(topics => res.status(200).send({ topics }))
  .catch(next);

exports.postTopic = (req, res, next) => connection('topics').insert(req.body).returning('*')
  .then(newTopic => res.status(201).send({ newTopic }))
  .catch(next);
