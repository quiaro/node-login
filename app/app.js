// vendor libraries
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var bcrypt = require('bcrypt');
var ejs = require('ejs');
var path = require('path');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// App routes
var route = require('./route');

// App user model
var Model = require('./models/user');

var app = express();

passport.use(new LocalStrategy(function(username, password, done) {
   new Model.User({username: username}).fetch().then(function(data) {
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
   });
}));

// TODO: What is this?
passport.serializeUser(function(user, done) {
  done(null, user.username);
});

// TODO: What is this?
passport.deserializeUser(function(username, done) {
   new Model.User({username: username}).fetch().then(function(user) {
      done(null, user);
   });
});

// Application settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Application middlewares
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
// GET
app.get('/', route.index);

// signin
// GET
app.get('/signin', route.signIn);
// POST
app.post('/signin', route.signInPost);

// signup
// GET
app.get('/signup', route.signUp);
// POST
app.post('/signup', route.signUpPost);

// logout
// GET
app.get('/signout', route.signOut);

// 404 not found
app.use(route.notFound404);

var server = app.listen(app.get('port'), function(err) {
   if(err) throw err;

   var message = 'Server is running @ http://localhost:' + server.address().port;
   console.log(message);
});
