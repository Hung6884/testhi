const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('timeslots', {
    slot_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    start_time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    end_time: {
      type: DataTypes.TIME,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'timeslots',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "slot_id" },
        ]
      },
      {
        name: "start_time",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "start_time" },
          { name: "end_time" },
        ]
      },
      {
        name: "idx_timeslot",
        using: "BTREE",
        fields: [
          { name: "start_time" },
          { name: "end_time" },
        ]
      },
    ]
  });
};
