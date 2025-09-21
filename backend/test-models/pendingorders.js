const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('pendingorders', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    field_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    booking_code: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: "booking_code"
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    time_slots: {
      type: DataTypes.JSON,
      allowNull: false
    },
    total_cost: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    services: {
      type: DataTypes.JSON,
      allowNull: true
    },
    payment_method: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('pending','paid','cancelled'),
      allowNull: true,
      defaultValue: "pending"
    }
  }, {
    sequelize,
    tableName: 'pendingorders',
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
        name: "booking_code",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "booking_code" },
        ]
      },
    ]
  });
};
