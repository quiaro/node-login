var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var bcrypt = require('bcrypt');
var ejs = require('ejs');
var path = require('path');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var paths = require('./config/constants').paths;

/*
 * App routes
 */
var routes = require('./routes/index');

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

// TODO: What is this?
passport.serializeUser(function(user, done) {
  done(null, user.username);
});

// TODO: What is this?
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
