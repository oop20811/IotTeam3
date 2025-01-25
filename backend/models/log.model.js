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
      type: DataTypes.STRING,
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    slotNumber: {
      // 새 필드 추가
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  return Log;
};
