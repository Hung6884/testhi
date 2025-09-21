const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('payments', {
    payment_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    booking_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'bookings',
        key: 'booking_id'
      },
      unique: "payments_ibfk_1"
    },
    amount: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    payment_method: {
      type: DataTypes.ENUM('credit_card','bank_transfer','cash','mobile_payment'),
      allowNull: false
    },
    transaction_id: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: "transaction_id"
    },
    status: {
      type: DataTypes.ENUM('pending','completed','failed'),
      allowNull: true,
      defaultValue: "pending"
    },
    payment_date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'payments',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "payment_id" },
        ]
      },
      {
        name: "booking_id",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "booking_id" },
        ]
      },
      {
        name: "transaction_id",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "transaction_id" },
        ]
      },
    ]
  });
};
