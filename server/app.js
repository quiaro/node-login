const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const ejs = require('ejs');
const path = require('path');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const paths = require('./config/constants').paths;

/*
 * App routes
 */
var routes = require('./routes/index');
var dashboard = require('./routes/dashboard');

// App user model
var User = require('./models/user');

var app = express();

passport.use(new LocalStrategy(function(username, password, done) {
   new User({username: username}).fetch().then(function(data) {
      var user = data;
      if (user === null) {
         return done(null, false, {message: 'Invalid username or password'});
      } else {
         user = data.toJSON();
         return bcrypt.compare(password, user.password, function(err, res) {
           if (!res) {
             return done(null, false, {message: 'Invalid username or password'});
           } else {
             return done(null, user);
           }
         });
      }
   }, function(err) {
     // Return error if there was a problem with the database connection
     return done(err);
   });
}));

passport.use(new FacebookStrategy({
    clientID: 305911516438444,
    clientSecret: "1ac7254bea95ca83f6148f7579d3d818",
    callbackURL: "http://localhost:3000/auth/facebook/callback",
    enableProof: true
  },
  function(accessToken, refreshToken, profile, done) {
    new User({username: 'tiger'}).fetch().then(function(data) {
      var user = data.toJSON();
      done(null, user);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.username);
});

passport.deserializeUser(function(username, done) {
   new User({username: username}).fetch().then(function(user) {
      done(null, user);
   });
});

// Application settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Application middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(session({
  saveUninitialized: false,
  resave: false,
  secret: 'En algun lugar de la mancha'
}));
app.use(passport.initialize());
app.use(passport.session());

// Define routes
app.get(paths.index, routes.index);

app.get(paths.facebookAuth, passport.authenticate('facebook'));
app.get(paths.facebookCallback, passport.authenticate('facebook', {
    successRedirect: paths.dashboard,
    failureRedirect: paths.signin
  }));

app.get(paths.dashboard, dashboard);

app.get(paths.signin, routes.signIn);
app.post(paths.signin, routes.signInPost);

app.get(paths.signup, routes.signUp);
app.post(paths.signup, routes.signUpPost);

app.get(paths.signout, routes.signOut);

// 404 not found
app.use(routes.notFound404);

var server = app.listen(app.get('port'), function(err) {
   if(err) throw err;

   var message = 'Server is running @ http://localhost:' + server.address().port;
   console.log(message);
});
