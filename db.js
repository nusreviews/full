const config = require('./config');

const mysql = require('mysql2');
const Sequelize = require('sequelize');

// Create the connection
const sequelize = new Sequelize(
    config.get('database.mysql.name'),
    config.get('database.mysql.user'),
    config.get('database.mysql.password'), 
    {
        host: config.get('database.mysql.host'),
        dialect: 'mysql'
    }
);

// Test the connection
sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch(err => {
    console.error('Unable to connect to the database:', err);
});

module.exports = {
    sequelize: sequelize,
    Sequelize: Sequelize
};