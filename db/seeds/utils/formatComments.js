const { formatDate } = require('./formatDate');

const formatComments = (commentsData, userRows, articleRows) => {
  const comments = commentsData.map((commentsDatum) => {
    const comment = { ...commentsDatum };

    comment.user_id = userRows
      .find(userRow => userRow.username === comment.created_by)
      .user_id;

    comment.article_id = articleRows
      .find(articleRow => articleRow.title === comment.belongs_to)
      .article_id;

    comment.created_at = formatDate(comment.created_at);

    delete comment.created_by;
    delete comment.belongs_to;
    return comment;
  });
  return comments;
};

module.exports = { formatComments };
