const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('users', {
    user_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    full_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: "email"
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: "phone"
    },
    role: {
      type: DataTypes.ENUM('admin','owner','customer'),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('active','inactive','banned'),
      allowNull: true,
      defaultValue: "active"
    },
    otp: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    otp_expiry: {
      type: DataTypes.DATE,
      allowNull: true
    },
    otp_attempts: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    last_otp_request: {
      type: DataTypes.DATE,
      allowNull: true
    },
    avatar: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'users',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
      {
        name: "email",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "email" },
        ]
      },
      {
        name: "phone",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "phone" },
        ]
      },
    ]
  });
};
