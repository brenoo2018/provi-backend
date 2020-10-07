const { resolve } = require('path');

module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: resolve(__dirname, 'src', 'database', 'database_provi.sqlite'),
    },
    migrations: {
      directory: resolve(__dirname, 'src', 'database', 'migrations'),
    },
    useNullAsDefault: true,
  },
  test: {
    client: 'sqlite3',
    connection: {
      filename: resolve(
        __dirname,
        'src',
        'database',
        'testdatabase_provi.sqlite'
      ),
    },
    migrations: {
      directory: resolve(__dirname, 'src', 'database', 'migrations'),
    },
    useNullAsDefault: true,
  },
};
