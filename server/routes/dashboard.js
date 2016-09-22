var dashboard = function(req, res, next) {
  console.log('Rendering dashboard ...');
  var user = req.user;

  if (user !== undefined) {
     user = user.toJSON();
  }
  
  res.render('dashboard', {title: 'Dashboard', user: user});
};

module.exports = dashboard;
