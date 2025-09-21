const pick = require('lodash/pick');
const get = require('lodash/get');
const isEmpty = require('lodash/isEmpty');
const { rollCallStudentService } = require('../services/index');
const httpStatus = require('http-status');

const findByDateAndVehicleCode = async (req, res) => {
  const data = await rollCallStudentService.findByDateAndVehicleCode(
    req.query?.date,
    req.query?.vehicleCode,
  );
  if (data.status === httpStatus.OK) {
    return res.status(httpStatus.OK).send(data.data);
  }
  return res.status(data.status).send({
    message: data.message,
  });
};
const findByVehicleCode = async (req, res) => {
  const data = await rollCallStudentService.findByVehicleCode(
    req.query?.vehicleCode,
  );
  if (data.status === httpStatus.OK) {
    return res.status(httpStatus.OK).send(data.data);
  }
  return res.status(data.status).send({
    message: data.message,
  });
};

module.exports = {
  findByDateAndVehicleCode,
  findByVehicleCode
};
