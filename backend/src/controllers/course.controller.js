const httpStatus = require('http-status');
const get = require('lodash/get');
const isEmpty = require('lodash/isEmpty');
const pick = require('lodash/pick');
const { courseService } = require('../services/index');
const { convertQuerySortToObject } = require('../utils/query.util');

const create = async (req, res) => {
  const data = await courseService.create(req.body);
  if (data.status === httpStatus.OK) {
    return res.status(httpStatus.OK).send(data.data);
  }
  return res.status(data.status).send({
    message: data.message,
  });
};

const updateById = async (req, res) => {
  const data = await courseService.updateById(req.params.id, req.body);
  if (data.status === httpStatus.OK) {
    return res.status(httpStatus.OK).send(data.data);
  }
  return res.status(data.status).send({
    message: data.message,
  });
};

// const findAllByIdAndName = async (req, res) => {
//   const { query: searchText = '' } = req.query;
//   const data = await employeeService.findAllByIdAndName(searchText);
//   if (data.status === httpStatus.OK) {
//     return res.status(httpStatus.OK).send(data.data);
//   }
//   return res.status(data.status).send({
//     message: data.message,
//   });
// };

const lockById = async (req, res) => {
  const data = await courseService.lockById(req.params.id);
  if (data.status === httpStatus.OK) {
    return res.status(httpStatus.OK).send(data.data);
  }
  return res.status(data.status).send({
    message: data.message,
  });
};

const unlockById = async (req, res) => {
  const data = await courseService.unlockById(req.params.id);
  if (data.status === httpStatus.OK) {
    return res.status(httpStatus.OK).send(data.data);
  }
  return res.status(data.status).send({
    message: data.message,
  });
};

const findById = async (req, res) => {
  const data = await courseService.findById(req.params.id);
  if (data.status === httpStatus.OK) {
    return res.status(httpStatus.OK).send(data.data);
  }
  return res.status(data.status).send({
    message: data.message,
  });
};

const search = async (req, res) => {
  const filters = pick(req.query, [
    'code',
    'report1Code',
    'name',
    'trainingCategory',
    'courseStartDate',
    'courseEndDate',
    'trainingDate',
    'examinationDate',
    'internalTraining',
    'status',
  ]);

  const options = pick(req.query, ['page', 'pageSize']);
  let sorts = convertQuerySortToObject(get(req.query, ['sorts'], ''));
  if (isEmpty(sorts)) {
    sorts = [['createdDate', 'DESC']];
  }
  const data = await courseService.search({ options, filters, sorts });
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
  lockById,
  unlockById,
};
