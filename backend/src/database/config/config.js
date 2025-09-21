const config = require("../../config/config.js");
module.exports = {
  development: {
    username: config.database.username,
    password: config.database.password,
    defaultDatabase: config.database.defaultDatabase,
    options: {
      host: config.database.host,
      port: config.database.port,
      dialect: config.database.dialect,
      // logging: false,
      // dialectOptions: {
      //   options: {
      //     requestTimeout: 10000,
      //   },
      // },
    },
  },
  production: {
    username: config.database.username,
    password: config.database.password,
    defaultDatabase: config.database.defaultDatabase,
    options: {
      host: config.database.host,
      port: config.database.port,
      dialect: config.database.dialect,
      // logging: false,
      // dialectOptions: {
      //   options: {
      //     requestTimeout: 10000,
      //   },
      // },
    },
  },
};
