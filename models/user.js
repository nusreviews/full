const db = require('../db');

const User = db.sequelize.define('user', {
  userId: {
    type: db.Sequelize.INTEGER, 
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  lastName: {
    type: db.Sequelize.STRING(255)
  },
  firstName: {
    type: db.Sequelize.STRING(255)
  },
  email: {
    type: db.Sequelize.STRING(255),
    allowNull: false,
    unique: true
  }
});

module.exports = User;