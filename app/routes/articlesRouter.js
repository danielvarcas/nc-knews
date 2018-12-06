const articlesRouter = require('express').Router();
const { getArticles, getArticleById } = require('../controllers/articlesController');

articlesRouter.route('/')
  .get(getArticles);

articlesRouter.route('/:article_id')
  .get(getArticleById);

module.exports = articlesRouter;
