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


/******************************* Seed ************************************** */

const likeSeed = require('./seed/like_seed');
const moduleSeed = require('./seed/module_seed');
const professorSeed = require('./seed/professor_seed');
const reviewSeed = require('./seed/review_seed');
const userSeed = require('./seed/user_seed');

// Order is important here
db.sequelize.dropAllSchemas().then(() => {
    let syncModels = [
        Module.sync(),
        Professor.sync(),
        User.sync()
    ];

    Promise.all(syncModels).then(() => {
        Review.sync().then(() => {
            Like.sync().then(() => {
                for (module of moduleSeed) {
                    Module.create(module).catch((err) => {
                        throw err;
                    });
                }
                for (professor of professorSeed) {
                    Professor.create(professor).catch((err) => {
                        throw err;
                    });
                }
                for (user of userSeed) {
                    User.create(user).catch((err) => {
                        throw err;
                    });
                }
                for (review of reviewSeed) {
                    Review.create(review).catch((err) => {
                        throw err;
                    });
                }
                for (like of likeSeed) {
                    Like.create(like).catch((err) => {
                        throw err;
                    });
                }
            }).catch((err) => {
                console.error(err);
            });
        }).catch((err) => {
            console.error(err);
        });
    }).catch((err) => {
        console.error(err);
    });
});
