const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('revenue_expenditure_history', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    code: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    rtype: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    note: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    value: {
      type: DataTypes.DECIMAL(15,2),
      allowNull: true
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    state: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'customers',
        key: 'id'
      }
    },
    supplier_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'suppliers',
        key: 'id'
      }
    },
    is_pet: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    can_be_delete: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    balance: {
      type: DataTypes.DECIMAL(15,2),
      allowNull: true
    },
    is_balance: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    reduce_cost: {
      type: DataTypes.DECIMAL(15,2),
      allowNull: true
    },
    payment_method: {
      type: DataTypes.TINYINT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'revenue_expenditure_history',
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
        name: "fk_01_idx",
        using: "BTREE",
        fields: [
          { name: "created_by" },
        ]
      },
      {
        name: "fk_02_idx",
        using: "BTREE",
        fields: [
          { name: "customer_id" },
        ]
      },
      {
        name: "fk_03_idx",
        using: "BTREE",
        fields: [
          { name: "supplier_id" },
        ]
      },
    ]
  });
};
