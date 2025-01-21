const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];
const dbConfig = require("../config/db.config.js"); // dbConfig.js 추가
const db = {};

// Sequelize 인스턴스 생성
let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    pool: dbConfig.pool,
  });
}

// 모델 파일 동적 로드
fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && // 숨김 파일 제외
      file !== basename && // 현재 파일 제외
      file.slice(-3) === ".js" // .js 확장자 파일만
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

// 모델 간 관계 설정
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db); // models 객체 전달하여 관계 설정
  }
});

// Sequelize와 Sequelize 인스턴스 내보내기
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// 데이터베이스 초기화 및 동기화
(async () => {
  try {
    console.log("Syncing database...");
    await sequelize.sync({ alter: true }); // 데이터베이스 동기화

    console.log("Database synchronized successfully!");
  } catch (error) {
    console.error("Failed to synchronize database:", error);
  }
})();

module.exports = db;
