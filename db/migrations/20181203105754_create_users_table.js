
exports.up = function (knex, Promise) {
  return knex.schema.createTable('users', (table) => {
    table.increments('user_id').primary();
    table.string('username').unique();
    table.string('avatar_url');
    table.string('name');
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('users');
};
