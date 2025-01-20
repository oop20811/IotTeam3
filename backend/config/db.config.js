module.exports = {
  HOST: "localhost",
  USER: "cjsdn_iot_team3",
  PASSWORD: "2025team3cjsdn",
  DB: "cjsdn_team3",
  dialect: "mariadb",
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
