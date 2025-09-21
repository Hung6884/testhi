const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('metadata', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    code: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    type: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(255),
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
    can_be_delete: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    fabric_rate: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    phone_number: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    note: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'metadata',
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
    ]
  });
};
