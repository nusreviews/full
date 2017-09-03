const _ = require("lodash");
const express = require("express");
const config = require("./config");
const db = require("./db");

/*************************** Associations ********************************** */
const Like = require("./models/like");
const Module = require("./models/module");
const Professor = require("./models/professor");
const Review = require("./models/review");
const User = require("./models/user");

Module.hasMany(Review, {
    as: "Reviews",
    foreignKey: "modId",
    sourceKey: "modId"
});

Professor.hasMany(Review, {
    as: "Reviews",
    foreignKey: "taughtBy",
    sourceKey: "profId"
});

Review.hasMany(Like, {
    as: "Likes",
    foreignKey: "reviewId",
    sourceKey: "reviewId"
});

User.hasMany(Like, {
    as: "Likes",
    foreignKey: "userId",
    sourceKey: "userId"
});

User.hasMany(Review, {
    as: "Reviews",
    foreignKey: "reviewBy",
    sourceKey: "userId"
});

// Order is important here
Module.sync();
Professor.sync();
User.sync();
Review.sync();
Like.sync();

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Access-Control-Allow-Origin, Origin, X-Requested-With, Content-Type, Accept");
  next();
});

/*************************** Authentication ******************************** */

const https = require("https");
const jwt = require("jsonwebtoken");
const passport = require("passport");
app.use(passport.initialize());

const generateUserToken = (userTokenSubject) => {

    const expiresIn = "7d";
    const issuer = config.get("authentication.token.issuer");
    const audience = config.get("authentication.token.audience");
    const secret = config.get("authentication.token.secret");

    let userToken = jwt.sign({}, secret, {
        expiresIn: expiresIn,
        audience: audience,
        issuer: issuer,
        subject: JSON.stringify(userTokenSubject)
    });

    return userToken;
};

const fbClientId = config.get("authentication.facebook.clientId");
const fbClientSecret = config.get("authentication.facebook.clientSecret");

const exchangeFbToken = (fbToken) => {
    let query = "?grant_type=fb_exchange_token&client_id=" + fbClientId + 
        "&client_secret=" + fbClientSecret + "&fb_exchange_token=" + fbToken;

    return new Promise((resolve, reject) => {
        https.get("https://graph.facebook.com/oauth/access_token" + query, (res) => {
            if (res.statusCode !== 200) {
                reject("Got status code " + res.statuscode + " while exchanging fb token");
            } else {
                let responseData = "";
                res.on("data", (dataChunk) => {
                    responseData = responseData + dataChunk;
                });
                res.on("end", () => {
                    resolve(responseData);
                });
            }
        }).on("error", (err) => {
            reject(err);
        });
    });
};

app.get("/generateServerToken", (req, res) => {
    let fbToken = req.query.fbToken;
    let fbPrimaryEmail = req.query.email;
    let fbDisplayName = req.query.name;

    exchangeFbToken(fbToken).then((fbResponseJSON) => {
        let fbResponse = JSON.parse(fbResponseJSON);
        let newFbToken = fbResponse.access_token;

        User.findOrCreate({
            where: {
                email: fbPrimaryEmail
            },
            defaults: {
                displayName: fbDisplayName
            }
        }).then((sequelizeResponse) => {
            let user = sequelizeResponse[0].dataValues;
            let userTokenSubject = {
                user: user,
                fbToken: newFbToken
            };

            let jwtToken = generateUserToken(userTokenSubject);
            res.json({
                token: jwtToken
            });
        });
    }).catch((err) => {
        res.json({
            token: null
        });
    });
});


/************************** JWT Authentication ***************************** */

const passportJwt = require("passport-jwt");

const passportJWTOptions = {
  jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.get("authentication.token.secret"),
  issuer: config.get("authentication.token.issuer"),
  audience: config.get("authentication.token.audience")
};

passport.use(new passportJwt.Strategy(passportJWTOptions, function(jwtPayload, done) {
    let userSubjectToken = JSON.parse(jwtPayload.sub);
    console.log(userSubjectToken);
    return done(null, userSubjectToken);
}));

