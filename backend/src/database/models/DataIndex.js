const { DataTypes, Model, Sequelize } = require('sequelize');

/**
 *
 * @param {Sequelize} sequelize
 */
module.exports = (sequelize) => {
  class DataIndex extends Model {}

  DataIndex.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      tableIndex: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'table_index',
      },
      tableName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'table_name',
      },
    },
    {
      sequelize,
      freezeTableName: true,
      modelName: 'DataIndex',
      tableName: 'data_indexes',
      timestamps: false,
    },
  );

  return DataIndex;
};
