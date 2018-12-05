
exports.up = function (knex, Promise) {
  return knex.schema.createTable('articles', (table) => {
    table.increments('article_id').primary();
    table.string('title');
    table.text('body');
    table.integer('votes').defaultTo(0);
    table.string('topic').references('topics.slug');
    table.integer('user_id').references('users.user_id');
    table.string('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('articles');
};
