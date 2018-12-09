const connection = require('../../db/connection');

exports.getComments = (req, res, next) => {
  const {
    limit = 10,
    sort_by = 'comments.created_at',
    sort_ascending = false,
    p = 1,
  } = req.query;

  const getById = (queryBuilder) => {
    if (req.params.article_id) {
      queryBuilder.where({ article_id: req.params.article_id });
    }
  };
  return connection('comments')
    .modify(getById)
    .select(
      'comment_id',
      'votes',
      'created_at',
      'username AS author',
      'body',
    )
    .limit(limit)
    .offset(p - 1)
    .orderBy(sort_by, sort_ascending ? 'asc' : 'desc')
    .leftJoin('users', 'users.user_id', '=', 'comments.user_id')
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postComment = (req, res, next) => connection('comments').insert({
  ...req.body,
  article_id: req.params.article_id,
})
  .returning('*')
  .then(([comment]) => {
    res.status(201).send({ comment });
  })
  .catch(next);

exports.voteComment = (req, res, next) => {
  const vote = req.body.inc_votes;
  if (Number.isNaN(Number(vote))) { res.status(400).send({ message: 'Error 400 - vote must be a number' }); }
  return connection('comments')
    .where('comment_id', req.params.comment_id)
    .increment('votes', req.body.inc_votes)
    .returning('*')
    .then(([comment]) => {
      res.status(200).send({ comment });
    })
    .catch(next);
};

exports.deleteComment = (req, res, next) => connection('comments')
  .where('comments.article_id', req.params.article_id)
  .andWhere('comments.comment_id', req.params.comment_id)
  .del()
  .then((deletions) => {
    if (deletions < 1) {
      res.status(404).send({ message: 'Error 404 - comment does not exist' });
    } else {
      res.status(204).send({});
    }
  });
