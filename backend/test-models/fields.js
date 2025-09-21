const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('fields', {
    field_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    owner_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'owners',
        key: 'owner_id'
      }
    },
    location: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    sport_type: {
      type: DataTypes.ENUM('football','badminton','tennis','basketball','pickleball'),
      allowNull: false
    },
    price_per_hour: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('available','unavailable'),
      allowNull: true,
      defaultValue: "available"
    },
    rating: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'fields',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "field_id" },
        ]
      },
      {
        name: "owner_id",
        using: "BTREE",
        fields: [
          { name: "owner_id" },
        ]
      },
    ]
  });
};
