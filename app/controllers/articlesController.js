const connection = require('../../db/connection');

exports.getArticles = (req, res, next) => {
  const {
    limit = 10, sort_criteria = 'articles.created_at', sort_ascending = false, p = 1,
  } = req.query;
  connection.select('username AS author', 'articles.title', 'articles.article_id', 'articles.votes', 'articles.created_at', 'topic').from('articles')
    .limit(limit)
    .offset(p - 1)
    .orderBy(sort_criteria, sort_ascending ? 'asc' : 'desc')
    .leftJoin('users', 'articles.user_id', '=', 'users.user_id')
    .leftJoin('comments', 'articles.article_id', '=', 'comments.article_id')
    .where({ topic: req.params.topic })
    .groupBy('articles.article_id', 'users.user_id')
    .count({ comment_count: 'comments.comment_id' })
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};
