const formatArticles = (articleData, usersRows) => {
  const articles = articleData.map((articleDatum) => {
    const article = { ...articleDatum };

    article.user_id = usersRows.find(userRow => userRow.username === article.created_by).user_id;

    delete article.created_by;

    const timestamp = article.created_at;
    const date = new Date(timestamp);
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();
    const formattedDate = `${year}-${month}-${day}`;
    article.created_at = formattedDate;

    return article;
  });
  return articles;
};

module.exports = { formatArticles };
