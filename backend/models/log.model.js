module.exports = (sequelize, DataTypes) => {
  const Log = sequelize.define("Log", {
    productName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    action: {
      type: DataTypes.ENUM("입고", "출고"),
      allowNull: false,
    },
    details: {
      type: DataTypes.STRING, // 새 필드 추가
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  return Log;
};
