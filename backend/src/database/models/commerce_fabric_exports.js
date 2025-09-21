const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('commerce_fabric_exports', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    fabric_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'commerce_fabrics',
        key: 'id'
      }
    },
    export_length: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    order_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'production_orders',
        key: 'id'
      }
    },
    order_pet_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'production_order_pets',
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
    price: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    },
    pack: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    exported_at: {
      type: DataTypes.BIGINT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'commerce_fabric_exports',
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
        name: "ecf_fk_01_idx",
        using: "BTREE",
        fields: [
          { name: "fabric_id" },
        ]
      },
      {
        name: "ecf_fk_02_idx",
        using: "BTREE",
        fields: [
          { name: "order_id" },
        ]
      },
      {
        name: "ecf_fk_03_idx",
        using: "BTREE",
        fields: [
          { name: "customer_id" },
        ]
      },
      {
        name: "ecf_fk_04_idx",
        using: "BTREE",
        fields: [
          { name: "created_by" },
        ]
      },
      {
        name: "ecf_fk_05_idx",
        using: "BTREE",
        fields: [
          { name: "updated_by" },
        ]
      },
      {
        name: "ecf_fk_06_idx",
        using: "BTREE",
        fields: [
          { name: "order_pet_id" },
        ]
      },
    ]
  });
};
