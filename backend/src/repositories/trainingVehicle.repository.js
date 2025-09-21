const { Op } = require('sequelize');
const helper = require('../utils/helper');
const isEmpty = require('lodash/isEmpty');
const {
  models: { TrainingVehicle, DatDevice },
} = require('../database/index');
const logger = require('@/config/logger');
const { datDeviceId } = require('@/constant/mapping/trainingVehicle');

const search = async ({
  page,
  pageSize,
  filters = {},
  sorts = [['id', 'DESC']],
}) => {
  const { offset, limit } = helper.paginate(page, pageSize);
  const where = {};
  const datWhere = {};

  for (const property in filters) {
    if (!isEmpty(filters[property])) {
      if (filters[property] === '') {
        where[property] = null;
      } else if (property === 'isActive') {
        if (filters[property] === '1') {
          where[property] = true;
        } else {
          where[property] = { [Op.or]: [null, false] };
        }
      } else if (
        property === 'drivingLicenseCategory' ||
        property === 'manufacturingYear'
      ) {
        where[property] = { [Op.eq]: filters[property] };
      } else {
        where[property] = { [Op.iLike]: `%${filters[property]}%` };
      }
    }
  }

  const response = await TrainingVehicle.findAndCountAll({
    offset,
    limit,
    where,
    distinct: true,
    order: [...sorts],
    include: [
      {
        model: DatDevice,
        as: 'datDevice',
        attributes: ['id', 'serialNumber', 'simNumber'],
      },
    ],
  });

  return response;
};

const save = async (body) => {
  const trainingVehicle = await TrainingVehicle.create(body);
  return trainingVehicle;
};

const updateById = async (body, trainingVehicle) => {
  await trainingVehicle.update(body);
  return trainingVehicle;
};

const findById = async (id) => {
  const trainingVehicle = await TrainingVehicle.findByPk(id, {
    include: [
      {
        model: DatDevice,
        as: 'datDevice',
        attributes: ['id', 'serialNumber', 'simNumber'],
      },
    ],
  });
  return trainingVehicle;
};

const findByPk = async (id) => {
  const trainingVehicle = await TrainingVehicle.findByPk(id);
  return trainingVehicle;
};

const findByDatDeviceId = async (datDeviceId) => {
  return await TrainingVehicle.findOne({
    where: {
      datDeviceId,
    },
  });
};
const findByCode = async (code) => {
  return await TrainingVehicle.findOne({
    where: {
      code,
    },
  });
};
const findByLicensePlate = async (licensePlate) => {
  return await TrainingVehicle.findOne({
    where: {
      licensePlate,
    },
  });
};
const findByDatDeviceSerial = async (datDeviceSerial) => {
  return await TrainingVehicle.findOne({
    where: {
      datDeviceSerial,
    },
  });
};

const lockById = async (id) => {
  const trainingVehicle = await TrainingVehicle.findByPk(id);
  if (!trainingVehicle) {
    return null;
  }
  await trainingVehicle.update({ isActive: false });
  return trainingVehicle;
};

const unlockById = async (id) => {
  const trainingVehicle = await TrainingVehicle.findByPk(id);
  if (!trainingVehicle) {
    return null;
  }
  await trainingVehicle.update({ isActive: 1 });
  return trainingVehicle;
};

const filterByLicensePlates = async (licensePlates) => {
  return await TrainingVehicle.findAll({
    where: {
      licensePlate: {
        [Op.in]: licensePlates,
      },
    },
  });
};

const upsert = async (trainingVehicles) => {
  try {
    await TrainingVehicle.bulkCreate(trainingVehicles, {
      updateOnDuplicate: [
        'manufacturingYear',
        'licenseIssueDate',
        'licenseExpiryDate',
        'registrationNumber',
        'licenseNumber',
        'issuingAuthority',
        'drivingLicenseCategory',
        //'createDate',
        'isActive',
      ],
    });
  } catch (err) {
    logger.error('upsert training vehicle error', err.message);
    return false;
  }
  return true;
};

const findAllByKeyPairs = async (filters) => {
  return await TrainingVehicle.findAll({
    where: {
      [Op.or]: filters,
    },
  });
};
const findAll = async () => {
  return await TrainingVehicle.findAll({
    where: {
      isActive: true,
    },
  });
};

module.exports = {
  search,
  save,
  updateById,
  findById,
  findByPk,
  lockById,
  unlockById,
  filterByLicensePlates,
  findAllByKeyPairs,
  upsert,
  findByDatDeviceId,
  findByCode,
  findByLicensePlate,
  findByDatDeviceSerial,
  findAll,
};
