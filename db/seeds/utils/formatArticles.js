const { formatDate } = require('./formatDate');

const formatArticles = (articleData, usersRows) => {
  const articles = articleData.map((articleDatum) => {
    const article = { ...articleDatum };

    article.user_id = usersRows
      .find(userRow => userRow.username === article.created_by)
      .user_id;

    article.created_at = formatDate(article.created_at);

    delete article.created_by;
    return article;
  });
  return articles;
};

module.exports = { formatArticles };
