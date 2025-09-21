const { Sequelize } = require('sequelize');

const getDbSequelize = (dbConnection) =>
  new Sequelize(
    dbConnection.database,
    dbConnection.username,
    dbConnection.password,
    {
      host: dbConnection.host,
      port: dbConnection.port,
      dialect: dbConnection.dialect,
      logging: false,
    },
  );

module.exports = { getDbSequelize };
