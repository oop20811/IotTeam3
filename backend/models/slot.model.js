module.exports = (sequelize, DataTypes) => {
  const Slot = sequelize.define(
    "Slot",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      slotNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      isOccupied: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: "slots",
      freezeTableName: true,
    }
  );

  Slot.associate = (models) => {
    // 1:1 관계 (Slot hasOne Product)
    Slot.hasOne(models.Product, {
      foreignKey: "slotId", // Product 모델에서의 FK 칼럼
      sourceKey: "id", // Slot의 PK
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  };

  return Slot;
};
