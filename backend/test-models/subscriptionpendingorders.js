const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('subscriptionpendingorders', {
    order_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    subscription_code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: "subscription_code"
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id'
      }
    },
    plan_name_snapshot: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    plan_id_snapshot: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'subscription_plans',
        key: 'plan_id'
      }
    },
    months_purchased: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    price_per_month_snapshot: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    total_cost: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    payment_method: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "banking"
    },
    status: {
      type: DataTypes.ENUM('pending','paid','cancelled','expired'),
      allowNull: true,
      defaultValue: "pending"
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'subscriptionpendingorders',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "order_id" },
        ]
      },
      {
        name: "subscription_code",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "subscription_code" },
        ]
      },
      {
        name: "plan_id_snapshot",
        using: "BTREE",
        fields: [
          { name: "plan_id_snapshot" },
        ]
      },
      {
        name: "idx_pending_orders_user_id",
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
      {
        name: "idx_pending_orders_status",
        using: "BTREE",
        fields: [
          { name: "status" },
        ]
      },
    ]
  });
};
