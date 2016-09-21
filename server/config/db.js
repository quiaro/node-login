var knex = require('knex')({
  client: 'mysql',
  // connection: {
  //   host     : '127.0.0.1',
  //   user     : 'davidq',
  //   password : 'miccheck1212',
  //   database : 'testdb',
  //   charset  : 'utf8'
  // }

  // Remote connection
  connection: {
    host     : 'secure164.inmotionhosting.com',
    user     : 'procel5_e924',
    password : 'miccheck1212',
    database : 'procel5_e924',
    charset  : 'utf8'
  }

});

module.exports = require('bookshelf')(knex);
