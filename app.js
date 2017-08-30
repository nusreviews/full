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
    //password: 'limtaeu'
});

// connect
db.connect((err) => {
    if(err){
        throw err;
    } else {
        console.log('MySQL Connected');
        let sql = 'use nusreviews';
        querySql(sql, (result)=>{});
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

// sql query
function querySql(sql, callback) {
    db.query(sql, (err, result)=>{
        if(err){
            throw err;
        } 
        callback(result);
    })
}

/****************************** Module ************************************* */
// get all modules
app.get('/getModules', (req, res) =>{
    let sql = 'select * from module';
    querySql(sql, (result) =>{res.send(result);});
});

// get specific module
app.get('/getModule/:id', (req, res) =>{
    let sql = `select * from module where modId = "${req.params.id}"`;
    querySql(sql, (result) =>{res.send(result);});
});

// get module percentage
app.get('/getModulePercentage/:id', (req, res) =>{
    let sql = `SELECT floor(count(*)/(SELECT count(*) FROM review where modId = "${req.params.id}") * 100) AS percent FROM review where modId = "${req.params.id}" and recommend = true`;
    querySql(sql, (result) =>{res.send(result);});
});

// get latest review date of module
app.get('/getLatestReviewDate/:id', (req, res) =>{
    let sql = `SELECT * FROM review where modId = "${req.params.id}" group by modId ORDER BY reviewDate DESC`;
    querySql(sql, (result) =>{res.send(result);});
});

/****************************** Professor ************************************* */

// get All Professor
app.get('/getProfessors', (req, res) =>{
    let sql = "select * from professor";
    querySql(sql, (result) =>{res.send(result);});
});

// get a prof
app.get('/getProfessor/:id', (req, res) =>{
    let sql = `select * from professor where profId = "${req.params.id}"`;
    querySql(sql, (result) =>{res.send(result);});
});

/****************************** Review ************************************* */

// get likes of a review
app.get('/getLikes/:id', (req, res) =>{
    let sql = `select likes from review where reviewId = "${req.params.id}"`;
    querySql(sql, (result) =>{res.send(result);});
});

// get reviews of module
app.get('/getReview/:id', (req, res) =>{
    let sql = `select * from review where review.modId = "${req.params.id}"`;
    querySql(sql, (result) =>{res.send(result);});
});

// get reviews card of user
app.get('/getReviewsOfUser/:id', (req, res) =>{
    let sql = `select * from review, user where user.userId = ${req.params.id} and review.reviewBy = user.userId`;
    querySql(sql, (result) =>{res.send(result);});
});

// insert review
app.get('/insertReview/:id/:reviewBy/:taughtBy/:teaching/:difficulty/:enjoyability/:workload/:recommend/:comments', (req, res) =>{
    let sql = `insert into review (modId, reviewBy, taughtBy, teaching, difficulty, enjoyability, workload, recommend, comments) 
    values ("${req.params.id}", ${req.params.reviewBy}, ${req.params.taughtBy}, ${req.params.teaching}, ${req.params.difficulty}, ${req.params.enjoyability}, ${req.params.workload}, ${req.params.recommend}, "${req.params.comments}")`;
    querySql(sql, (result) =>{res.send(result);});
});

/****************************** Specific function ************************************* */

app.get('/profile', passport.authenticate(['jwt'], { session: false }), (req, res) => {
    res.json(req.user);
});

const port = config.get('http.port');
const ip = config.get('http.ip');

app.listen('3000', '127.0.0.1', ()=>{
    console.log('Server started on port 3000');
});

