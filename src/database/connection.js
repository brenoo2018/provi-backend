const { resolve } = require('path');
const knex = require('knex');

const connection = knex({
  client: 'sqlite3',
  connection: {
    filename: resolve(__dirname, 'database_provi.sqlite'),
  },
  useNullAsDefault: true,
});

module.exports = connection;
