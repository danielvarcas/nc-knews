const { formatArticles } = require('./utils/formatArticles');
const { formatComments } = require('./utils/formatComments');
const {
  articleData, topicData, userData, commentData,
} = require('../data/index');

exports.seed = function (knex, Promise) {
  const deleteTablesPromises = ['topics', 'users', 'articles', 'comments'].map(tableName => knex(tableName).del());
  return Promise.all(deleteTablesPromises)
    .then(() => knex('topics').insert(topicData).returning('*'))
    .then(([topicRows]) => {
      const userPromise = knex('users').insert(userData).returning('*');
      return Promise.all([topicRows, userPromise]);
    })
    .then(([topicRows, userRows]) => {
      const articlePromise = knex('articles').insert(formatArticles(articleData, userRows)).returning('*');
      return Promise.all([topicRows, userRows, articlePromise]);
    })
    .then(([topicRows, userRows, articleRows]) => {
      const commentPromise = knex('comments').insert(formatComments(commentData, userRows, articleRows)).returning('*');
      return Promise.all([topicRows, userRows, articleRows, commentPromise]);
    })
    .then(([topicRows, userRows, articleRows, commentRows]) => Promise.all([topicRows, userRows, articleRows, commentRows]));
};
