const passport = require('passport');
const bcrypt = require('bcrypt');
const paths = require('../config/constants').paths;

// custom user model
var User = require('../models/user');

// index
var index = function(req, res, next) {
   if(!req.isAuthenticated()) {
      res.redirect(paths.signin);
   } else {
      var user = req.user;

      if (user !== undefined) {
         user = user.toJSON();
      }
      res.render('index', {title: 'Home', user: user});
   }
};

// sign in
var signIn = function(req, res, next) {
   if (req.isAuthenticated()) res.redirect(paths.index);
   res.render('signin', {title: 'Sign In'});
};

// sign in
// POST
var signInPost = function(req, res, next) {
   passport.authenticate('local', {
     successRedirect: paths.index,
     failureRedirect: paths.signin },

     function(err, user, info) {
      if (err) {
         return res.render('signin', {title: 'Sign In', errorMessage: err.message});
      }

      if (!user) {
         return res.render('signin', {title: 'Sign In', errorMessage: info.message});
      }
      return req.logIn(user, function(err) {
         if (err) {
            return res.render('signin', {title: 'Sign In', errorMessage: err.message});
         } else {
            return res.redirect(paths.index);
         }
      });
   })(req, res, next);
};

// sign up
// GET
var signUp = function(req, res, next) {
   if (req.isAuthenticated()) res.redirect(paths.index);
   res.render('signup', {title: 'Sign Up'});
};

// sign up
// POST
var signUpPost = function(req, res, next) {
   var user = req.body;
   var usernamePromise = null;
   usernamePromise = new User({username: user.username}).fetch();

   return usernamePromise.then(function(model) {
      if (model) {
         res.render('signup', {title: 'signup', errorMessage: 'username already exists'});
      } else {
         // More validation may go here (e.g. password validation)
         var password = user.password;
         var saltRounds = 6;

         bcrypt.genSalt(saltRounds, function(err, salt) {
           bcrypt.hash(password, salt, function(err, hash) {
             // Store hash in your password DB
             var signUpUser = new User({username: user.username, password: hash});

             signUpUser.save().then(function(model) {
                // sign in the newly registered user
                signInPost(req, res, next);
             });
           });
         });
      }
   });
};

// sign out
var signOut = function(req, res, next) {
   if(!req.isAuthenticated()) {
      notFound404(req, res, next);
   } else {
      req.logout();
      res.redirect(paths.signin);
   }
};

// 404 not found
var notFound404 = function(req, res, next) {
   res.status(404);
   res.render('404', {title: '404 Not Found'});
};

// export functions
/**************************************/
// index
module.exports.index = index;

// sigin in
// GET
module.exports.signIn = signIn;
// POST
module.exports.signInPost = signInPost;

// sign up
// GET
module.exports.signUp = signUp;
// POST
module.exports.signUpPost = signUpPost;

// sign out
module.exports.signOut = signOut;

// 404 not found
module.exports.notFound404 = notFound404;
