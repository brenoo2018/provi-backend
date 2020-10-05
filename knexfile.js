const { resolve } = require('path');

module.exports = {
  client: 'sqlite3',
  connection: {
    filename: resolve(__dirname, 'src', 'database', 'database_provi.sqlite'),
  },
  migrations: {
    directory: resolve(__dirname, 'src', 'database', 'migrations'),
  },
  useNullAsDefault: true,
};
