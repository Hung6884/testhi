const InternalServerError = require('../utils/response/InternalServerError');
const ResponseDataSuccess = require('../utils/response/ResponseDataSuccess');
const NotFoundError = require('../utils/response/NotFoundError');
const logger = require('../config/logger');

const trainingVehicleRepository = require('../repositories/trainingVehicle.repository');
const datDeviceRepository = require('../repositories/datDevice.repository');
const { isEmpty } = require('lodash');

const create = async (body) => {
  try {
    const trainingVehicleByCode = await trainingVehicleRepository.findByCode(
      body.code,
    );
    if (trainingVehicleByCode) {
      return new InternalServerError(`Mã xe ${body.code} đã tồn tại`);
    }
    const trainingVehicleByLicensePlate =
      await trainingVehicleRepository.findByLicensePlate(body.licensePlate);
    if (trainingVehicleByLicensePlate) {
      return new InternalServerError(
        `Biển số xe ${body.licensePlate} đã tồn tại`,
      );
    }
    const trainingVehicle = await trainingVehicleRepository.save(body);
    return new ResponseDataSuccess(trainingVehicle);
  } catch (error) {
    logger.error('ERROR_OCCURRED_WHILE_CREATE_TRAINING_VEHICLE', error.message);
    return new InternalServerError(error);
  }
};

const updateById = async (id, body) => {
  try {
    const trainingVehicle = await trainingVehicleRepository.findByPk(id);

    if (!trainingVehicle) {
      return new NotFoundError('Xe tập lái không tồn tại');
    }

    const trainingVehicleByCode = await trainingVehicleRepository.findByCode(
      body.code,
    );
    if (trainingVehicleByCode && trainingVehicleByCode.id != id) {
      return new InternalServerError(`Mã xe ${body.code} đã tồn tại`);
    }

    const trainingVehicleByLicensePlate =
      await trainingVehicleRepository.findByLicensePlate(body.licensePlate);
    if (
      trainingVehicleByLicensePlate &&
      trainingVehicleByLicensePlate.id != id
    ) {
      return new InternalServerError(
        `Biển số xe ${body.licensePlate} đã tồn tại`,
      );
    }

    // Generate vehicle code from license plate by removing special characters
    if (body.licensePlate) {
      body.code = body.licensePlate.replace(/[^a-zA-Z0-9]/g, '');
    }

    const trainingVehicleRes = await trainingVehicleRepository.updateById(
      body,
      trainingVehicle,
    );

    return new ResponseDataSuccess(trainingVehicleRes);
  } catch (error) {
    logger.error(
      'ERROR_OCCURRED_WHILE_UPDATE_TRAINING_VEHICLE_BY_ID',
      error.message,
    );
    return new InternalServerError(error);
  }
};

const findById = async (id) => {
  try {
    const trainingVehicle = await trainingVehicleRepository.findById(id);
    if (trainingVehicle) return new ResponseDataSuccess(trainingVehicle);
    return new NotFoundError();
  } catch (e) {
    logger.error('ERROR_OCCURRED_WHILE_FIND_TRAINING_VEHICLE_BY_ID', e.message);
    return new InternalServerError(e);
  }
};

const search = async ({ options, filters, sorts }) => {
  try {
    const { count, rows } = await trainingVehicleRepository.search({
      ...options,
      filters,
      sorts,
    });
    return new ResponseDataSuccess({ count, rows });
  } catch (e) {
    logger.error('ERROR_OCCURRED_WHILE_SEARCH_TRAINING_VEHICLE', e.message);
    return new InternalServerError(e);
  }
};

const lockById = async (id) => {
  try {
    const trainingVehicle = await trainingVehicleRepository.lockById(id);
    if (!trainingVehicle) {
      return new NotFoundError();
    }

    return new ResponseDataSuccess('Success');
  } catch (e) {
    logger.error('ERROR_OCCURRED_WHILE_LOCK_VEHICLE_BY_ID', e.message);

    return new InternalServerError(e);
  }
};

const unlockById = async (id) => {
  try {
    const trainingVehicle = await trainingVehicleRepository.unlockById(id);
    if (!trainingVehicle) {
      return new NotFoundError();
    }

    return new ResponseDataSuccess('Success');
  } catch (e) {
    logger.error('ERROR_OCCURRED_WHILE_UNLOCK_VEHICLE_BY_ID', e.message);

    return new InternalServerError(e);
  }
};

const assignDat = async (vehicleId, body) => {
  try {
    const trainingVehicle = await trainingVehicleRepository.findByPk(vehicleId);
    if (!trainingVehicle) {
      return new NotFoundError('Xe tập lái không tồn tại');
    }

    const datDevice = await datDeviceRepository.findByPk(body.deviceId);
    if (!datDevice) {
      return new NotFoundError('Thiết bị DAT không tồn tại');
    }

    const trainingVehicleByDatId =
      await trainingVehicleRepository.findByDatDeviceId(body.deviceId);
    if (trainingVehicleByDatId && trainingVehicleByDatId.id != vehicleId) {
      return new InternalServerError(
        `Mã thiết bị DAT ${datDevice.dataValues.serialNumber} đã được gán cho xe tập lái ${trainingVehicleByDatId.code}`,
      );
    }

    await trainingVehicleRepository.updateById(
      {
        datDeviceId: body.deviceId,
        datDeviceSerial: datDevice.dataValues.serialNumber,
      },
      trainingVehicle,
    );

    return new ResponseDataSuccess('Success');
  } catch (error) {
    logger.error('ERROR_OCCURRED_WHILE_ASSIGN_DAT_DEVICE', error.message);
    return new InternalServerError(error);
  }
};

const unAssignDatDeviceToVehicle = async (id, body) => {
  try {
    const trainingVehicle = await trainingVehicleRepository.findByPk(id);
    if (!trainingVehicle) {
      return new NotFoundError('Xe tập lái không tồn tại');
    }
    const result = await trainingVehicleRepository.updateById(
      body,
      trainingVehicle,
    );
    return new ResponseDataSuccess(result);
  } catch (error) {
    logger.error('ERROR_OCCURRED_WHILE_UNASSIGN_DAT_DEVICE', error.message);
    return new InternalServerError(error);
  }
};

const findByDatDeviceSerial = async (datDeviceSerial) => {
  try {
    if (isEmpty(datDeviceSerial)) {
      return new InternalServerError('Số serial không hợp lệ');
    }
    const trainingVehicle =
      await trainingVehicleRepository.findByDatDeviceSerial(datDeviceSerial);
    if (!trainingVehicle)
      return new NotFoundError(
        `Không tồn tại Xe tập lái gắn với thiết bị DAT ${datDeviceSerial}`,
      );
    return new ResponseDataSuccess(trainingVehicle);
  } catch (e) {
    logger.error(
      'ERROR_OCCURRED_WHILE_FIND_TRAINING_VEHICLE_BY_DAT_DEVICE',
      e.message,
    );
    return new InternalServerError(e);
  }
};

const findAll = async () => {
  try {
    const trainingVehicles = await trainingVehicleRepository.findAll();
    return new ResponseDataSuccess(trainingVehicles);
  } catch (e) {
    logger.error('ERROR_OCCURRED_WHILE_FINDALL_TRAINING_VEHICLE', e.message);
    return new InternalServerError(e);
  }
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
  findAll,
};
