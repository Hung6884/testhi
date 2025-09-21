const httpStatus = require('http-status');
const { dbConnectionService } = require('../services');

const getDbConnection = async (req, res) => {
  const data = await dbConnectionService.getDbConnection();
  if (data.status === httpStatus.OK) {
    return res.status(httpStatus.OK).send(data.data);
  }
  return res.status(data.status).send({
    message: data.message,
  });
};

module.exports = {
  getDbConnection,
};
