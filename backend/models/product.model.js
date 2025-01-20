module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    "Product",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      slotNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      productName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      filePath: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "products",
      timestamps: true, // timestamps 활성화
    }
  );
  Product.associate = (models) => {
    Product.belongsTo(models.Slot, {
      foreignKey: "slotNumber", // Product에서 외래키로 사용할 컬럼
      targetKey: "slotNumber", // Slot의 참조 키
    });
  };
  return Product;
};
