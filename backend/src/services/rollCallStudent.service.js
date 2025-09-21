const InternalServerError = require('../utils/response/InternalServerError');
const ResponseDataSuccess = require('../utils/response/ResponseDataSuccess');
const rollCallStudentRepo = require('../repositories/rollCallStudent.repository');
const logger = require('@/config/logger');
const { isEmpty } = require('lodash');

const findByDateAndVehicleCode = async (date, vehicleCode) => {
  if (!date || !vehicleCode) {
    return new InternalServerError('Tham số không hợp lệ');
  }
  try {
    const results = await rollCallStudentRepo.findByDateAndVehicleCode(
      date,
      vehicleCode,
    );
    return new ResponseDataSuccess(results);
  } catch (err) {
    logger.error('Get All SESSION OF STUDENT ERROR', err.message);
    return new InternalServerError(err.message);
  }
};
const findByVehicleCode = async (vehicleCode) => {
  if (isEmpty(vehicleCode)) {
    return new InternalServerError('Tham số không hợp lệ');
  }
  try {
    const results = await rollCallStudentRepo.findByVehicleCode(
      vehicleCode,
    );
    return new ResponseDataSuccess(results);
  } catch (err) {
    logger.error('Get SESSION OF STUDENT BY vehicleCode ERROR', err.message);
    return new InternalServerError(err.message);
  }
};

module.exports = {
  findByDateAndVehicleCode,
  findByVehicleCode
};
