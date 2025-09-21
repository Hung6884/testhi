const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('production_order_pets', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    code: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    customer: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'customers',
        key: 'id'
      }
    },
    painter: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    ordered_time: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    style: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    order_code: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    quantity: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    },
    price: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    },
    size: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    unit: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    images: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.TINYINT,
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
    printor: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    printer: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'machines',
        key: 'id'
      }
    },
    print_time_end: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    print_quantity: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    },
    extractor: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    extracter: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'machines',
        key: 'id'
      }
    },
    extract_time_end: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    extract_quantity: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    },
    payment_status: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    add_info: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    is_delete: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    qr_url: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    file_url: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    print_note: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    extract_note: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    print_param: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    defective_quantity: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    },
    is_print_extract: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    is_save: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    clother_type: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    deliver: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    delivery_quantity: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    },
    delivery_note: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    delivery_time_end: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    is_check: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 0
    },
    remainder: {
      type: DataTypes.DECIMAL(15,2),
      allowNull: true
    },
    paid_time: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    customer_customer: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    pattern_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'drawing_patten',
        key: 'id'
      }
    },
    cut_quantity: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    },
    cut_time_end: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    cut_note: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    cuttor: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    printed_md: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    pattern_ordinal: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    imageproduct: {
      type: DataTypes.STRING(500),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'production_order_pets',
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
        name: "fk_000001_idx",
        using: "BTREE",
        fields: [
          { name: "customer" },
        ]
      },
      {
        name: "fk_000002_idx",
        using: "BTREE",
        fields: [
          { name: "painter" },
        ]
      },
      {
        name: "fk_000003_idx",
        using: "BTREE",
        fields: [
          { name: "created_by" },
        ]
      },
      {
        name: "fk_000004_idx",
        using: "BTREE",
        fields: [
          { name: "updated_by" },
        ]
      },
      {
        name: "fk_000005_idx",
        using: "BTREE",
        fields: [
          { name: "printor" },
        ]
      },
      {
        name: "fk_000006_idx",
        using: "BTREE",
        fields: [
          { name: "printer" },
        ]
      },
      {
        name: "fk_000007_idx",
        using: "BTREE",
        fields: [
          { name: "extractor" },
        ]
      },
      {
        name: "fk_000008_idx",
        using: "BTREE",
        fields: [
          { name: "extracter" },
        ]
      },
      {
        name: "fk_000009_idx",
        using: "BTREE",
        fields: [
          { name: "deliver" },
        ]
      },
      {
        name: "fk_000010new_idx",
        using: "BTREE",
        fields: [
          { name: "pattern_id" },
        ]
      },
      {
        name: "fk_000011new_idx",
        using: "BTREE",
        fields: [
          { name: "cuttor" },
        ]
      },
    ]
  });
};
