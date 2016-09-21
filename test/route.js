const assert = require('assert');
const paths = require('../app/config/constants').paths;
const route = require('../app/route');


describe('route', function() {

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
      route.index(req, res);
    });
  });

});
