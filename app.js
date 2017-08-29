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
        db.query(sql, (err, result)=>{
            if(err){
                throw err;
            } 
        });
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

/****************************** Module ************************************* */

// get all modules
app.get('/getAllModule', (req, res) =>{
    let sql = 'select * from module';
    db.query(sql, (err, result)=>{
        if(err){
            throw err;
        } 
        res.send(result);
    });
});

// get specific module
app.get('/getModule/:id', (req, res) =>{
    let sql = `select * from module where modId = "${req.params.id}"`;
    db.query(sql, (err, result)=>{
        if(err){
            throw err;
        } 
        res.send(result);
    });
});

// get module percentage
app.get('/getModulePercentage/:id', (req, res) =>{
    let sql = `SELECT floor(count(*)/(SELECT count(*) FROM review where modId = "${req.params.id}") * 100) AS percent FROM review where modId = "CS1010" and recommend = true`;
    db.query(sql, (err, result)=>{
        if(err){
            throw err;
        } 
        res.send(result);
    });
});

// get reviews of module
app.get('/getReview/:id', (req, res) =>{
    let sql = `select * from review where review.modId = "${req.params.id}"`;
    db.query(sql, (err, result)=>{
        if(err){
            throw err;
        } 
        res.send(result);
    });
});

// get latest review date of module
app.get('/getLatestReviewDate/:id', (req, res) =>{
        let sql = `SELECT * FROM review where modId = "${req.params.id}" group by modId ORDER BY reviewDate DESC`;
        db.query(sql, (err, result)=>{
            if(err){
                throw err;
            } 
            res.send(result);
        });
});

/****************************** Professor ************************************* */

// get All Professor
app.get('/getAllProfessor', (req, res) =>{
    let sql = "select * from professor";
    db.query(sql, (err, result)=>{
        if(err){
            throw err;
        } 
        res.send(result);
    });
});

// get a prof
app.get('/getProfessor/:id', (req, res) =>{
    let sql = `select * from professor where profId = "${req.params.id}"`;
    db.query(sql, (err, result)=>{
        if(err){
            throw err;
        } 
        res.send(result);
    });
});

/****************************** Review ************************************* */

// insert review
app.get('/insertReview/:id/:reviewBy/:taughtBy/:teaching/:difficulty/:enjoyability/:workload/:recommend/:comments', (req, res) =>{
    let sql = `insert into review (modId, reviewBy, taughtBy, teaching, difficulty, enjoyability, workload, recommend, comments) 
    values ("${req.params.id}", ${req.params.reviewBy}, ${req.params.taughtBy}, ${req.params.teaching}, ${req.params.difficulty}, ${req.params.enjoyability}, ${req.params.workload}, ${req.params.recommend}, "${req.params.comments}")`;
    db.query(sql, (err, result)=>{
        if(err){
            throw err;
        } 
        res.send("insert succesful");
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

