const { formatArticles } = require('./utils/formatArticles');
const { formatComments } = require('./utils/formatComments');
const {
  articleData, topicData, userData, commentData,
} = require('../data/index');

exports.seed = function (knex, Promise) {
  console.log('=== BEGIN SEED ===');
  console.log('Deleting all table data...');
  const deleteTablesPromises = ['topics', 'users', 'articles', 'comments'].map(tableName => knex(tableName).del());
  return Promise.all(deleteTablesPromises)
    .then(() => {
      console.log('Deleted all table data.');
      console.log('Inserting topic data...');

      return knex('topics').insert(topicData).returning('*');
    })
    .then(([topicRows]) => {
      // console.log(topicRows[0]);
      console.log('Topic data insertion complete!');
      console.log('Inserting user data...');

      const userPromise = knex('users').insert(userData).returning('*');
      return Promise.all([topicRows, userPromise]);
    })
    .then(([topicRows, userRows]) => {
      // console.log(userRows[0]);
      console.log('User data insertion complete!');
      console.log('Inserting article data...');

      const articlePromise = knex('articles').insert(formatArticles(articleData, userRows)).returning('*');
      return Promise.all([topicRows, userRows, articlePromise]);
    })
    .then(([topicRows, userRows, articleRows]) => {
      // console.log(articleRows[0]);
      console.log('Article data insertion complete!');
      console.log('Inserting comment data...');

      const commentPromise = knex('comments').insert(formatComments(commentData, userRows, articleRows)).returning('*');
      return Promise.all([topicRows, userRows, articleRows, commentPromise]);
    })
    .then(([topicRows, userRows, articleRows, commentRows]) => {
      // console.log(commentRows[0]);
      console.log('Comment data insertion complete!');
      console.log('=== SEED COMPLETE ===');
      return Promise.all([topicRows, userRows, articleRows, commentRows]);
    });
};
