const logger = require('@/config/logger');
const InternalServerError = require('@/utils/response/InternalServerError');
const NotFoundError = require('@/utils/response/NotFoundError');
const ResponseDataSuccess = require('@/utils/response/ResponseDataSuccess');
const dbConnectionRepository = require('@/repositories/dbConnection.repository');

const getDbConnection = async () => {
  try {
    const record = await dbConnectionRepository.getDbConnection();
    if (!record) {
      return new NotFoundError('Db Connection Not found');
    }
    return new ResponseDataSuccess(record);
  } catch (error) {
    logger.error('ERROR_OCCURRED_WHILE_FIND_DB_CONFIG', error.message);
    return new InternalServerError(error);
  }
};

module.exports = { getDbConnection };
