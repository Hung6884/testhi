const { Op } = require('sequelize');
const helper = require('../utils/helper');
const isEmpty = require('lodash/isEmpty');
const {
  models: { DatDevice, TrainingVehicle },
} = require('../database/index');

const search = async ({
  page,
  pageSize,
  filters = {},
  sorts = [['id', 'DESC']],
}) => {
  const { offset, limit } = helper.paginate(page, pageSize);
  const where = {};

  for (const property in filters) {
    if (!isEmpty(filters[property])) {
      if (filters[property] === '') {
        where[property] = null;
      } else if (property === 'status') {
        if (filters[property] === 'true' || filters[property] === true) {
          where[property] = true;
        } else {
          where[property] = { [Op.or]: [null, false] };
        }
      } else {
        where[property] = { [Op.iLike]: `%${filters[property]}%` };
      }
    }
  }

  const response = await DatDevice.findAndCountAll({
    offset,
    limit,
    where,
    distinct: true,
    order: [...sorts],
    include: [
      {
        model: TrainingVehicle,
        as: 'vehicle',
        attributes: ['id', 'licensePlate', 'code'],
      },
    ],
  });

  return response;
};

const save = async (body) => {
  const datDevice = await DatDevice.create(body);
  return datDevice;
};

const updateById = async (body, datDevice) => {
  await datDevice.update(body);
  return datDevice;
};

const findById = async (id) => {
  const datDevice = await DatDevice.findByPk(id, {
    include: [
      {
        model: TrainingVehicle,
        as: 'vehicle',
        attributes: ['id', 'licensePlate', 'code'],
      },
    ],
  });
  return datDevice;
};

const findByPk = async (id) => {
  const datDevice = await DatDevice.findByPk(id);
  return datDevice;
};

const deleteById = async (id) => {
  const datDevice = await DatDevice.findByPk(id);
  if (!datDevice) {
    return null;
  }
  await datDevice.destroy();
  return datDevice;
};

const getNotAssigned = async () => {
  const datDevices = await DatDevice.findAll({
    include: [
      {
        model: TrainingVehicle,
        as: 'vehicle',
        required: false, // LEFT JOIN
        attributes: [],
      },
    ],
    where: {
      '$vehicle.id$': null,
    },
  });
  return datDevices;
};

module.exports = {
  search,
  save,
  updateById,
  findById,
  findByPk,
  deleteById,
  getNotAssigned,
};
