const topicsRouter = require('express').Router();

const { getTopics, postTopic } = require('../controllers/topicsController');
const { getArticles, postArticle } = require('../controllers/articlesController');
const { handle405 } = require('../errors/errorHandling');

topicsRouter.route('/')
  .get(getTopics)
  .post(postTopic)
  .all(handle405);


topicsRouter.route('/:topic/articles')
  .get(getArticles)
  .post(postArticle)
  .all(handle405);

module.exports = topicsRouter;
