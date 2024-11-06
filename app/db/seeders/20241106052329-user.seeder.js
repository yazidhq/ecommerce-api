"use strict";

const bcrypt = require("bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     */
    return queryInterface.bulkInsert("user", [
      {
        userType: "0",
        firstName: "Super",
        lastName: "Admin",
        email: "admin@example.com",
        password: bcrypt.hashSync("superadmin", 10),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     */
    return queryInterface.bulkDelete("user", null, {});
  },
};
