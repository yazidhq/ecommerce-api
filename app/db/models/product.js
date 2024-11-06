const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

module.exports = sequelize.define(
  "product",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Title cannot be null",
        },
        notEmpty: {
          msg: "Title cannot be empty",
        },
      },
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
      validate: {
        isIn: {
          args: [[true, false]],
          msg: "isFeatured value must be true or false",
        },
      },
    },
    productImage: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      validate: {
        notNull: {
          msg: "productImage cannot be null",
        },
      },
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Price cannot be null",
        },
        isDecimal: {
          msg: "Price value must be in decimal",
        },
      },
    },
    shortDescription: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: "ShortDescription cannot be null",
        },
        notEmpty: {
          msg: "ShortDescription cannot be empty",
        },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Description cannot be null",
        },
        notEmpty: {
          msg: "Description cannot be empty",
        },
      },
    },
    productUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "ProductUrl cannot be null",
        },
        notEmpty: {
          msg: "ProductUrl cannot be empty",
        },
      },
    },
    category: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: false,
      validate: {
        notNull: {
          msg: "category cannot be null",
        },
      },
    },
    tag: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      validate: {
        notNull: {
          msg: "Tag cannot be null",
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
    tableName: "product",
  }
);
