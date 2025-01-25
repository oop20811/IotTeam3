module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    "Product",
    {
      productName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      filePath: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      slotId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "slots", // 소문자 테이블명
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
    },
    {
      // 실제 DB 테이블 이름 설정
      tableName: "products",
      // 복수/소문자 자동변환 방지
      freezeTableName: true,
    }
  );

  Product.associate = (models) => {
    // 1:1 관계 (Product belongsTo Slot)
    Product.belongsTo(models.Slot, {
      foreignKey: "slotId", // Product 테이블의 FK
      targetKey: "id", // Slot 테이블의 PK
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  };

  return Product;
};
