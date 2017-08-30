const db = require('../db');

const Module = db.sequelize.define('module', {
  modId: {
    type: db.Sequelize.STRING(10), 
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: db.Sequelize.STRING(255)
  },
  description: {
    type: db.Sequelize.STRING(20000)
  }
});

module.exports = Module;