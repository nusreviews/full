const db = require('../db');

const Professor = db.sequelize.define('professor', {
  profId: {
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
  }
});

module.exports = Professor;