const { pick, isEmpty, get } = require('lodash');
const { teacherService } = require('../services/index');
const httpStatus = require('http-status');
const { convertQuerySortToObject } = require('../utils/query.util');
const findByName = async (req, res) => {
  const data = await teacherService.findByName(req.query.name);
  if (data.status === httpStatus.OK) {
    return res.status(httpStatus.OK).send(data.data);
  }
  return res.status(data.status).send({
    message: data.message,
  });
};

const search = async (req, res) => {
  const filters = pick(req.query, [
    'id',
    'code',
    'fullName',
    'cndtCode',
    'drivingLicenseCategory',
    'rfidCode',
    'status',
  ]);

  const options = pick(req.query, ['page', 'pageSize']);
  const sorts = convertQuerySortToObject(get(req.query, ['sorts'], ''));
  const data = await teacherService.search({ options, filters, sorts });
  if (data && data.status === httpStatus.OK) {
    return res.status(httpStatus.OK).send(data.data);
  }
  return res.status(data.status).send({ message: data.message });
};

const create = async (req, res) => {
  const data = await teacherService.create(req.body);
  if (data.status === httpStatus.OK) {
    return res.status(httpStatus.OK).send(data.data);
  }
  return res.status(data.status).send({
    message: data.message,
  });
};

const updateById = async (req, res) => {
  const data = await teacherService.updateById(req.params.id, req.body);
  if (data.status === httpStatus.OK) {
    return res.status(httpStatus.OK).send(data.data);
  }
  return res.status(data.status).send({
    message: data.message,
  });
};

const lockById = async (req, res) => {
  const data = await teacherService.lockById(req.params.id);
  if (data.status === httpStatus.OK) {
    return res.status(httpStatus.OK).send(data.data);
  }
  return res.status(data.status).send({
    message: data.message,
  });
};

const unlockById = async (req, res) => {
  const data = await teacherService.unlockById(req.params.id);
  if (data.status === httpStatus.OK) {
    return res.status(httpStatus.OK).send(data.data);
  }
  return res.status(data.status).send({
    message: data.message,
  });
};

const findById = async (req, res) => {
  const data = await teacherService.findById(req.params.id);
  if (data.status === httpStatus.OK) {
    return res.status(httpStatus.OK).send(data.data);
  }
  return res.status(data.status).send({
    message: data.message,
  });
};

const assignRFCard = async (req, res) => {
  const data = await teacherService.assignRFCard(req.params.id, req.body);
  if (data.status === httpStatus.OK) {
    return res.status(httpStatus.OK).send(data.data);
  }
  return res.status(data.status).send({
    message: data.message,
  });
};

const unAssignRFCard = async (req, res) => {
  const data = await teacherService.unAssignRFCard(req.params.id, req.body);
  if (data.status === httpStatus.OK) {
    return res.status(httpStatus.OK).send(data.data);
  }
  return res.status(data.status).send({
    message: data.message,
  });
};

module.exports = {
  findByName,
  search,
  create,
  updateById,
  findById,
  lockById,
  unlockById,
  unAssignRFCard,
  assignRFCard,
};
