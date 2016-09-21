var bookshelf = require('../config/db');

var User = bookshelf.Model.extend({
   tableName: 'tblUsers',
   idAttribute: 'userId',
});

module.exports = {
   User: User
};
