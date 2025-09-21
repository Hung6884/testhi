const { pick, isEmpty, get } = require('lodash');
const { studentService } = require('../services/index');
const httpStatus = require('http-status');
const { convertQuerySortToObject } = require('../utils/query.util');

const search = async (req, res) => {
  const filters = pick(req.query, [
    'code',
    'fullName',
    'birthday',
    'trainingCategory',
    'courseName',
    'rfidCode',
    'status',
  ]);

  const options = pick(req.query, ['page', 'pageSize']);
  const sorts = convertQuerySortToObject(get(req.query, ['sorts'], ''));
  const data = await studentService.search({ options, filters, sorts });
  if (data && data.status === httpStatus.OK) {
    return res.status(httpStatus.OK).send(data.data);
  }
  return res.status(data.status).send({ message: data.message });
};

const create = async (req, res) => {
  const data = await studentService.create(req.body);
  if (data.status === httpStatus.OK) {
    return res.status(httpStatus.OK).send(data.data);
  }
  return res.status(data.status).send({
    message: data.message,
  });
};

const updateById = async (req, res) => {
  const data = await studentService.updateById(req.params.id, req.body);
  if (data.status === httpStatus.OK) {
    return res.status(httpStatus.OK).send(data.data);
  }
  return res.status(data.status).send({
    message: data.message,
  });
};

const lockById = async (req, res) => {
  const data = await studentService.lockById(req.params.id);
  if (data.status === httpStatus.OK) {
    return res.status(httpStatus.OK).send(data.data);
  }
  return res.status(data.status).send({
    message: data.message,
  });
};

const unlockById = async (req, res) => {
  const data = await studentService.unlockById(req.params.id);
  if (data.status === httpStatus.OK) {
    return res.status(httpStatus.OK).send(data.data);
  }
  return res.status(data.status).send({
    message: data.message,
  });
};

const findById = async (req, res) => {
  const data = await studentService.findById(req.params.id);
  if (data.status === httpStatus.OK) {
    return res.status(httpStatus.OK).send(data.data);
  }
  return res.status(data.status).send({
    message: data.message,
  });
};

const assignRFCard = async (req, res) => {
  const data = await studentService.assignRFCard(req.params.id, req.body);
  if (data.status === httpStatus.OK) {
    return res.status(httpStatus.OK).send(data.data);
  }
  return res.status(data.status).send({
    message: data.message,
  });
};

const unAssignRFCard = async (req, res) => {
  const data = await studentService.unAssignRFCard(req.params.id, req.body);
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
  assignRFCard,
  unAssignRFCard,
};
