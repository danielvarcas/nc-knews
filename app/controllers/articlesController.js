const connection = require('../../db/connection');

exports.getArticleById = (req, res, next) => connection('articles')
  .where('articles.article_id', req.params.article_id)
  .select(
    'username AS author',
    'users.user_id',
    'articles.title',
    'articles.article_id',
    'articles.votes',
    'articles.created_at',
    'topic',
    'articles.body',
  )
  .leftJoin('users', 'articles.user_id', '=', 'users.user_id')
  .leftJoin('comments', 'articles.article_id', '=', 'comments.article_id')
  .groupBy('articles.article_id', 'users.user_id')
  .count({ comment_count: 'comments.comment_id' })
  .then(([article]) => res.status(200).send(article));

exports.getArticles = (req, res, next) => {
  const { sort_by = 'articles.created_at', sort_ascending = false, p = 1 } = req.query;

  let { limit = 10 } = req.query;
  if (limit < 0) limit = 0;

  const getByTopic = (queryBuilder) => {
    if (req.params.topic) { queryBuilder.where({ topic: req.params.topic }); }
  };

  return connection('articles')
    .modify(getByTopic)
    .select(
      'username AS author',
      'articles.title',
      'articles.article_id',
      'articles.votes',
      'articles.created_at',
      'topic',
    )
    .limit(limit)
    .offset((p - 1) * limit)
    .orderBy(sort_by, sort_ascending ? 'asc' : 'desc')
    .leftJoin('users', 'articles.user_id', '=', 'users.user_id')
    .leftJoin('comments', 'articles.article_id', '=', 'comments.article_id')
    .groupBy('articles.article_id', 'users.user_id')
    .count({ comment_count: 'comments.comment_id' })
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.postArticle = (req, res, next) => {
  const articleToPost = req.body;
  articleToPost.topic = req.params.topic;
  return connection('articles').insert(articleToPost).returning('*')
    .then((postedArticle) => {
      const article = { ...postedArticle[0] };
      res.status(201).send({ article });
    })
    .catch(next);
};

exports.voteArticle = (req, res, next) => {
  const vote = req.body.inc_votes || 0;
  if (Number.isNaN(Number(vote))) { res.status(400).send({ message: 'Error 400 - vote must be a number' }); }
  return connection('articles')
    .where('articles.article_id', req.params.article_id)
    .increment('votes', vote)
    .returning('*')
    .then(([article]) => {
      if (!article) res.status(404).send({ message: 'Error 404 - Article does not exist' });
      else res.status(200).send({ article });
    })
    .catch(next);
};

exports.deleteArticle = (req, res, next) => connection('comments')
  .where('comments.article_id', req.params.article_id)
  .del()
  .then(() => connection('articles')
    .where('articles.article_id', req.params.article_id)
    .del())
  .then((deletions) => {
    if (deletions < 1) {
      res.status(404).send({ message: 'Error 404 - article does not exist' });
    } else {
      res.status(204).send({});
    }
  })
  .catch(next);
