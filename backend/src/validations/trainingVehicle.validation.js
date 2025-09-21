const Joi = require('joi');

const createTrainingVehicle = {
  body: Joi.object().keys({
    licensePlate: Joi.string().required(),
    code: Joi.string().required(),
    owner: Joi.string().optional(),
    drivingLicenseCategory: Joi.string().optional(),
    registrationNumber: Joi.string().optional(),
    manufacturingYear: Joi.number().integer().optional(),
    licenseNumber: Joi.string().optional(),
    issuingAuthority: Joi.string().optional(),
    licenseIssueDate: Joi.date().optional(),
    licenseExpiryDate: Joi.date().optional(),
    datDeviceId: Joi.number().integer().optional(),
    datDeviceSerial: Joi.string().optional(),
  }),
};

const updateTrainingVehicle = {
  params: Joi.object().keys({
    id: Joi.number().required(),
  }),
  body: Joi.object().keys({
    licensePlate: Joi.string().required(),
    code: Joi.string().required(),
    owner: Joi.string().optional(),
    drivingLicenseCategory: Joi.string().optional(),
    registrationNumber: Joi.string().optional(),
    manufacturingYear: Joi.number().integer().optional(),
    licenseNumber: Joi.string().optional(),
    issuingAuthority: Joi.string().optional(),
    licenseIssueDate: Joi.date().optional(),
    licenseExpiryDate: Joi.date().optional(),
    datDeviceId: Joi.number().integer().optional(),
    datDeviceSerial: Joi.string().optional(),
  }),
};

const getTrainingVehicle = {
  params: Joi.object().keys({
    id: Joi.number().required(),
  }),
};

const lock = {
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
};

module.exports = {
  createTrainingVehicle,
  updateTrainingVehicle,
  getTrainingVehicle,
  lock,
};
