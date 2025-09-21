const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('booking_services', {
    booking_service_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    booking_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    service_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'services',
        key: 'service_id'
      }
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    total_price: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    booking_code: {
      type: DataTypes.STRING(45),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'booking_services',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "booking_service_id" },
        ]
      },
      {
        name: "service_id",
        using: "BTREE",
        fields: [
          { name: "service_id" },
        ]
      },
      {
        name: "booking_id",
        using: "BTREE",
        fields: [
          { name: "booking_code" },
        ]
      },
    ]
  });
};
