const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('commerce_fabrics', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    code: {
      type: DataTypes.STRING(45),
      allowNull: true,
      unique: "code_UNIQUE"
    },
    fabric_type: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'metadata',
        key: 'id'
      }
    },
    import_lot_num: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    number: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    coefficient_y: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    length: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    real_length: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    export_length: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    import_at: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    pack: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    export_pack: {
      type: DataTypes.DOUBLE,
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
    tableName: 'commerce_fabrics',
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
        name: "cf_fk_01_idx",
        using: "BTREE",
        fields: [
          { name: "fabric_type" },
        ]
      },
      {
        name: "cf_fk_02_idx",
        using: "BTREE",
        fields: [
          { name: "created_by" },
        ]
      },
      {
        name: "cf_fk_03_idx",
        using: "BTREE",
        fields: [
          { name: "updated_by" },
        ]
      },
    ]
  });
};
