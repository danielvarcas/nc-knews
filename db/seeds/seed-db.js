const { formatArticles } = require('./utils/formatArticles');
const {
  articleData, topicData, userData, commentData,
} = require('../data/index');

exports.seed = function (knex, Promise) {
  const deleteTablesPromises = ['topics', 'users', 'articles', 'comments'].map(tableName => knex(tableName).del());
  return Promise.all(deleteTablesPromises)
    .then(() => {
      console.log('Deleted all table data...');
      return knex('topics').insert(topicData).returning('*');
    })
    .then((topicRows) => {
      console.log('Inserted topic data...');
      console.log(topicRows);
      return knex('users').insert(userData).returning('*');
    })
    .then((userRows) => {
      console.log('Inserted user data...');
      console.log(userRows);
      return knex('articles').insert(formatArticles(articleData, userRows)).returning('*');
    })
    .then(() => {
      console.log('Inserted articles data...');
      knex('comments').insert(commentData).returning('*');
      console.log('Inserted comment data...');
    });
};
