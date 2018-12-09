const connection = require('../../db/connection');

exports.getArticles = (req, res, next) => {
  const { sort_by = 'articles.created_at', sort_ascending = false, p = 1 } = req.query;

  let { limit = 10 } = req.query;
  if (limit < 0) limit = 0;

  const getByTopic = (queryBuilder) => {
    if (req.params.topic) { queryBuilder.where({ topic: req.params.topic }); }
  };

  const getByArticleId = (queryBuilder) => {
    if (req.params.article_id) {
      queryBuilder
        .where('articles.article_id', req.params.article_id)
        .select('title', 'articles.body');
    }
  };

  return connection('articles')
    .modify(getByTopic)
    .modify(getByArticleId)
    .select(
      'username AS author',
      'articles.title',
      'articles.article_id',
      'articles.votes',
      'articles.created_at',
      'topic',
    )
    .limit(limit)
    .offset(p - 1)
    .orderBy(sort_by, sort_ascending ? 'asc' : 'desc')
    .leftJoin('users', 'articles.user_id', '=', 'users.user_id')
    .leftJoin('comments', 'articles.article_id', '=', 'comments.article_id')
    .groupBy('articles.article_id', 'users.user_id')
    .count({ comment_count: 'comments.comment_id' })
    .then((articles) => {
      if (articles.length !== 1) res.status(200).send({ articles });
      else {
        const [article] = articles;
        res.status(200).send({ article });
      }
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

exports.voteArticle = (req, res, next) => connection('articles')
  .where('articles.article_id', req.params.article_id)
  .increment('votes', req.body.inc_votes)
  .returning('*')
  .then(([article]) => {
    if (article) res.status(200).send({ article });
    else {
      res.status(404).send({ message: 'Error 404 - Article does not exist' });
    }
  })
  .catch(next);

exports.deleteArticle = (req, res, next) => connection('comments')
  .where('comments.article_id', req.params.article_id)
  .del()
  .then(() => connection('articles')
    .where('articles.article_id', req.params.article_id)
    .del())
  .then(() => {
    res.status(204).send({});
  })
  .catch(next);
