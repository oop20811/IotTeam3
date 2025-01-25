"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // slots 테이블 생성
    await queryInterface.createTable("slots", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      slotNumber: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
      },
      isOccupied: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
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

    // products 테이블 생성
    await queryInterface.createTable("products", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      slotId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "slots", // 참조하는 테이블 이름
          key: "id", // 참조하는 컬럼 (PK)
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      productName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      filePath: {
        type: Sequelize.STRING,
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
    // products 테이블 삭제
    await queryInterface.dropTable("products");

    // slots 테이블 삭제
    await queryInterface.dropTable("slots");
  },
};
