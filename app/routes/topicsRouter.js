const topicsRouter = require('express').Router();

const { getTopics, postTopic } = require('../controllers/topicsController');
const { getArticles, postArticle } = require('../controllers/articlesController');

topicsRouter.route('/')
  .get(getTopics)
  .post(postTopic);


topicsRouter.route('/:topic/articles')
  .get(getArticles)
  .post(postArticle);

module.exports = topicsRouter;
