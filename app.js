var passport = require('passport');
var oauth2 = require('passport-oauth2');
var express = require('express');
var http = require('https');

var app = express();

// Session setup

var session = require('cookie-session');
var keys = process.env.SECURE_KEYS.split(',');

app.use(session({
  name: 'merus-auth-example:sess',
  keys: keys
}));

// User serialization
var users = {};

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  done(null, users[id]);
});

// OAuth2 setup

var clientId      = process.env.MERUS_CLIENT_ID
var clientSecret  = process.env.MERUS_SECRET_KEY
var merusBaseUrl  = process.env.MERUS_BASE_URL

var callbackUrl = 'http://localhost:5000/auth/merus/callback'

var strategy = new oauth2.Strategy({
  authorizationURL: merusBaseUrl + '/auth/authorize',
  tokenURL: merusBaseUrl + '/auth/token',
  clientID: clientId,
  clientSecret: clientSecret,
  callbackURL: callbackUrl
}, function(accessToken, refreshToken, profile, done) {
  var opts = {
    host: 'api.meruscase.com',
    path: '/v1/users/me',
    headers: {
      'Authorization': 'Bearer ' + accessToken
    }
  };
  var req = http.get(opts, function(req){
    var body = '';
    req.on('data', function(data){
      body += data;
    });
    req.on('end', function(){
      var user = JSON.parse(body);
      users[user.id] = user;
      done(null, user);
    });
  });
});

passport.use(strategy);

// Passport init

app.use(passport.initialize());
app.use(passport.session());

app.get('/', function(req, res){
  res.send('<a href="/auth/merus">Login</a>');
});

app.get('/auth/merus',
  passport.authenticate('oauth2'));

app.get('/auth/merus/callback',
  passport.authenticate('oauth2', { failureRedirect: '/error' }),
  function(req, res) {
    res.redirect('/me');
  });

app.get('/me', function(req, res){
  res.send('<p>Hello, <b>' + req.user.username + '</b></p>');
});

app.get('/error', function(req, res){
  res.send('<h1>An error has occurred</h1>');
});

app.listen(5000);

module.exports = app;
