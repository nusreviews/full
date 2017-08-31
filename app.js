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

Module.sync();
Professor.sync();
User.sync();
Review.sync();

const app = express();

app.get('/', (req, res) => {
    res.json({
        message: "Hello World"
    });
    
});

/****************************** Module ************************************* */

// get all modules
app.get('/getModules', (req, res) => {
    Module.findAll().then((rawModules) => {
        let modules = rawModules.map((rawModule) => {
            return rawModule.dataValues;
        });
        res.json(modules);
    });
});

// get specific module
app.get('/getModule/:modId', (req, res) =>{
    Module.findOne({ 
        where: {
            modId: req.params.modId
        }
    }).then((module) => {
        res.json(module.dataValues);
    });
});

// get module percentage
app.get('/getModulePercentage/:modId', (req, res) => {

    let reviewCountPromise = Review.count({
        where: {
            modId: req.params.modId
        }
    }).then((reviewCount) => {
        return reviewCount;
    });

    let recommendReviewCountPromise = Review.count({
        where: {
            modId: req.params.modId,
            recommend: true
        }
    }).then((recommendReviewCount) => {
        return recommendReviewCount;
    });

    let queryPromises = [reviewCountPromise, recommendReviewCountPromise];
    Promise.all(queryPromises).then((queryCounts) => {
        let reviewCount = queryCounts[0];
        let recommendReviewCount = queryCounts[1];

        if (reviewCount <= 0 || recommendReviewCount <= 0) {
            res.json({
                percent: NaN
            });
        } else {
            res.json({
                percent: (recommendReviewCount / reviewCount) * 100
            });
        }
    });
});

// get latest review date of module
app.get('/getLatestReviewDate/:modId', (req, res) =>{
    Review.findOne({
        where: {
            modId: req.params.modId
        }, 
        order: [
            ['createdAt', 'DESC']
        ]
    }).then((rawReview) => {
        res.json({
            lastReviewDate: rawReview.dataValues.createdAt
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
*/

/****************************** Professor ************************************* */

/*
// get All Professor
app.get('/getProfessors', (req, res) =>{
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

// get reviews card of user
app.get('/getReviewsOfUser/:id', (req, res) =>{
    let sql = `select * from review, user where user.userId = ${req.params.id} and review.reviewBy = user.userId`;
    db.query(sql, (err, result)=>{
        if(err){
            throw err;
        } 
        res.send(result);
    });
});

// get likes of a review
app.get('/getLikes/:reviewId', (req, res) =>{
    let sql = `select count(*) as amount from user, review, liked where user.userId = liked.userId and review.reviewId = liked.reviewId and liked.reviewId = ${req.params.reviewId}`;
      querySql(sql, (result) =>{res.send(result);});
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



