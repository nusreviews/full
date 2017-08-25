const bluebird = require('bluebird');
const express = require('express');
const expressSession = require('express-session');
const mysql = require('mysql');

const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const redis = require('redis');
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
const redisClient = redis.createClient();

const FACEBOOK_APP_ID = redisClient.getAsync('FACEBOOK_APP_ID').then((res) => {
    return res;
});
const FACEBOOK_APP_SECRET = redisClient.getAsync('FACEBOOK_APP_SECRET').then((res) => {
    return res;
});

passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "http://api.nusreviews.com/auth/facebook/callback"
  }, 
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate({
        facebookId: profile.id
    }, function(err, user) {
        return done(err, user);
    });
  }
));

// create connection
const db = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password: '!qW2#eR4'
});

// connect
db.connect((err) => {
    if(err){
        throw err;
    } else {
        console.log('MySQL Connected');
    }
});

const app = express();
app.use(expressSession({ 
    secret: '$rE3@wQ1'
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
    res.json({
        message: "Hello World"
    });
});

app.get('/profile', (req, res) => {
    res.json({
        user: req.user
    });
});

app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback', 
    passport.authenticate('facebook', { 
        successRedirect: '/', 
        failureRedirect: '/' 
    })
);

app.listen('3000', ()=>{
    console.log('Server started on port 3000');
});

