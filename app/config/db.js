var knex = require('knex')({
  client: 'mysql',
  connection: {
    host     : '127.0.0.1',
    user     : 'davidq',
    password : 'miccheck1212',
    database : 'testdb',
    charset  : 'utf8'
  }
});

module.exports = require('bookshelf')(knex);
