const db = require("../db");

const User = db.sequelize.define("user", {
  userId: {
    type: db.Sequelize.INTEGER, 
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  displayName: {
    type: db.Sequelize.STRING(255),
    allowNull: false,
  },
  email: {
    type: db.Sequelize.STRING(255),
    allowNull: false,
    unique: true
  },
  fid: {
    type:db.Sequelize.STRING(255),
    unique: true
  }
});

module.exports = User;