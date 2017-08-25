const express = require('express');
const mysql = require('mysql');

const config = require('./config');
const passport = require('passport');

const token = require('./token');
require('./authentication/jwt');
require('./authentication/facebook');

const generateUserToken = (req, res) => {
    const accessToken = token.generateAccessToken(req.user.id);
    res.json({
        token: accessToken
    });
}

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
app.use(passport.initialize());

app.get('/auth/facebook', 
    passport.authenticate('facebook', { session: false }));

app.get('/auth/facebook/callback', 
    passport.authenticate('facebook', { session: false }), generateUserToken);

app.get('/', (req, res) => {
    res.json({
        message: "Hello World"
    });
});

app.get('/profile', passport.authenticate(['jwt'], { session: false }), (req, res) => {
    res.json(req.user);
});

const port = config.get('http.port');
const ip = config.get('http.ip');

app.listen('3000', '127.0.0.1', ()=>{
    console.log('Server started on port 3000');
});

