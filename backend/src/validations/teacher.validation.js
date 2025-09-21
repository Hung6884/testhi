const Joi = require('joi');

const createTeacher = {
  body: Joi.object().keys({
    code: Joi.string().required(),
    name: Joi.string().required(),
    avatar: Joi.string().required(),
    address: Joi.string().optional(),
    drivingLicenseCategory: Joi.string().required(),
    middleName: Joi.string().required(),
    cndtCode: Joi.string().optional(),
    rfidCode: Joi.string().optional(),
    educationalLevelCode: Joi.string().required(),
    teachingSubjectCode: Joi.string().optional(),
    birthday: Joi.date().required(),
    nationalId: Joi.string().required(),
    phone: Joi.string().required(),
  }),
};

const updateTeacher = {
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
  body: Joi.object().keys({
    code: Joi.string().required(),
    name: Joi.string().required(),
    avatar: Joi.string().required(),
    address: Joi.string().optional(),
    drivingLicenseCategory: Joi.string().required(),
    middleName: Joi.string().required(),
    cndtCode: Joi.string().optional(),
    rfidCode: Joi.string().optional(),
    educationalLevelCode: Joi.string().required(),
    teachingSubjectCode: Joi.string().optional(),
    birthday: Joi.date().required(),
    nationalId: Joi.string().required(),
    phone: Joi.string().required(),
  }),
};

const lockTeacher = {
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
};

module.exports = {
  createTeacher,
  updateTeacher,
  lockTeacher,
};
