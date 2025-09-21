const pick = require('lodash/pick');
const get = require('lodash/get');
const isEmpty = require('lodash/isEmpty');
const { administrationService } = require('../services/index');
const { convertQuerySortToObject } = require('@/utils/query.util');
const httpStatus = require('http-status');

const search = async (req, res) => {
  const filters = pick(req.query, []);

  const options = pick(req.query, ['page', 'pageSize']);
  let sorts = convertQuerySortToObject(get(req.query, ['sorts'], ''));
  if (isEmpty(sorts)) {
    sorts = [['fullName', 'ASC']];
  }
  const data = await administrationService.search({
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