app.get("/jwtTest", passport.authenticate(["jwt"], { session: false }), (req, res) => {
    res.json({
        message: "success"
    });
});


/******************************** User ************************************* */

app.get("/profile", passport.authenticate(["jwt"], { session: false }), (req, res) => {
    let userTokenSubject = JSON.parse(req.user);
    res.json({
        user: userTokenSubject.user;
    });
});


/****************************** Module ************************************* */

const moduleDefaultLimit = 10;
const moduleDefaultOffset = 0;

const moduleMaxLimit = 200;

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

    reviews.forEach((review) => {
        if (review.recommend) {
            accumulator.totalRecommendations = accumulator.totalRecommendations + 1;
        }
        accumulator.totalTeaching = accumulator.totalTeaching + review.teaching;
        accumulator.totalDifficulty = accumulator.totalDifficulty + review.difficulty;
        accumulator.totalEnjoyability = accumulator.totalEnjoyability + review.enjoyability;
        accumulator.totalWorkload = accumulator.totalWorkload + review.workload;
        accumulator.dateUpdated = new Date(Math.max(accumulator.dateUpdated, review.updatedAt));
    });

    let aggregateData = {
        percentage: accumulator.totalRecommendations / reviews.length * 100,
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

app.get("/getModulesFullAttribute", (req, res) => {
    let limit = getModuleLimit(Number(req.query.limit));
    let offset = getModuleOffset(Number(req.query.offset));
    let strict = req.query.strict;

    let moduleQueryOptions = {
        limit: limit,
        offset: offset,
        where: {}
    };

    if (!_.isEmpty(req.query.modId)) {
        if (strict === "true") {
            moduleQueryOptions.where.modId = {
                $eq: req.query.modId
            };
        } else {
            moduleQueryOptions.where.modId = {
                $like: "%" + req.query.modId + "%"
            };
        }
    }

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

            let mergedModuleReviewData = _.zipWith(modules, aggregateReviewByModuleId, (currentModuleData, currentReviewData) => {
                return Object.assign(currentReviewData, currentModuleData);
            });

            res.json({
                modules: mergedModuleReviewData
            });
        });
    });
});

// get all modules
app.get("/getModules", (req, res) => {
    let limit = getModuleLimit(Number(req.query.limit));
    let offset = getModuleOffset(Number(req.query.offset));
    let strict = req.query.strict;

    let moduleQueryOptions = {
        limit: limit,
        offset: offset,
        where: {}
    };

    if (!_.isEmpty(req.query.modId)) {
        if (strict === "true") {
            moduleQueryOptions.where.modId = {
                $eq: req.query.modId
            };
        } else {
            moduleQueryOptions.where.modId = {
                $like: "%" + req.query.modId + "%"
            };
        }
    }

    Module.findAll(moduleQueryOptions).then((rawModules) => {
        let modules = rawModules.map((rawModule) => {
            return rawModule.dataValues;
        });
        res.json({
            modules: modules
        });
    });
});

