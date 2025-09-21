const { Op } = require('sequelize');
const helper = require('../utils/helper');
const isEmpty = require('lodash/isEmpty');
const {
  models: { Administration },
} = require('../database/index');

const search = async ({
  page,
  pageSize,
  filters = {},
  sorts = [['id', 'DESC']],
}) => {
  const { offset, limit } = helper.paginate(page, pageSize);
  const where = {};
  for (const property in filters) {
    if (!isEmpty(filters[property])) {
      if (filters[property] === '') {
        where[property] = null;
      } else {
        where[property] = { [Op.iLike]: `%${filters[property]}%` };
      }
    }
  }
  where['isActive'] = true;

  const response = await Administration.findAndCountAll({
    offset,
    limit,
    where,
    distinct: true,
    order: [...sorts],
  });

  return response;
};

module.exports = {
  search,
};
