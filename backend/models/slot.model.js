module.exports = (sequelize, Sequelize) => {
  const Slot = sequelize.define(
    "slot",
    {
      slotNumber: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
      },
      isOccupied: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      timestamps: true, // timestamps 활성화
    }
  );
  Slot.associate = (models) => {
    Slot.hasOne(models.Product, {
      foreignKey: "slotNumber", // Product에서 외래키로 사용할 컬럼
      sourceKey: "slotNumber", // Slot의 참조 키
    });
  };

  return Slot;
};
