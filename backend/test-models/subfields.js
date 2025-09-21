const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('subfields', {
    sub_field_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    field_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'fields',
        key: 'field_id'
      }
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('available','unavailable'),
      allowNull: true,
      defaultValue: "available"
    }
  }, {
    sequelize,
    tableName: 'subfields',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "sub_field_id" },
        ]
      },
      {
        name: "field_id",
        using: "BTREE",
        fields: [
          { name: "field_id" },
        ]
      },
    ]
  });
};
