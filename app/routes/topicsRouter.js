const topicsRouter = require('express').Router();

const { getTopics, postTopic } = require('../controllers/topicsController.js');

topicsRouter.route('/')
  .get(getTopics)
  .post(postTopic);

module.exports = topicsRouter;
