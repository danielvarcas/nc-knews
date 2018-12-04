const formatComments = (comments, articleRows) => {
  const formattedComments = comments.map((comment) => {
    const formattedComment = { ...comment };

    formattedComment.user_id = articleRows
      .filter(() => formattedComment.created_by === articleRows.title)
      .topic_id;

    delete formattedComment.belongs_to;
    return formattedComment;
  });
  return formattedComments;
};

module.exports = { formatComments };
