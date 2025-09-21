const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('payment_order_pet_history', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    pet_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'production_order_pets',
        key: 'id'
      }
    },
    pay_time: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    cost: {
      type: DataTypes.DECIMAL(20,0),
      allowNull: true
    },
    revenue_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'revenue_expenditure_history',
        key: 'id'
      }
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'customers',
        key: 'id'
      }
    },
    type: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    customer_balance: {
      type: DataTypes.DECIMAL(20,0),
      allowNull: true
    },
    note: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    receipt_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'receipt_outside',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'payment_order_pet_history',
    timestamps: false,
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
        name: "fk_poph_idx",
        using: "BTREE",
        fields: [
          { name: "pet_id" },
        ]
      },
      {
        name: "fk_poph_02_idx",
        using: "BTREE",
        fields: [
          { name: "revenue_id" },
        ]
      },
      {
        name: "fk_poph_03_idx",
        using: "BTREE",
        fields: [
          { name: "customer_id" },
        ]
      },
      {
        name: "fk_poph_04_idx",
        using: "BTREE",
        fields: [
          { name: "receipt_id" },
        ]
      },
    ]
  });
};
