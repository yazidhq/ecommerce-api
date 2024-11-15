const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const ratelimitlogs = sequelize.define(
  "ratelimitlogs",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    ip_address: {
      type: DataTypes.STRING,
    },
    endpoint: {
      type: DataTypes.STRING,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    deletedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    paranoid: true,
    freezeTableName: true,
    tableName: "ratelimitlogs",
  }
);

module.exports = ratelimitlogs;
