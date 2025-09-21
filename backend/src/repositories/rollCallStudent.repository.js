const { Op, where, col, fn } = require('sequelize');
const isEmpty = require('lodash/isEmpty');
const {
  models: { RollCallStudent, HistoryData },
} = require('../database/index');

const findByDateAndVehicleCode = async (date, vehicleCode) => {
  return await RollCallStudent.findAll({
    where: {
      licensePlate: vehicleCode,
      [Op.and]: [
        where(fn('DATE', col('RollCallStudent.thoi_diem')), '=', date),
        where(fn('DATE', col('thoi_diem_logout')), '=', date),
      ],
    },
    include: [
      {
        model: HistoryData,
        attributes: [
          'id',
          'studentId',
          'studentCode',
          'rollCallStudentUUID',
          'lat',
          'lng',
          ['thoi_diem', 'time'],
        ],
        as: 'historyDatas',
        required: false,
      },
    ],
    raw: false,
  });
};
const findByVehicleCode = async (vehicleCode) => {
  return await RollCallStudent.findAll({
    where: {
      licensePlate: vehicleCode,
    },
    include: [
      {
        model: HistoryData,
        attributes: [
          'id',
          'studentId',
          'studentCode',
          'rollCallStudentUUID',
          'lat',
          'lng',
          ['thoi_diem', 'time'],
        ],
        as: 'historyDatas',
        required: false,
      },
    ],
    raw: false,
  });
};
module.exports = {
  findByDateAndVehicleCode,
  findByVehicleCode
};
