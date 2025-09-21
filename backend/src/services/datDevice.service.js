const InternalServerError = require('../utils/response/InternalServerError');
const ResponseDataSuccess = require('../utils/response/ResponseDataSuccess');
const NotFoundError = require('../utils/response/NotFoundError');
const logger = require('../config/logger');

const datDeviceRepository = require('../repositories/datDevice.repository');
const trainingVehicleRepository = require('../repositories/trainingVehicle.repository');

const create = async (body) => {
  try {
    const datDevice = await datDeviceRepository.save(body);
    return new ResponseDataSuccess(datDevice);
  } catch (error) {
    logger.error('ERROR_OCCURRED_WHILE_CREATE_DAT_DEVICE', error.message);
    return new InternalServerError(error);
  }
};

const updateById = async (id, body) => {
  try {
    const datDevice = await datDeviceRepository.findByPk(id);

    if (!datDevice) {
      return new NotFoundError('DAT device not found');
    }

    const datDeviceRes = await datDeviceRepository.updateById(body, datDevice);

    return new ResponseDataSuccess(datDeviceRes);
  } catch (error) {
    logger.error('ERROR_OCCURRED_WHILE_UPDATE_DAT_DEVICE_BY_ID', error.message);
    return new InternalServerError(error);
  }
};

const findById = async (id) => {
  try {
    const datDevice = await datDeviceRepository.findById(id);
    if (!datDevice) {
      return new NotFoundError('DAT device not found');
    }
    return new ResponseDataSuccess(datDevice);
  } catch (error) {
    logger.error('ERROR_OCCURRED_WHILE_FIND_DAT_DEVICE_BY_ID', error.message);
    return new InternalServerError(error);
  }
};

const search = async ({ options, filters, sorts }) => {
  try {
    const { page = 1, pageSize = 20 } = options;
    const { rows, count } = await datDeviceRepository.search({
      page,
      pageSize,
      filters,
      sorts,
    });

    return new ResponseDataSuccess({
      rows,
      count,
    });
  } catch (error) {
    logger.error('ERROR_OCCURRED_WHILE_SEARCH_DAT_DEVICE', error.message);
    return new InternalServerError(error);
  }
};

const deleteById = async (id) => {
  try {
    const datDevice = await datDeviceRepository.deleteById(id);
    if (!datDevice) {
      return new NotFoundError('DAT device not found');
    }
    return new ResponseDataSuccess('Success');
  } catch (error) {
    logger.error('ERROR_OCCURRED_WHILE_DELETE_DAT_DEVICE_BY_ID', error.message);
    return new InternalServerError(error);
  }
};

const getNotAssigned = async () => {
  try {
    const datDevices = await datDeviceRepository.getNotAssigned();
    return new ResponseDataSuccess(datDevices);
  } catch (error) {
    logger.error(
      'ERROR_OCCURRED_WHILE_GET_NOT_ASSIGNED_DAT_DEVICE',
      error.message,
    );
    return new InternalServerError(error);
  }
};

module.exports = {
  create,
  updateById,
  findById,
  search,
  deleteById,
  getNotAssigned,
};
