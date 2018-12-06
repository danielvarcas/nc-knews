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
