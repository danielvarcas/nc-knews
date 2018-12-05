const topicsRouter = require('express').Router();

const { getTopics, postTopic } = require('../controllers/topicsController');
const { getArticles } = require('../controllers/articlesController');

topicsRouter.route('/')
  .get(getTopics)
  .post(postTopic);

topicsRouter.route('/:topic/articles')
  .get(getArticles);

module.exports = topicsRouter;
