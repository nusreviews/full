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

const moduleDefaultLimit = 10;
const moduleDefaultOffset = 0;

const moduleMaxLimit = 100;

// Takes an array of reviews and returns an object that
// describes the aggregate data (e.g. avg teaching score)
const aggregateReviewsData = (reviews) => {
    // Nothing to calculate if no reviews are presented for a module
    if (reviews.length === 0) {
        return {
            percentage: null,
            avgTeaching: null,
            avgDifficulty: null,
            avgEnjoyability: null,
            avgWorkload: null,
            dateUpdated: null
        };
    }

    let accumulator = {
        totalRecommendations: 0,
        totalTeaching: 0,
        totalDifficulty: 0,
        totalEnjoyability: 0,
        totalWorkload: 0,
        dateUpdated: new Date(0)
    };

    for (let i = 0; i < reviews.length; i++) {
        let review = reviews[i];
        if (review.recommend) {
            accumulator.totalRecommendations = accumulator.totalRecommendations + 1;
        }
        accumulator.totalTeaching = accumulator.totalTeaching + review.teaching;
        accumulator.totalDifficulty = accumulator.totalDifficulty + review.difficulty;
        accumulator.totalEnjoyability = accumulator.totalEnjoyability + review.enjoyability;
        accumulator.totalWorkload = accumulator.totalWorkload + review.workload;
        accumulator.dateUpdated = new Date(Math.max(accumulator.dateUpdated, review.updatedAt));
    }

    let aggregateData = {
        percentage: accumulator.totalRecommendations / reviews.length,
        avgTeaching: accumulator.totalTeaching / reviews.length,
        avgDifficulty: accumulator.totalDifficulty / reviews.length,
        avgEnjoyability: accumulator.totalEnjoyability / reviews.length,
        avgWorkload: accumulator.totalWorkload / reviews.length,
        dateUpdated: accumulator.dateUpdated
    };

    return aggregateData;
};

const getModuleLimit = (proposedLimit) => {
    if (Number.isNaN(proposedLimit) || proposedLimit < 0) {
        return moduleDefaultLimit;
    } else {
        return Math.min(proposedLimit, moduleMaxLimit);
    }
};

const getModuleOffset = (proposedOffset) => {
    if (Number.isNaN(proposedOffset) || proposedOffset < 0) {
        return moduleDefaultOffset;
    } else {
        return proposedOffset;
    }
};

app.get('/getModulesFullAttribute', (req, res) => {
    let limit = getModuleLimit(Number(req.query.limit));
    let offset = getModuleOffset(Number(req.query.offset));

    let moduleQueryOptions = {
        limit: limit,
        offset: offset
    };

    Module.findAll(moduleQueryOptions).then((rawModules) => {
        let modules = rawModules.map((rawModule) => {
            return rawModule.dataValues;
        });
        let reviewsPromises = modules.map((module) => {
            return Review.findAll({
                where: {
                    modId: module.modId
                }
            });
        });

        Promise.all(reviewsPromises).then((rawReviewsByModuleId) => {
            let reviewsByModuleId = rawReviewsByModuleId.map((rawReviews) => {
                return rawReviews.map((rawReview) => {
                    return rawReview.dataValues;
                });
            });
            let aggregateReviewByModuleId = reviewsByModuleId.map((reviews) => {
                return aggregateReviewsData(reviews);
            });

            let mergedModuleReviewData = [];
            for (let j = 0; j < aggregateReviewByModuleId.length; j++) {
                let currentReviewData = aggregateReviewByModuleId[j];
                let currentModuleData = modules[j];
                mergedModuleReviewData.push(Object.assign(currentReviewData, currentModuleData));
            }

            res.json({
                modules: mergedModuleReviewData
            });
        });
    });
});

// get all modules
app.get('/getModules', (req, res) => {
    let limit = getModuleLimit(Number(req.query.limit));
    let offset = getModuleOffset(Number(req.query.offset));
    let moduleQueryOptions = {
        limit: limit,
        offset: offset
    };

    Module.findAll(moduleQueryOptions).then((rawModules) => {
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

const reviewDefaultLimit = 10;
const reviewDefaultOffset = 0;

const reviewMaxLimit = 100;

const getReviewLimit = (proposedLimit) => {
    if (Number.isNaN(proposedLimit) || proposedLimit < 0) {
        return reviewDefaultLimit;
    } else {
        return Math.min(proposedLimit, reviewMaxLimit);
    }
};

const getReviewOffset = (proposedOffset) => {
    if (Number.isNaN(proposedOffset) || proposedOffset < 0) {
        return reviewDefaultOffset;
    } else {
        return proposedOffset;
    }
};

// Fetch reviews and modify behavior by query parameters
app.get('/getReviews', (req, res) => {
    let limit = getReviewLimit(Number(req.query.limit));
    let offset = getReviewOffset(Number(req.query.offset));
    let reviewQueryOptions = {
        limit: limit,
        offset: offset,
        where: {}
    };

    if (req.query.module !== undefined) {
        reviewQueryOptions.where.modId = req.query.module;
    }
    if (req.query.user !== undefined) {
        reviewQueryOptions.where.reviewBy = req.query.user;
    }

    Review.findAll(reviewQueryOptions).then((rawReviews) => {
        let reviews = rawReviews.map((rawReview) => {
            return rawReview.dataValues;
        });

        let likesPromises = reviews.map((review) => {
            return Like.findAll({
                where: {
                    reviewId: review.reviewId
                }
            });
        });

        Promise.all(likesPromises).then((rawLikesByReviewId) => {
            let likesByReviewId = rawLikesByReviewId.map((rawLikes) => {
                return rawLikes.map((rawLike) => {
                    return rawLike.dataValues;
                });
            });

            let relevantLikeDataByReviewId = likesByReviewId.map((likes) => {
                let likesCount = likes.length;
                let hasUserLike = likes.filter((like) => {
                    return like.userId === req.query.likedBy;
                }).length > 0;

                return {
                    totalLikes: likesCount,
                    hasUserLike: hasUserLike
                };
            });

            let mergedReviewLikeData = [];
            for (let i = 0; i < reviews.length; i++) {
                let currentReviewData = reviews[i];
                let currentLikeData = relevantLikeDataByReviewId[i];
                mergedReviewLikeData.push(Object.assign(currentLikeData, currentReviewData));
            }

            res.json({
                reviews: mergedReviewLikeData
            });
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



