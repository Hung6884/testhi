const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('customers', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    code: {
      type: DataTypes.STRING(45),
      allowNull: false,
      unique: "code_UNIQUE"
    },
    name: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    created_by: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    updated_by: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    address: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    company: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    website: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    note: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    balance: {
      type: DataTypes.DECIMAL(15,2),
      allowNull: true
    },
    amount: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    },
    weight: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    },
    saler: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    avatar: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    birthday: {
      type: DataTypes.DATE,
      allowNull: true
    },
    first_order_at: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    is_pet: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    color_tester: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    direct_color_tester: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    is_thernal: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    account_number: {
      type: DataTypes.STRING(1000),
      allowNull: true,
      defaultValue: "19032546360016 - Ngân hàng techcombank"
    },
    last_change_warehouse: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    last_change_commerce_warehouse: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    type: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    source: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    commodity: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    pattern_location: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    fabric_location: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    is_direct: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    direct_color_tester_v2: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    fabric_position: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    pattern_position: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'customers',
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
        name: "code_UNIQUE",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "code" },
        ]
      },
      {
        name: "saler_fk_01_idx",
        using: "BTREE",
        fields: [
          { name: "saler" },
        ]
      },
      {
        name: "color_tester_fk_01_idx",
        using: "BTREE",
        fields: [
          { name: "color_tester" },
        ]
      },
      {
        name: "direct_color_tester_fk_01_idx",
        using: "BTREE",
        fields: [
          { name: "direct_color_tester" },
        ]
      },
      {
        name: "direct_color_tester_v2_fk_01",
        using: "BTREE",
        fields: [
          { name: "direct_color_tester_v2" },
        ]
      },
    ]
  });
};
