const articlesRouter = require('express').Router();
const { getArticles } = require('../controllers/articlesController');

articlesRouter.route('/')
  .get(getArticles);

articlesRouter.route('/:article_id')
  .get(getArticles);

module.exports = articlesRouter;
