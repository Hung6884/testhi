const {
  models: { DBConnection },
} = require('../database/index');

const getDbConnection = async () => {
  return DBConnection.findOne();
};

module.exports = {
  getDbConnection,
};
