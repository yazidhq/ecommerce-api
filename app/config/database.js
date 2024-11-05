const { Sequelize } = require("sequelize");
const { development } = require("./config");

const env = process.env.NODE_ENV || development;
const config = require("./config");

const sequelize = new Sequelize(config[env]);

module.exports = sequelize;
