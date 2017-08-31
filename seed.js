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

/******************************* Seed ************************************** */

const likeSeed = require('./seed/like_seed');
const moduleSeed = require('./seed/module_seed');
const professorSeed = require('./seed/professor_seed');
const reviewSeed = require('./seed/review_seed');
const userSeed = require('./seed/user_seed');


for (module of moduleSeed) {
    Module.create(module);
}
for (user of userSeed) {
    User.create(user);
}
for (professor of professorSeed) {
    Professor.create(professor);
}
for (review of reviewSeed) {
    Review.create(review);
}
for (like of likeSeed) {
    Like.create(like);
}


