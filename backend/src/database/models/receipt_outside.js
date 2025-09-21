const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('receipt_outside', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'customers',
        key: 'id'
      }
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    updated_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    value: {
      type: DataTypes.DECIMAL(20,0),
      allowNull: true
    },
    remainder: {
      type: DataTypes.DECIMAL(20,0),
      allowNull: true
    },
    payment_status: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'receipt_outside',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "fk_receipt_customer_idx",
        using: "BTREE",
        fields: [
          { name: "customer_id" },
        ]
      },
      {
        name: "fk_receipt_created_by_idx",
        using: "BTREE",
        fields: [
          { name: "created_by" },
        ]
      },
      {
        name: "fk_receipt_updated_by_idx",
        using: "BTREE",
        fields: [
          { name: "updated_by" },
        ]
      },
    ]
  });
};
