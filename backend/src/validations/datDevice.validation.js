const Joi = require('joi');

const createDatDevice = {
  body: Joi.object().keys({
    serialNumber: Joi.string().required(),
    simNumber: Joi.string().required(),
    deviceType: Joi.string().default('DAT'),
    handoverDate: Joi.date().optional(),
    expiryDate: Joi.date().optional(),
  }),
};

const updateDatDevice = {
  params: Joi.object().keys({
    id: Joi.number().required(),
  }),
  body: Joi.object().keys({
    serialNumber: Joi.string().required(),
    simNumber: Joi.string().required(),
    deviceType: Joi.string().default('DAT'),
    handoverDate: Joi.date().optional(),
    expiryDate: Joi.date().optional(),
  }),
};

const getDatDevice = {
  params: Joi.object().keys({
    id: Joi.number().required(),
  }),
};

const deleteDatDevice = {
  params: Joi.object().keys({
    id: Joi.number().required(),
  }),
};

module.exports = {
  createDatDevice,
  updateDatDevice,
  getDatDevice,
  deleteDatDevice,
};
