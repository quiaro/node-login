const assert = require('assert');
const paths = require('../../../server/config/constants').paths;
const routes = require('../../../server/routes/index');


describe('index routes', function() {

  describe('get index page', function() {
    it('should redirect user to signin page if the user is not authenticated', function() {
      var req = {
        isAuthenticated() {
          return false;
        }
      }
      var res = {
        redirect(path) {
          assert.equal(path, paths.signin, 'User redirected to the correct path');
        }
      }
      routes.index(req, res);
    });
  });

});
