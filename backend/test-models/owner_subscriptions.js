const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('owner_subscriptions', {
    subscription_id: {
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
    plan_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'subscription_plans',
        key: 'plan_id'
      }
    },
    source_pending_order_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'subscriptionpendingorders',
        key: 'order_id'
      },
      unique: "owner_subscriptions_ibfk_3"
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('active','expired'),
      allowNull: true,
      defaultValue: "active"
    },
    purchase_date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'owner_subscriptions',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "subscription_id" },
        ]
      },
      {
        name: "source_pending_order_id",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "source_pending_order_id" },
        ]
      },
      {
        name: "idx_owner_subscriptions_owner_id",
        using: "BTREE",
        fields: [
          { name: "owner_id" },
        ]
      },
      {
        name: "idx_owner_subscriptions_plan_id",
        using: "BTREE",
        fields: [
          { name: "plan_id" },
        ]
      },
      {
        name: "idx_owner_subscriptions_end_date",
        using: "BTREE",
        fields: [
          { name: "end_date" },
        ]
      },
    ]
  });
};
