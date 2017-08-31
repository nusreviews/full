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
app.get('/getModule/:modId', (req, res) =>{
    let sql = `select * from module where modId = "${req.params.modId}"`;
    querySql(sql, (result) =>{res.send(result);});
});

// get module percentage
app.get('/getModulePercentage/:modId', (req, res) =>{
    let sql = `SELECT floor(count(*)/(SELECT count(*) FROM review where modId = "${req.params.modId}") * 100) AS percent FROM review where modId = "${req.params.modId}" and recommend = true`;
    querySql(sql, (result) =>{res.send(result);});
});

// get latest review date of module
app.get('/getLatestReviewDate/:modId', (req, res) =>{
    let sql = `SELECT * FROM review where modId = "${req.params.modId}" group by modId ORDER BY dateUpdated DESC`;
    querySql(sql, (result) =>{res.send(result);});
});

/****************************** Professor ************************************* */

// get All Professor
app.get('/getProfessors', (req, res) =>{
    let sql = "select * from professor";
    querySql(sql, (result) =>{
        res.send(result);

        for(var i = 0; i < result.length; i++) {
            var obj = result[i];
            obj.a = "haha";
            console.log(obj.a);
        }
    });
});

// get a prof
app.get('/getProfessor/:profId', (req, res) =>{
    let sql = `select * from professor where profId = "${req.params.profId}"`;
    querySql(sql, (result) =>{res.send(result);});
});

/****************************** Review ************************************* */

// get likes of a review
app.get('/getLikes/:reviewId', (req, res) =>{
    let sql = `select count(*) as amount from user, review, liked where user.userId = liked.userId and review.reviewId = liked.reviewId and liked.reviewId = ${req.params.reviewId}`;
    querySql(sql, (result) =>{res.send(result);});
});

// get reviews of module
app.get('/getReview/:modId', (req, res) =>{
    let sql = `select * from review where review.modId = "${req.params.modId}"`;
    querySql(sql, (result) =>{res.send(result);});
});

// get reviews card of user
app.get('/getReviewsOfUser/:userId', (req, res) =>{
    let sql = `select * from review, user where user.userId = ${req.params.userId} and review.reviewBy = user.userId`;
    querySql(sql, (result) =>{res.send(result);});
});

// insert review
app.get('/insertReview/:modId/:reviewBy/:taughtBy/:teaching/:difficulty/:enjoyability/:workload/:recommend/:comments', (req, res) =>{
    let sql = `insert into review (modId, reviewBy, taughtBy, teaching, difficulty, enjoyability, workload, recommend, comments) 
    values ("${req.params.modId}", ${req.params.reviewBy}, ${req.params.taughtBy}, ${req.params.teaching}, ${req.params.difficulty}, ${req.params.enjoyability}, ${req.params.workload}, ${req.params.recommend}, "${req.params.comments}")`;
    querySql(sql, (result) =>{res.send(result);});
});

/****************************** Specific function ************************************* */

let sql_getModulesPercentage = 'select numRecommend.modId, floor((numRecommend/totalReview)*100) as percentage from ' + 
                                '(select modId, count(*) as numRecommend from review where recommend = true group by modId) as numRecommend, ' +
                                '(select modId, count(*) as totalReview from review group by modId) as numReview ' +
                                'where numRecommend.modId = numReview.modId';

let sql_getModulesAvgRatings = 'select teachingTable.modId, totalTeaching/totalReview as avgTeaching, totalDifficulty/totalReview as avgDifficulty, totalEnjoyability/totalReview as avgEnjoyability, totalWorkload/totalReview as avgWorkload ' +
                                'from (select modId, sum(teaching) as totalTeaching, sum(difficulty) as totalDifficulty, sum(enjoyability) as totalEnjoyability, sum(workload) as totalWorkLoad from review group by modId) as teachingTable, ' +
                                '(select modId, count(*) as totalReview from review group by modId) as numReview ' +
                                'where numReview.modId = teachingTable.modId';

let sql_getLatestModified = 'SELECT modId, dateUpdated FROM review  group by modId ORDER BY dateUpdated DESC';

let sql_getModuleFull = 'select module.modId, name, description, percentageTable.percentage, rateTable.avgTeaching, rateTable.avgDifficulty, rateTable.avgEnjoyability, rateTable.avgWorkload, dateT.dateUpdated from module ' +
                        'left join (' + sql_getModulesPercentage + ') as percentageTable on module.modId = percentageTable.modId ' +
                        'left join (' + sql_getModulesAvgRatings + ') as rateTable on module.modId = rateTable.modId ' +
                        'left join (' + sql_getLatestModified + ') as dateT on module.modId = dateT.modId';



// get all modules with full attribute
app.get('/getModulesFullAttribute', (req, res) =>{
    let testSql = 'SELECT modId, date(dateUpdated) as test FROM review  group by modId ORDER BY dateUpdated DESC ;';
    querySql(testSql, (result) =>{
        res.send(result);
        console.log(result);
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

