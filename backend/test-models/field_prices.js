const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('field_prices', {
    field_price_id: {
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
    slot_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'timeslots',
        key: 'slot_id'
      }
    },
    price: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'field_prices',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "field_price_id" },
        ]
      },
      {
        name: "field_id",
        using: "BTREE",
        fields: [
          { name: "field_id" },
        ]
      },
      {
        name: "slot_id",
        using: "BTREE",
        fields: [
          { name: "slot_id" },
        ]
      },
    ]
  });
};
