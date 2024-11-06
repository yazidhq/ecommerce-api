const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const productcategory = sequelize.define(
  "productcategory",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "ProductId cannot be null",
        },
        notEmpty: {
          msg: "ProductId cannot be empty",
        },
      },
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "CategoryId cannot be null",
        },
        notEmpty: {
          msg: "CategoryId cannot be empty",
        },
      },
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
    tableName: "productcategory",
  }
);

module.exports = productcategory;
