const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('subscription_plans', {
    plan_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    plan_code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: "A unique code for the plan, e.g., standard, premium",
      unique: "plan_code"
    },
    price: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    max_fields: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    description: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: "JSON array of features or description points for the plan"
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 1,
      comment: "Whether the plan is currently active and can be subscribed to"
    }
  }, {
    sequelize,
    tableName: 'subscription_plans',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "plan_id" },
        ]
      },
      {
        name: "plan_code",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "plan_code" },
        ]
      },
    ]
  });
};
