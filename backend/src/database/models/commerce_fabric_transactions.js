const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('commerce_fabric_transactions', {
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
    contract: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    fabric_type: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'metadata',
        key: 'id'
      }
    },
    order_code: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    quantity: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    price: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: true
    },
    note: {
      type: DataTypes.TEXT,
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
    updated_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    is_approved: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 1
    }
  }, {
    sequelize,
    tableName: 'commerce_fabric_transactions',
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
        name: "cft_fk_01_idx",
        using: "BTREE",
        fields: [
          { name: "customer_id" },
        ]
      },
      {
        name: "cft_fk_02_idx",
        using: "BTREE",
        fields: [
          { name: "fabric_type" },
        ]
      },
      {
        name: "cft_fk_03_idx",
        using: "BTREE",
        fields: [
          { name: "created_by" },
        ]
      },
      {
        name: "cft_fk_04_idx",
        using: "BTREE",
        fields: [
          { name: "updated_by" },
        ]
      },
    ]
  });
};
