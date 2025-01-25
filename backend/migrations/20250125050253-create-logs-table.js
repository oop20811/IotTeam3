"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Logs", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      productName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      action: {
        type: Sequelize.ENUM("입고", "출고"),
        allowNull: false,
      },
      details: {
        type: Sequelize.STRING,
      },
      timestamp: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      slotNumber: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Logs");
  },
};
