const connection = require('../../db/connection');

exports.getArticles = (req, res, next) => {
  const { limit = 10 } = req.query;
  connection.select('username AS author', 'articles.title', 'articles.article_id', 'articles.votes', 'articles.created_at', 'topic').from('articles')
    .limit(limit)
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
