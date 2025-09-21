const InternalServerError = require('@/utils/response/InternalServerError');
const ResponseDataSuccess = require('@/utils/response/ResponseDataSuccess');
const repo = require('../repositories/teachingSubject.repository');
const logger = require('@/config/logger');

const search = async ({ options, filters, sorts }) => {
  try {
    const { count, rows } = await repo.search({
      ...options,
      filters,
      sorts,
    });
    return new ResponseDataSuccess({ count, rows });
  } catch (e) {
    logger.error('ERROR_OCCURRED_WHILE_SEARCH_TEACHING_SUBJECT', e.message);
    return new InternalServerError(e);
  }
};

module.exports = {
  search,
};
