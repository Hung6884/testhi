const httpStatus = require('http-status');
const get = require('lodash/get');
const isEmpty = require('lodash/isEmpty');
const pick = require('lodash/pick');
const { datDeviceService } = require('../services/index');
const { convertQuerySortToObject } = require('../utils/query.util');

const create = async (req, res) => {
  const data = await datDeviceService.create(req.body);
  if (data.status === httpStatus.OK) {
    return res.status(httpStatus.OK).send(data.data);
  }
  return res.status(data.status).send({
    message: data.message,
  });
};

const updateById = async (req, res) => {
  const data = await datDeviceService.updateById(req.params.id, req.body);
  if (data.status === httpStatus.OK) {
    return res.status(httpStatus.OK).send(data.data);
  }
  return res.status(data.status).send({
    message: data.message,
  });
};

const findById = async (req, res) => {
  const data = await datDeviceService.findById(req.params.id);
  if (data.status === httpStatus.OK) {
    return res.status(httpStatus.OK).send(data.data);
  }
  return res.status(data.status).send({
    message: data.message,
  });
};

const search = async (req, res) => {
  const filters = pick(req.query, ['serialNumber', 'simNumber', 'deviceType']);

  const options = pick(req.query, ['page', 'pageSize']);
  let sorts = convertQuerySortToObject(get(req.query, ['sorts'], ''));
  if (isEmpty(sorts)) {
    sorts = [['id', 'DESC']];
  }
  const data = await datDeviceService.search({
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

const deleteById = async (req, res) => {
  const data = await datDeviceService.deleteById(req.params.id);
  if (data.status === httpStatus.OK) {
    return res.status(httpStatus.OK).send(data.data);
  }
  return res.status(data.status).send({
    message: data.message,
  });
};

const getNotAssigned = async (req, res) => {
  const data = await datDeviceService.getNotAssigned();
  if (data.status === httpStatus.OK) {
    return res.status(httpStatus.OK).send(data.data);
  }
  return res.status(data.status).send({
    message: data.message,
  });
};

module.exports = {
  create,
  updateById,
  findById,
  search,
  deleteById,
  getNotAssigned,
};
