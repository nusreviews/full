const express = require('express');
const config = require('./config');
const db = require('./db');

/*************************** Associations ********************************** */
const Like = require('./models/like');
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

Review.hasMany(Like, {
    as: 'Likes',
    foreignKey: 'reviewId',
    sourceKey: 'reviewId'
});

User.hasMany(Like, {
    as: 'Likes',
    foreignKey: 'userId',
    sourceKey: 'userId'
});

User.hasMany(Review, {
    as: 'Reviews',
    foreignKey: 'reviewBy',
    sourceKey: 'userId'
});

// Order is important here
Module.sync();
Professor.sync();
User.sync();
Review.sync();
Like.sync();

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
        res.json({
            modules: modules
        });
    });
});

// get specific module
app.get('/getModule/:modId', (req, res) => {
    Module.findOne({ 
        where: {
            modId: req.params.modId
        }
    }).then((rawModule) => {
        if (rawModule === null) {
            res.json({
                module: null
            });
        } else {
            res.json({
                module: rawModule.dataValues
            });
        }
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
                percent: null
            });
        } else {
            res.json({
                percent: (recommendReviewCount / reviewCount) * 100
            });
        }
    });
});

// get latest review date of module
app.get('/getLatestReviewDate/:modId', (req, res) => {
    Review.findOne({
        where: {
            modId: req.params.modId
        }, 
        order: [
            ['createdAt', 'DESC']
        ]
    }).then((rawReview) => {
        if (rawReview === null) {
            res.json({
                lastReviewDate: null
            });
        } else {
            res.json({
                lastReviewDate: rawReview.dataValues.createdAt
            });
        }
    });
});

/****************************** Professor ************************************* */


// get All Professor
app.get('/getProfessors', (req, res) =>{
    Professor.findAll().then((rawProfessors) => {
        let professors = rawProfessors.map((rawProfessor) => {
            return rawProfessor.dataValues;
        });
        res.json({
            professors: professors
        });
    });
});

// get a prof
app.get('/getProfessor/:id', (req, res) => {
    Professor.findOne({
        where: {
            profId: req.params.profId
        }
    }).then((rawProfessor) => {
        if (rawProfessor === null) {
            res.json({
                professor: null
            });
        } else {
            res.json({
                professor: rawProfessor.dataValues
            });
        }
    });
});

/****************************** Review ************************************* */

/*
// get likes of a review
app.get('/getLikes/:reviewId', (req, res) => {
    let sql = `select count(*) as amount from user, review, liked where user.userId = liked.userId and review.reviewId = liked.reviewId and liked.reviewId = ${req.params.reviewId}`;
    querySql(sql, (result) =>{res.send(result);});
});
*/

// get reviews of module
app.get('/getReviewsByModule/:modId', (req, res) => {
    Review.findAll({
        where: {
            modId: req.params.modId
        }
    }).then((rawReviews) => {
        let reviews = rawReviews.map((rawReview) => {
            return rawReview.dataValues;
        });
        res.json({
            reviews: reviews
        });
    });
});

// get reviews card of user
app.get('/getReviewsByUser/:userId', (req, res) => {
    Review.findAll({
        where: {
            userId: req.params.userId
        }
    }).then((rawReviews) => {
        let reviews = rawReviews.map((rawReview) => {
            return rawReview.dataValues;
        });
        res.json({
            reviews: reviews
        });
    });
});


// Should be a post request
/*
// insert review
app.get('/insertReview/:modId/:reviewBy/:taughtBy/:teaching/:difficulty/:enjoyability/:workload/:recommend/:comments', (req, res) =>{
    let sql = `insert into review (modId, reviewBy, taughtBy, teaching, difficulty, enjoyability, workload, recommend, comments) 
    values ("${req.params.modId}", ${req.params.reviewBy}, ${req.params.taughtBy}, ${req.params.teaching}, ${req.params.difficulty}, ${req.params.enjoyability}, ${req.params.workload}, ${req.params.recommend}, "${req.params.comments}")`;
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



