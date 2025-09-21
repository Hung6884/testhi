const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('production_orders_directly', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    code: {
      type: DataTypes.STRING(45),
      allowNull: false,
      unique: "code_UNIQUE"
    },
    customer: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
    saler: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    color_tester: {
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
      type: DataTypes.TEXT,
      allowNull: true
    },
    order_code: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    size: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    goods_type: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    quantity: {
      type: DataTypes.DECIMAL(10,2),
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
      type: DataTypes.STRING(45),
      allowNull: true
    },
    updated_by: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    printor: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    sizing_time_start: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    sizing_time_end: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    sized_quantity: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    },
    printer: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'machines',
        key: 'id'
      }
    },
    printed_quantity: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
      defaultValue: 0.00
    },
    extracted_length: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    extracter: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'machines',
        key: 'id'
      }
    },
    printing_time_start: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    printing_time_end: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    use_customer_balance: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    price: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    },
    payment_status: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    billet_printer: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'machines',
        key: 'id'
      }
    },
    add_info: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    is_delete: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 0
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
    sizing_note: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    print_note: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    print_param: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    defective_quantity: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
      defaultValue: 0.00
    },
    remainder: {
      type: DataTypes.DECIMAL(15,2),
      allowNull: true
    },
    delivery_time_end: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    packages: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    is_save: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 1
    },
    customer_customer: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    is_exist: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    remain_quantity: {
      type: DataTypes.DECIMAL(10,2),
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
    time_created: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sized_md: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    is_export_warehouse: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    personal_pattern_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    pattern_ordinal: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sizing_type: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    sizing_device: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'machines',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'production_orders_directly',
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
        name: "fk1_idx",
        using: "BTREE",
        fields: [
          { name: "customer" },
        ]
      },
      {
        name: "fk2_idx",
        using: "BTREE",
        fields: [
          { name: "painter" },
        ]
      },
      {
        name: "fk3_idx",
        using: "BTREE",
        fields: [
          { name: "saler" },
        ]
      },
      {
        name: "fk4_idx",
        using: "BTREE",
        fields: [
          { name: "color_tester" },
        ]
      },
      {
        name: "fk5_idx",
        using: "BTREE",
        fields: [
          { name: "printor" },
        ]
      },
      {
        name: "fk6_idx",
        using: "BTREE",
        fields: [
          { name: "printer" },
        ]
      },
      {
        name: "fk7_idx",
        using: "BTREE",
        fields: [
          { name: "extracter" },
        ]
      },
      {
        name: "fk8_idx",
        using: "BTREE",
        fields: [
          { name: "billet_printer" },
        ]
      },
      {
        name: "fk99new_idx",
        using: "BTREE",
        fields: [
          { name: "pattern_id" },
        ]
      },
      {
        name: "fk99new_idx1",
        using: "BTREE",
        fields: [
          { name: "personal_pattern_id" },
        ]
      },
      {
        name: "fk99new_idx2",
        using: "BTREE",
        fields: [
          { name: "sizing_device" },
        ]
      },
    ]
  });
};
