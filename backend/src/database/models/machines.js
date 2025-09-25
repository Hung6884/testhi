const Sequelize = require('sequelize');

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('machines', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING(45),
      allowNull: false,
      unique: 'code_UNIQUE',
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    type: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    working_status: {
      type: DataTypes.TINYINT,
      allowNull: true,
    },
    condition_status: {
      type: DataTypes.TINYINT,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    created_by: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    updated_at: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    updated_by: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    provider: {
      type: DataTypes.STRING(1000),
      allowNull: true,
    },
    ink: {
      type: DataTypes.STRING(1000),
      allowNull: true,
    },
    supplier_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'suppliers',
        key: 'id',
      },
    },
  }, {
    sequelize,
    tableName: 'machines',
    timestamps: false, // vì bảng dùng created_at / updated_at tùy biến chứ không phải createdAt/updatedAt
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [{ name: 'id' }],
      },
      {
        name: 'code_UNIQUE',
        unique: true,
        using: 'BTREE',
        fields: [{ name: 'code' }],
      },
      {
        name: 'fk_00001_idx',
        using: 'BTREE',
        fields: [{ name: 'supplier_id' }],
      },
    ],
  });
};
