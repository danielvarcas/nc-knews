const articlesRouter = require('express').Router();
const { getArticles, updateVotes, deleteArticle } = require('../controllers/articlesController');

articlesRouter.route('/')
  .get(getArticles);

articlesRouter.route('/:article_id')
  .get(getArticles)
  .patch(updateVotes)
  .delete(deleteArticle);

module.exports = articlesRouter;
