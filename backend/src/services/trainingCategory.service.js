const InternalServerError = require('@/utils/response/InternalServerError');
const ResponseDataSuccess = require('@/utils/response/ResponseDataSuccess');
const trainingCategoryRepo = require('../repositories/trainingCategory.repository');
const logger = require('@/config/logger');

const search = async ({ options, filters, sorts }) => {
  try {
    const { count, rows } = await trainingCategoryRepo.search({
      ...options,
      filters,
      sorts,
    });
    return new ResponseDataSuccess({ count, rows });
  } catch (e) {
    logger.error('ERROR_OCCURRED_WHILE_SEARCH_CATEGORY_TRAINING', e.message);
    return new InternalServerError(e);
  }
};

module.exports = {
  search,
};
