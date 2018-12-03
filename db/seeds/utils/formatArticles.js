const formatArticles = (articles, usersRows) => {
  const formattedArticles = articles.map((article) => {
    const formattedArticle = { ...article };
    formattedArticle.user_id = usersRows
      .filter(userRow => formattedArticle.username === userRow.username)
      .user_id;
    delete formattedArticle.created_by;
    return formattedArticle;
  });
  return formattedArticles;
};

module.exports = { formatArticles };
