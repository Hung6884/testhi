const { pick, isEmpty, get } = require('lodash');
const { rfCardService } = require('../services/index');
const httpStatus = require('http-status');
const { convertQuerySortToObject } = require('../utils/query.util');

const search = async (req, res) => {
  const filters = pick(req.query, ['id', 'code', 'cardNumber', 'status']);

  const options = pick(req.query, ['page', 'pageSize']);
  const sorts = convertQuerySortToObject(get(req.query, ['sorts'], ''));
  const data = await rfCardService.search({ options, filters, sorts });
  if (data && data.status === httpStatus.OK) {
    return res.status(httpStatus.OK).send(data.data);
  }
  return res.status(data.status).send({ message: data.message });
};

const create = async (req, res) => {
  const data = await rfCardService.create(req.body);
  if (data.status === httpStatus.OK) {
    return res.status(httpStatus.OK).send(data.data);
  }
  return res.status(data.status).send({
    message: data.message,
  });
};

const updateById = async (req, res) => {
  const data = await rfCardService.updateById(req.params.id, req.body);
  if (data.status === httpStatus.OK) {
    return res.status(httpStatus.OK).send(data.data);
  }
  return res.status(data.status).send({
    message: data.message,
  });
};

const lockById = async (req, res) => {
  const data = await rfCardService.lockById(req.params.id);
  if (data.status === httpStatus.OK) {
    return res.status(httpStatus.OK).send(data.data);
  }
  return res.status(data.status).send({
    message: data.message,
  });
};
const getRFCards = async (req, res) => {
  const data = await rfCardService.getRFCards();
  if (data.status === httpStatus.OK) {
    return res.status(httpStatus.OK).send(data.data);
  }
  return res.status(data.status).send({
    message: data.message,
  });
};

const unlockById = async (req, res) => {
  const data = await rfCardService.unlockById(req.params.id);
  if (data.status === httpStatus.OK) {
    return res.status(httpStatus.OK).send(data.data);
  }
  return res.status(data.status).send({
    message: data.message,
  });
};

const findById = async (req, res) => {
  const data = await rfCardService.findById(req.params.id);
  if (data.status === httpStatus.OK) {
    return res.status(httpStatus.OK).send(data.data);
  }
  return res.status(data.status).send({
    message: data.message,
  });
};

module.exports = {
  search,
  create,
  updateById,
  findById,
  lockById,
  unlockById,
  getRFCards,
};
