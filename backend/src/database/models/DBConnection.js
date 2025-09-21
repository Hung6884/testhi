const { DataTypes, Model, Sequelize } = require('sequelize');
const { dbConnectionMapping } = require('../../constant/mapping');
/**
 *
 * @param {Sequelize} sequelize
 */
module.exports = (sequelize) => {
  class DBConnection extends Model {}

  DBConnection.init(
    {
      id: {
        type: DataTypes.INTEGER(),
        allowNull: false,
        primaryKey: true,
        field: dbConnectionMapping.id,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: dbConnectionMapping.name,
      },
      host: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: dbConnectionMapping.host,
      },
      port: {
        type: DataTypes.INTEGER(),
        allowNull: true,
        field: dbConnectionMapping.port,
      },
      database: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: dbConnectionMapping.database,
      },
      username: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: dbConnectionMapping.username,
      },
      password: {
        type: DataTypes.STRING(200),
        allowNull: true,
        field: dbConnectionMapping.password,
      },
      dialect: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: dbConnectionMapping.dialect,
      },
    },
    {
      sequelize,
      freezeTableName: true,
      timestamps: false,
      modelName: 'DBConnection',
      tableName: 'db_sync_connection',
    },
  );

  return DBConnection;
};
