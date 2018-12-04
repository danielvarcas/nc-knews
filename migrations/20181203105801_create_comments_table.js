
exports.up = function (knex, Promise) {
  return knex.schema.createTable('comments', (table) => {
    table.increments('comment_id').primary();
    table.integer('user_id').references('users.user_id');
    table.integer('article_id').references('articles.article_id');
    table.integer('votes').defaultTo(0);
    table.date('created_at').defaultTo(knex.fn.now(6));
    table.text('body');
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('comments');
};
