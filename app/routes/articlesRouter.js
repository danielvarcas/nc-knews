const articlesRouter = require('express').Router();
const { getArticles, updateVotes, deleteArticle } = require('../controllers/articlesController');
const { getComments } = require('../controllers/commentsController');

articlesRouter.route('/')
  .get(getArticles);

articlesRouter.route('/:article_id')
  .get(getArticles)
  .patch(updateVotes)
  .delete(deleteArticle);

articlesRouter.route('/:article_id/comments')
  .get(getComments);

module.exports = articlesRouter;
