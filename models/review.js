const db = require('../db');

const Review = db.sequelize.define('review', {
  reviewId: {
    type: db.Sequelize.INTEGER, 
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  teaching: {
    type: db.Sequelize.INTEGER
  },
  difficulty: {
    type: db.Sequelize.INTEGER
  },
  enjoyability: {
    type: db.Sequelize.INTEGER
  },
  workload: {
    type: db.Sequelize.INTEGER
  },
  recommend: {
    type: db.Sequelize.BOOLEAN
  },
  comments: {
    type: db.Sequelize.STRING(20000)
  }
});

module.exports = Review;