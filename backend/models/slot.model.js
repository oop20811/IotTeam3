module.exports = (sequelize, DataTypes) => {
  const Slot = sequelize.define("Slot", {
    slotNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    isOccupied: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  Slot.associate = (models) => {
    Slot.hasOne(models.Product, {
      foreignKey: "slotNumber",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  };

  return Slot;
};
