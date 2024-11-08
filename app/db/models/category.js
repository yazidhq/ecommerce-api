const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");
const productcategory = require("./productcategory");

const category = sequelize.define(
  "category",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Category name cannot be null",
        },
        notEmpty: {
          msg: "Category name cannot be empty",
        },
      },
    },
    createdBy: {
      type: DataTypes.INTEGER,
      references: {
        model: "user",
        key: "id",
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
    tableName: "category",
  }
);

category.hasMany(productcategory, { foreignKey: "categoryId" });
productcategory.belongsTo(category, { foreignKey: "categoryId" });

module.exports = category;
