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
const csModuleSeed = require('./seed/cs_module_seed');
const professorSeed = require('./seed/professor_seed');
const reviewSeed = require('./seed/review_seed');
const userSeed = require('./seed/user_seed');

// Order is important here
db.sequelize.dropAllSchemas().then(() => {
    return Promise.all([
        Module.sync(),
        Professor.sync(),
        User.sync()
    ]);
}).then(() => {
    return Review.sync();
}).then(() => {
    return Like.sync();
}).then(() => {
    return Promise.all(csModuleSeed.map((module) => {
        return Module.create(module);
    }));
}).then(() => {
    return Promise.all(professorSeed.map((professor) => {
        return Professor.create(professor);
    }));
}).then(() => {
    return Promise.all(userSeed.map((user) => {
        return User.create(user);
    }));
}).then(() => {
    return Promise.all(reviewSeed.map((review) => {
        return Review.create(review);
    }));
}).then(() => {
    return Promise.all(likeSeed.map((like) => {
        return Like.create(like);
    }));
}).catch((err) => {
    console.error(err);
});

