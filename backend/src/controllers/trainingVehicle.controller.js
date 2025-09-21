const httpStatus = require('http-status');
const get = require('lodash/get');
const isEmpty = require('lodash/isEmpty');
const pick = require('lodash/pick');
const { trainingVehicleService } = require('../services/index');
const { convertQuerySortToObject } = require('../utils/query.util');

const create = async (req, res) => {
  const data = await trainingVehicleService.create(req.body);
  if (data.status === httpStatus.OK) {
    return res.status(httpStatus.OK).send(data.data);
  }
  return res.status(data.status).send({
    message: data.message,
  });
};

const updateById = async (req, res) => {
  const data = await trainingVehicleService.updateById(req.params.id, req.body);
  if (data.status === httpStatus.OK) {
    return res.status(httpStatus.OK).send(data.data);
  }
  return res.status(data.status).send({
    message: data.message,
  });
};

const findById = async (req, res) => {
  const data = await trainingVehicleService.findById(req.params.id);
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
    'licensePlate',
    'manufacturingYear',
    'drivingLicenseCategory',
    'datDeviceSerial',
    'isActive',
  ]);

  const options = pick(req.query, ['page', 'pageSize']);
  let sorts = convertQuerySortToObject(get(req.query, ['sorts'], ''));
  if (isEmpty(sorts)) {
    sorts = [['id', 'DESC']];
  }
  const data = await trainingVehicleService.search({
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

const lockById = async (req, res) => {
  const data = await trainingVehicleService.lockById(req.params.id);
  if (data.status === httpStatus.OK) {
    return res.status(httpStatus.OK).send(data.data);
  }
  return res.status(data.status).send({
    message: data.message,
  });
};

const unlockById = async (req, res) => {
  const data = await trainingVehicleService.unlockById(req.params.id);
  if (data.status === httpStatus.OK) {
    return res.status(httpStatus.OK).send(data.data);
  }
  return res.status(data.status).send({
    message: data.message,
  });
};

const assignDat = async (req, res) => {
  const data = await trainingVehicleService.assignDat(req.params.id, req.body);
  if (data.status === httpStatus.OK) {
    return res.status(httpStatus.OK).send(data.data);
  }
  return res.status(data.status).send({
    message: data.message,
  });
};

const unAssignDatDeviceToVehicle = async (req, res) => {
  const data = await trainingVehicleService.unAssignDatDeviceToVehicle(
    req.params.id,
    req.body,
  );
  if (data.status === httpStatus.OK) {
    return res.status(httpStatus.OK).send(data.data);
  }
  return res.status(data.status).send({
    message: data.message,
  });
};

const findByDatDeviceSerial = async (req, res) => {
  const data = await trainingVehicleService.findByDatDeviceSerial(
    req.query?.datDeviceSerial,
  );
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
  assignDat,
  unAssignDatDeviceToVehicle,
  findByDatDeviceSerial,
};
