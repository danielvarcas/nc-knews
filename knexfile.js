const { DB_URL } = process.env;
const { username, password } = require('./config');

module.exports = {
  development: {
    client: 'pg',
    connection: {
      user: username,
      password,
      database: 'nc_knews',
    },
    migrations: {
      directory: './db/migrations',
    },
    seeds: {
      directory: './db/seeds',
    },
  },
  test: {
    client: 'pg',
    connection: {
      user: username,
      password,
      database: 'nc_knews_test',
    },
    migrations: {
      directory: './db/migrations',
    },
    seeds: {
      directory: './db/seeds',
    },
  },
  production: {
    client: 'pg',
    connection: `${DB_URL}?ssl=true`,
    migrations: {
      directory: './db/migrations',
    },
    seeds: {
      directory: './db/seeds',
    },
  },
};
