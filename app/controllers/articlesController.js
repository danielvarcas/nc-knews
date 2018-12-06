const connection = require('../../db/connection');

exports.getArticles = (req, res, next) => {
  const {
    limit = 10, sort_criteria = 'articles.created_at', sort_ascending = false, p = 1,
  } = req.query;

  const getByTopic = (queryBuilder) => {
    if (req.params.topic) { queryBuilder.where({ topic: req.params.topic }); }
  };

  connection.select(
    'username AS author',
    'articles.title',
    'articles.article_id',
    'articles.votes',
    'articles.created_at',
    'topic',
  )
    .from('articles')
    .limit(limit)
    .offset(p - 1)
    .orderBy(sort_criteria, sort_ascending ? 'asc' : 'desc')
    .leftJoin('users', 'articles.user_id', '=', 'users.user_id')
    .leftJoin('comments', 'articles.article_id', '=', 'comments.article_id')
    .modify(getByTopic)
    .groupBy('articles.article_id', 'users.user_id')
    .count({ comment_count: 'comments.comment_id' })
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => connection('articles')
  .where('articles.article_id', req.params.article_id)
  .select(
    'articles.article_id',
    'username AS author',
    'title',
    'articles.votes',
    'articles.body',
    'articles.created_at',
    'topic',
  )
  .leftJoin('users', 'articles.user_id', '=', 'users.user_id')
  .leftJoin('comments', 'articles.article_id', '=', 'comments.article_id')
  .groupBy('articles.article_id', 'comments.article_id', 'users.user_id')
  .count({ comment_count: 'comments.comment_id' })
  .then((article) => {
    res.status(200).send({ article });
  })
  .catch(next);

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
