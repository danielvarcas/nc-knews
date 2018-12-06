const articlesRouter = require('express').Router();
const { getArticles, updateVotes } = require('../controllers/articlesController');

articlesRouter.route('/')
  .get(getArticles);

articlesRouter.route('/:article_id')
  .get(getArticles)
  .patch(updateVotes);

module.exports = articlesRouter;
