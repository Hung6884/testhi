const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('bookings', {
    booking_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    booking_code: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'user_id'
      }
    },
    field_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'fields',
        key: 'field_id'
      }
    },
    start_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    end_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    promo_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'promotions',
        key: 'promo_id'
      }
    },
    total_cost: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('pending','confirmed','cancelled','completed'),
      allowNull: true,
      defaultValue: "pending"
    },
    payment_method: {
      type: DataTypes.STRING(45),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'bookings',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "booking_id" },
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
        name: "promo_id",
        using: "BTREE",
        fields: [
          { name: "promo_id" },
        ]
      },
      {
        name: "idx_booking_time",
        using: "BTREE",
        fields: [
          { name: "start_time" },
          { name: "end_time" },
        ]
      },
      {
        name: "bookings_ibfk_1_idx",
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
    ]
  });
};
