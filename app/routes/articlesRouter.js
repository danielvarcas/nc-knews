const articlesRouter = require('express').Router();
const { getArticles, updateVotes, deleteArticle } = require('../controllers/articlesController');
const {
  getComments, postComment, voteComment, deleteComment,
} = require('../controllers/commentsController');
const { handle405 } = require('../errors/errorHandling');

articlesRouter.route('/')
  .get(getArticles)
  .all(handle405);

articlesRouter.route('/:article_id')
  .get(getArticles)
  .patch(updateVotes)
  .delete(deleteArticle)
  .all(handle405);

articlesRouter.route('/:article_id/comments')
  .get(getComments)
  .post(postComment)
  .all(handle405);

articlesRouter.route('/:article_id/comments/:comment_id')
  .patch(voteComment)
  .delete(deleteComment)
  .all(handle405);


module.exports = articlesRouter;
