const express = require('express');
const config = require('./config');
const db = require('./db');

/*************************** Associations ********************************** */
const Module = require('./models/module');
const Professor = require('./models/professor');
const Review = require('./models/review');
const User = require('./models/user');

Module.hasMany(Review, {
    as: 'Reviews',
    foreignKey: 'modId',
    sourceKey: 'modId'
});

Professor.hasMany(Review, {
    as: 'Reviews',
    foreignKey: 'taughtBy',
    sourceKey: 'profId'
});

User.hasMany(Review, {
    as: 'Reviews',
    foreignKey: 'reviewBy',
    sourceKey: 'userId'
});


const app = express();

app.get('/', (req, res) => {
    res.json({
        message: "Hello World"
    });
    
});

/****************************** Module ************************************* */

// get all modules
app.get('/getAllModule', (req, res) => {
    Module.findAll().then((rawModules) => {
        let modules = rawModules.map((rawModule) => {
            return rawModule.dataValues;
        });
        res.json(modules);
    });
});

// get specific module
app.get('/getModule/:id', (req, res) =>{
    Module.findOne({ 
        where: {
            modId: req.params.id
        }
    }).then((module) => {
        res.json(module.dataValues);
    });
});

// get module percentage
app.get('/getModulePercentage/:id', (req, res) => {

    let reviewCountPromise = Review.count({
        where: {
            modId: req.params.id
        }
    }).then((reviewCount) => {
        return reviewCount;
    });

    let recommendReviewCountPromise = Review.count({
        where: {
            modId: req.params.id,
            recommend: true
        }
    }).then((recommendReviewCount) => {
        return recommendReviewCount;
    });

    let queryPromises = [reviewCountPromise, recommendReviewCountPromise];
    Promise.all(queryPromises).then((queryCounts) => {
        let reviewCount = queryCounts[0];
        let recommendReviewCount = queryCounts[1];
        res.json({
            percent: (recommendReviewCount / reviewCount) * 100
        });
    });
});
/*
// get reviews of module
app.get('/getReview/:id', (req, res) => {

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
*/

/****************************** Professor ************************************* */

/*
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
*/

/****************************** Review ************************************* */

/*
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
*/

const port = config.get('http.port');
const ip = config.get('http.ip');

app.listen('3000', '127.0.0.1', ()=>{
    console.log('Server started on port 3000');
});

/*
app.use(passport.initialize());

app.get('/auth/facebook', 
    passport.authenticate('facebook', { session: false }));

app.get('/auth/facebook/callback', 
    passport.authenticate('facebook', { session: false }), generateUserToken);
*/


/*
const generateUserToken = (req, res) => {
    const accessToken = token.generateAccessToken(req.user.id);
    res.json({
        token: accessToken
    });
}
*/

/*
app.get('/profile', passport.authenticate(['jwt'], { session: false }), (req, res) => {
    res.json(req.user);
});
*/



