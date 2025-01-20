const Sequelize = require("sequelize");
const dbConfig = require("../config/db.config.js"); // dbConfig 사용

// Sequelize 인스턴스 생성
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  pool: dbConfig.pool,
});

const db = {};

// 모든 모델 정의
db.Slot = require("./slot.model")(sequelize, Sequelize.DataTypes);
db.Product = require("./product.model")(sequelize, Sequelize.DataTypes);
db.Log = require("./log.model")(sequelize, Sequelize.DataTypes);

// 모델 관계 설정
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Sequelize와 Sequelize 인스턴스 내보내기
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// 서버 초기화 시 동기화
sequelize
  .sync({ alter: true })
  .then(() => console.log("Database synchronized"))
  .catch((err) => console.error("Failed to synchronize database:", err));

module.exports = db;
