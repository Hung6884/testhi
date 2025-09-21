const pick = require('lodash/pick');
const get = require('lodash/get');
const isEmpty = require('lodash/isEmpty');
const { educationalLevelService } = require('../services/index');
const { convertQuerySortToObject } = require('@/utils/query.util');
const httpStatus = require('http-status');

const search = async (req, res) => {
  const filters = pick(req.query, []);

  const options = pick(req.query, ['page', 'pageSize']);
  let sorts = convertQuerySortToObject(get(req.query, ['sorts'], ''));
  if (isEmpty(sorts)) {
    sorts = [['code', 'DESC']];
  }
  const data = await educationalLevelService.search({
    options,
    filters,
    sorts,
  });
  if (data.status === httpStatus.OK) {
    return res.status(httpStatus.OK).send(data.data);
  }
  return res.status(data.status).send({
    message: data.message,
  });
};

module.exports = {
  search,
};
