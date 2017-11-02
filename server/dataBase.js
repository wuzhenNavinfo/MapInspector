const config = require('./config');
const Sequelize = require('sequelize');

module.exports = new Sequelize(
    config.DB_NAME,
    config.DB_USER,
    config.DB_PWD,
    {
        host: config.DB_HOST,
        dialect: 'mysql',
        pool: {
            max: 5,
            min: 0,
            idle: 10000
        }
    }
);
