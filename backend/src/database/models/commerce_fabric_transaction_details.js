const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('commerce_fabric_transaction_details', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    commerce_fabric_transaction_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'commerce_fabric_transactions',
        key: 'id'
      }
    },
    commerce_fabric_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'commerce_fabrics',
        key: 'id'
      }
    },
    quantity: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    price: {
      type: DataTypes.DECIMAL(10,0),
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
    }
  }, {
    sequelize,
    tableName: 'commerce_fabric_transaction_details',
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
        name: "cftd_fk_01_idx",
        using: "BTREE",
        fields: [
          { name: "commerce_fabric_transaction_id" },
        ]
      },
      {
        name: "cftd_fk_02_idx",
        using: "BTREE",
        fields: [
          { name: "commerce_fabric_id" },
        ]
      },
      {
        name: "cftd_fk_03_idx",
        using: "BTREE",
        fields: [
          { name: "created_by" },
        ]
      },
      {
        name: "cftd_fk_04_idx",
        using: "BTREE",
        fields: [
          { name: "updated_by" },
        ]
      },
    ]
  });
};
