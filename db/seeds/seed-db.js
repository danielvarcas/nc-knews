const { formatArticles } = require('./utils/formatArticles');
const { formatComments } = require('./utils/formatComments');
const {
  articleData, topicData, userData, commentData,
} = require('../data/index');

exports.seed = function (knex, Promise) {
  const deleteTablesPromises = ['topics', 'users', 'articles', 'comments'].map(tableName => knex(tableName).del());
  return Promise.all(deleteTablesPromises)
    .then(() => knex('topics').insert(topicData).returning('*'))
    .then((topics) => {
      const userPromise = knex('users').insert(userData).returning('*');
      return Promise.all([topics, userPromise]);
    })
    .then(([topics, users]) => {
      const articlePromise = knex('articles').insert(formatArticles(articleData, users)).returning('*');
      return Promise.all([topics, users, articlePromise]);
    })
    .then(([topics, users, articles]) => {
      const commentPromise = knex('comments').insert(formatComments(commentData, users, articles)).returning('*');
      return Promise.all([topics, users, articles, commentPromise]);
    })
    .then(([topics, users, articles, comments]) => {
      const promises = [topics, users, articles, comments];
      return Promise.all(promises);
    });
};
