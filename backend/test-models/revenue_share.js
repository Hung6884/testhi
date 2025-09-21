const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('revenue_share', {
    revenue_id: {
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
    total_revenue: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
      defaultValue: 0.00
    },
    platform_fee: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
      defaultValue: 0.00,
      comment: "5% doanh thu"
    },
    month: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    last_updated: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'revenue_share',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "revenue_id" },
        ]
      },
      {
        name: "owner_id",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "owner_id" },
          { name: "month" },
          { name: "year" },
        ]
      },
    ]
  });
};
