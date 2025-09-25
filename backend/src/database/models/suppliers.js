// src/database/models/suppliers.js
module.exports = (sequelize, DataTypes) => {
  const Suppliers = sequelize.define(
    'suppliers',
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      delegate: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      address: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      accounts: {
        type: DataTypes.TEXT, // có thể lưu JSON string nếu cần
        allowNull: true,
      },
      phone: {
        type: DataTypes.STRING(11),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'suppliers',
      timestamps: false, // bảng dump không có created_at / updated_at
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'id' }],
        },
      ],
    }
  );

  // Associations (nếu cần dùng sau này)
  Suppliers.associate = (models) => {
    // ví dụ: models.revenue_expenditure_history.belongsTo(Suppliers, { foreignKey: 'supplier_id' });
  };

  return Suppliers;
};