// get latest review date of module
app.get("/getLatestReviewDate/:modId", (req, res) => {
    Review.findOne({
        where: {
            modId: req.params.modId
        }, 
        order: [
            ["createdAt", "DESC"]
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
app.get("/getProfessors", (req, res) => {
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
app.get("/getProfessor/:id", (req, res) => {
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
app.get("/getLikes/:reviewId", (req, res) => {
    let sql = `select count(*) as amount from user, review, liked where user.userId = liked.userId and review.reviewId = liked.reviewId and liked.reviewId = ${req.params.reviewId}`;
    querySql(sql, (result) =>{res.send(result);});
});
*/

const reviewDefaultLimit = 10;
const reviewDefaultOffset = 0;

const reviewMaxLimit = 200;

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
app.get("/getReviews", (req, res) => {
    let limit = getReviewLimit(Number(req.query.limit));
    let offset = getReviewOffset(Number(req.query.offset));
    let reviewQueryOptions = {
        limit: limit,
        offset: offset,
        where: {}
    };

    if (!_.isEmpty(req.query.module)) {
        reviewQueryOptions.where.modId = req.query.module;
    }
    if (!_.isEmpty(req.query.user)) {
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

            let mergedReviewLikeData = _.zipWith(reviews, relevantLikeDataByReviewId, (currentReviewData, currentLikeData) => {
                return Object.assign(currentLikeData, currentReviewData);
            });

            res.json({
                reviews: mergedReviewLikeData
            });
        });
    });
});


// Should be a post request
/*
// insert review
app.get("/insertReview/:modId/:reviewBy/:taughtBy/:teaching/:difficulty/:enjoyability/:workload/:recommend/:comments", (req, res) =>{
    let sql = `insert into review (modId, reviewBy, taughtBy, teaching, difficulty, enjoyability, workload, recommend, comments) 
    values ("${req.params.modId}", ${req.params.reviewBy}, ${req.params.taughtBy}, ${req.params.teaching}, ${req.params.difficulty}, ${req.params.enjoyability}, ${req.params.workload}, ${req.params.recommend}, "${req.params.comments}")`;
    querySql(sql, (result) =>{res.send(result);});
});

/****************************** Specific function ************************************* */
/*
let sql_getModulesPercentage = "select numRecommend.modId, floor((numRecommend/totalReview)*100) as percentage from " + 
                                "(select modId, count(*) as numRecommend from review where recommend = true group by modId) as numRecommend, " +
                                "(select modId, count(*) as totalReview from review group by modId) as numReview " +
                                "where numRecommend.modId = numReview.modId";

let sql_getModulesAvgRatings = "select teachingTable.modId, totalTeaching/totalReview as avgTeaching, totalDifficulty/totalReview as avgDifficulty, totalEnjoyability/totalReview as avgEnjoyability, totalWorkload/totalReview as avgWorkload " +
                                "from (select modId, sum(teaching) as totalTeaching, sum(difficulty) as totalDifficulty, sum(enjoyability) as totalEnjoyability, sum(workload) as totalWorkLoad from review group by modId) as teachingTable, " +
                                "(select modId, count(*) as totalReview from review group by modId) as numReview " +
                                "where numReview.modId = teachingTable.modId";

let sql_getLatestModified = "SELECT modId, dateUpdated FROM review  group by modId ORDER BY dateUpdated DESC";

let sql_getModuleFull = "select module.modId, name, description, percentageTable.percentage, rateTable.avgTeaching, rateTable.avgDifficulty, rateTable.avgEnjoyability, rateTable.avgWorkload, dateT.dateUpdated from module " +
                        "left join (" + sql_getModulesPercentage + ") as percentageTable on module.modId = percentageTable.modId " +
                        "left join (" + sql_getModulesAvgRatings + ") as rateTable on module.modId = rateTable.modId " +
                        "left join (" + sql_getLatestModified + ") as dateT on module.modId = dateT.modId";



// get all modules with full attribute
app.get("/getModulesFullAttribute", (req, res) =>{
    let testSql = "SELECT modId, date(dateUpdated) as test FROM review  group by modId ORDER BY dateUpdated DESC ;";
    querySql(sql_getModuleFull, (result) =>{
        res.send(result);
        console.log(result);
    });
});


app.get("/profile", passport.authenticate(["jwt"], { session: false }), (req, res) => {
    res.json(req.user);
});
*/
const port = config.get("http.port");
const ip = config.get("http.ip");

app.listen("3000", "127.0.0.1", () => {
    console.log("Server started on port 3000");
});

/*
app.use(passport.initialize());

app.get("/auth/facebook", 
    passport.authenticate("facebook", { session: false }));

app.get("/auth/facebook/callback", 
    passport.authenticate("facebook", { session: false }), generateUserToken);
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
app.get("/profile", passport.authenticate(["jwt"], { session: false }), (req, res) => {
    res.json(req.user);
});
*/



